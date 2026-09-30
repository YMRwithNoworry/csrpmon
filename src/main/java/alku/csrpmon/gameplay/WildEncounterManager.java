package alku.csrpmon.gameplay;

import alku.csrp.entity.Parasite;
import alku.csrp.world.SrpWorldData;
import alku.csrpmon.Csrpmon;
import alku.csrpmon.config.CsrpmonConfig;
import alku.csrpmon.species.ParasiteSpecies;
import alku.csrpmon.species.ParasiteSpeciesMap;
import com.cobblemon.mod.common.api.pokemon.PokemonProperties;
import com.cobblemon.mod.common.battles.BattleBuilder;
import com.cobblemon.mod.common.battles.BattleRegistry;
import com.cobblemon.mod.common.battles.BattleStartResult;
import com.cobblemon.mod.common.battles.SuccessfulBattleStart;
import com.cobblemon.mod.common.entity.pokemon.PokemonEntity;
import com.cobblemon.mod.common.item.PokeBallItem;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.core.registries.Registries;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceKey;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResult;
import net.minecraft.world.level.Level;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.phys.EntityHitResult;
import net.minecraft.world.phys.HitResult;
import net.minecraft.world.phys.Vec3;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.event.entity.player.PlayerInteractEvent;
import net.neoforged.neoforge.event.tick.ServerTickEvent;

/**
 * Turns a wild CSRP creature into a Cobblemon battle encounter.
 *
 * <p>The creature is swapped for a {@link PokemonEntity} carrying the matching {@code csrpmon}
 * species, Cobblemon is asked to start a wild battle, and the original creature is restored when the
 * player runs away. Everything else - moves, type chart, health, catching, experience - is handled
 * by Cobblemon itself, so a CSRP creature really does fight like any other Pokemon.</p>
 */
@EventBusSubscriber(modid = Csrpmon.MODID)
public final class WildEncounterManager {
    /** Encounters currently being fought, keyed by Cobblemon battle id. */
    private static final Map<UUID, PendingEncounter> ACTIVE = new HashMap<>();
    /** How far down the crosshair a thrown ball looks for a CSRP creature. */
    private static final double LOOK_DISTANCE = 24.0D;

    private WildEncounterManager() {
    }

    private record PendingEncounter(ResourceLocation csrpTypeId, ResourceLocation dimension,
                                    Vec3 position, float yaw, int pokemonEntityId) {
    }

    @SubscribeEvent
    public static void onEntityInteract(PlayerInteractEvent.EntityInteract event) {
        if (!CsrpmonConfig.ENCOUNTERS_ENABLED.get()) {
            return;
        }
        if (!(event.getEntity() instanceof ServerPlayer player)) {
            return;
        }
        if (!(event.getTarget() instanceof Mob creature) || !(creature instanceof Parasite)) {
            return;
        }
        if (!creature.isAlive() || player.isSpectator()) {
            return;
        }
        ResourceLocation typeId = BuiltInRegistries.ENTITY_TYPE.getKey(creature.getType());
        if (!ParasiteSpeciesMap.CSRP_NAMESPACE.equals(typeId.getNamespace())) {
            return;
        }
        ParasiteSpecies entry = ParasiteSpeciesMap.byCsrpPath(typeId.getPath());
        if (entry == null) {
            return;
        }
        if (CsrpmonConfig.POKE_BALL_CAPTURE.get() && isHoldingBall(player, event.getHand())) {
            // Throwing a ball should try to catch the creature rather than open a battle. Swap it
            // for a wild Pokemon in place and leave the interaction uncancelled so the ball is
            // actually thrown; Cobblemon's own ball then runs its capture on a real PokemonEntity.
            if (BattleRegistry.getBattleByParticipatingPlayer(player) != null) {
                player.displayClientMessage(Component.translatable("csrpmon.message.already_in_battle"), true);
                return;
            }
            swapForWildPokemon(player, creature, entry);
            return;
        }
        if (!shouldStartBattle(player, event)) {
            return;
        }
        if (BattleRegistry.getBattleByParticipatingPlayer(player) != null) {
            player.displayClientMessage(Component.translatable("csrpmon.message.already_in_battle"), true);
            return;
        }
        event.setCanceled(true);
        event.setCancellationResult(InteractionResult.SUCCESS);
        startEncounter(player, creature, entry, typeId);
    }

    private static boolean shouldStartBattle(ServerPlayer player, PlayerInteractEvent.EntityInteract event) {
        boolean holdingBall = player.getItemInHand(event.getHand()).getItem() instanceof PokeBallItem;
        if (!holdingBall && !CsrpmonConfig.REQUIRE_POKE_BALL.get()) {
            return player.isShiftKeyDown() || CsrpmonConfig.SNEAK_ALSO_STARTS_BATTLE.get();
        }
        if (holdingBall) {
            return true;
        }
        return CsrpmonConfig.SNEAK_ALSO_STARTS_BATTLE.get() && player.isShiftKeyDown();
    }

    private static void startEncounter(ServerPlayer player, Mob creature, ParasiteSpecies entry, ResourceLocation typeId) {
        ServerLevel level = (ServerLevel) creature.level();
        Vec3 position = creature.position();
        float yaw = creature.getYRot();

        PokemonEntity pokemon = spawnWildPokemon(level, player, entry, position, yaw);
        if (pokemon == null) {
            return;
        }

        BattleStartResult result = BattleBuilder.INSTANCE.pve(player, pokemon);
        if (result instanceof SuccessfulBattleStart started) {
            creature.discard();
            ACTIVE.put(started.getBattle().getBattleId(), new PendingEncounter(
                    typeId, level.dimension().location(), position, yaw, pokemon.getId()));
            Csrpmon.LOGGER.debug("Started a CSRPmon battle against {}", entry.speciesId());
        } else {
            pokemon.discard();
            player.displayClientMessage(Component.translatable("csrpmon.message.battle_failed"), true);
        }
    }

    /**
     * Builds a wild Pokemon for a CSRP creature and puts it in the world. The Pokemon is wild
     * because {@code createEntity} leaves its store coordinates unset, which is exactly the state
     * Cobblemon requires before its ball will attempt a capture.
     */
    private static PokemonEntity spawnWildPokemon(ServerLevel level, ServerPlayer player,
                                                  ParasiteSpecies entry, Vec3 position, float yaw) {
        int pokemonLevel = rollLevel(level, entry);
        String properties = "species=" + ParasiteSpeciesMap.SPECIES_NAMESPACE + ":" + entry.speciesId()
                + " level=" + pokemonLevel;
        PokemonEntity pokemon;
        try {
            pokemon = PokemonProperties.Companion.parse(properties).createEntity(level, player);
        } catch (RuntimeException e) {
            Csrpmon.LOGGER.error("Could not create the {} encounter: {}", entry.speciesId(), e.toString());
            return null;
        }
        pokemon.moveTo(position.x, position.y, position.z, yaw, 0.0F);
        pokemon.setYHeadRot(yaw);
        pokemon.setPersistenceRequired();
        level.addFreshEntity(pokemon);
        return pokemon;
    }

    /**
     * Throwing a ball without aiming square at the creature (right-click in the air) still has to be
     * able to catch it, so this looks down the crosshair and swaps whatever CSRP creature it lands
     * on. The ball is thrown straight afterwards and finds a real wild Pokemon in its path.
     */
    @SubscribeEvent
    public static void onRightClickItem(PlayerInteractEvent.RightClickItem event) {
        if (!CsrpmonConfig.ENCOUNTERS_ENABLED.get() || !CsrpmonConfig.POKE_BALL_CAPTURE.get()) {
            return;
        }
        if (!(event.getEntity() instanceof ServerPlayer player)) {
            return;
        }
        if (player.isSpectator() || !isHoldingBall(player, event.getHand())) {
            return;
        }
        if (BattleRegistry.getBattleByParticipatingPlayer(player) != null) {
            return;
        }
        Mob creature = lookedAtCreature(player);
        if (creature == null) {
            return;
        }
        ResourceLocation typeId = BuiltInRegistries.ENTITY_TYPE.getKey(creature.getType());
        if (!ParasiteSpeciesMap.CSRP_NAMESPACE.equals(typeId.getNamespace())) {
            return;
        }
        ParasiteSpecies entry = ParasiteSpeciesMap.byCsrpPath(typeId.getPath());
        if (entry == null) {
            return;
        }
        swapForWildPokemon(player, creature, entry);
    }

    private static boolean isHoldingBall(ServerPlayer player, InteractionHand hand) {
        return player.getItemInHand(hand).getItem() instanceof PokeBallItem;
    }

    /** The CSRP creature under the player's crosshair, or {@code null}. */
    private static Mob lookedAtCreature(ServerPlayer player) {
        HitResult hit = player.pick(LOOK_DISTANCE, 1.0F, false);
        if (hit instanceof EntityHitResult entityHit
                && entityHit.getEntity() instanceof Mob mob
                && mob instanceof Parasite
                && mob.isAlive()) {
            return mob;
        }
        return null;
    }

    /**
     * Replaces a CSRP creature with an equivalent wild Pokemon on the spot. Nothing is queued for
     * restoration: from this moment it simply is a wild Pokemon, and Cobblemon owns what happens to
     * it.
     */
    private static void swapForWildPokemon(ServerPlayer player, Mob creature, ParasiteSpecies entry) {
        ServerLevel level = (ServerLevel) creature.level();
        PokemonEntity pokemon = spawnWildPokemon(level, player, entry, creature.position(), creature.getYRot());
        if (pokemon == null) {
            return;
        }
        creature.discard();
        Csrpmon.LOGGER.debug("Swapped {} for a wild {} so a thrown ball can catch it.",
                entry.csrpPath(), entry.speciesId());
    }

    /** Wild levels follow the creature's tier and the world's CSRP evolution phase. */
    private static int rollLevel(ServerLevel level, ParasiteSpecies entry) {
        int span = Math.max(0, entry.maxLevel() - entry.minLevel());
        int base = entry.minLevel() + (span == 0 ? 0 : level.random.nextInt(span + 1));
        int phase = 0;
        try {
            phase = Math.max(0, SrpWorldData.get(level).evolutionPhase());
        } catch (RuntimeException e) {
            Csrpmon.LOGGER.debug("CSRP world data unavailable, using phase 0: {}", e.toString());
        }
        int bonus = phase * CsrpmonConfig.LEVEL_BONUS_PER_EVOLUTION_PHASE.get();
        return Math.min(CsrpmonConfig.MAX_LEVEL.get(), base + bonus);
    }

    @SubscribeEvent
    public static void onServerTick(ServerTickEvent.Post event) {
        if (ACTIVE.isEmpty()) {
            return;
        }
        List<UUID> finished = new ArrayList<>();
        for (Map.Entry<UUID, PendingEncounter> active : ACTIVE.entrySet()) {
            if (BattleRegistry.getBattle(active.getKey()) == null) {
                finished.add(active.getKey());
            }
        }
        for (UUID battleId : finished) {
            finishEncounter(ACTIVE.remove(battleId), event);
        }
    }

    /**
     * A wild Pokemon that survived the battle (the player ran) is swapped back for the original
     * creature so the world is not quietly drained of parasites. A Pokemon that was caught or
     * knocked out is already gone, and nothing is restored.
     */
    private static void finishEncounter(PendingEncounter encounter, ServerTickEvent.Post event) {
        if (encounter == null) {
            return;
        }
        ResourceKey<Level> dimension = ResourceKey.create(Registries.DIMENSION, encounter.dimension());
        ServerLevel level = event.getServer().getLevel(dimension);
        if (level == null || !CsrpmonConfig.RESTORE_CREATURE_AFTER_FLEE.get()) {
            return;
        }
        Entity pokemon = level.getEntity(encounter.pokemonEntityId());
        if (pokemon == null) {
            return;
        }
        pokemon.discard();

        EntityType<?> creatureType = BuiltInRegistries.ENTITY_TYPE.get(encounter.csrpTypeId());
        Entity restored = creatureType.create(level);
        if (restored == null) {
            return;
        }
        restored.moveTo(encounter.position().x, encounter.position().y, encounter.position().z, encounter.yaw(), 0.0F);
        if (restored instanceof Mob mob) {
            mob.setPersistenceRequired();
            ParasitePacifier.stripProactiveTargeting(mob);
        }
        level.addFreshEntity(restored);
    }
}
