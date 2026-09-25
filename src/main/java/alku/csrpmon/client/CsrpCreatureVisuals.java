package alku.csrpmon.client;

import alku.csrpmon.Csrpmon;
import alku.csrpmon.species.ParasiteSpecies;
import alku.csrpmon.species.ParasiteSpeciesMap;
import com.cobblemon.mod.common.entity.pokemon.PokemonEntity;
import com.mojang.blaze3d.vertex.PoseStack;
import java.util.HashMap;
import java.util.Map;
import net.minecraft.client.Minecraft;
import net.minecraft.client.multiplayer.ClientLevel;
import net.minecraft.client.renderer.MultiBufferSource;
import net.minecraft.client.renderer.entity.EntityRenderDispatcher;
import net.minecraft.client.renderer.entity.EntityRenderer;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.Mob;

/**
 * Draws CSRP creatures inside Cobblemon's {@link PokemonEntity}.
 *
 * <p>Cobblemon resolves a Pokemon model from its own Blockbench repository, which knows nothing
 * about the Tabula models SRP parasites use. Rather than re-authoring 24 creatures as Bedrock
 * models, this bridge keeps a client-side stand-in of the original CSRP entity, mirrors the
 * Pokemon entity's transform onto it every frame, and hands it to the creature's own renderer. The
 * result is the real CSRP model, texture and animation, standing exactly where Cobblemon expects its
 * Pokemon to be.</p>
 *
 * <p>Everything is wrapped so that any failure falls back to Cobblemon's own rendering instead of
 * breaking the battle.</p>
 */
public final class CsrpCreatureVisuals {
    /** Client-side stand-ins, keyed by the Pokemon entity id they stand in for. */
    private static final Map<Integer, Mob> STAND_INS = new HashMap<>();
    /** Upper bound on cached stand-ins, so a long session cannot grow the map without limit. */
    private static final int MAX_STAND_INS = 128;

    private CsrpCreatureVisuals() {
    }

    /**
     * Renders the CSRP model for this Pokemon entity.
     *
     * @return {@code true} when the bridge drew the entity and Cobblemon's own renderer should be
     *         skipped.
     */
    @SuppressWarnings({"rawtypes", "unchecked"})
    public static boolean render(PokemonEntity pokemon, float entityYaw, float partialTick,
                                 PoseStack poseStack, MultiBufferSource buffers, int packedLight) {
        ResourceLocation speciesId;
        try {
            speciesId = pokemon.getPokemon().getSpecies().getResourceIdentifier();
        } catch (RuntimeException e) {
            return false;
        }
        if (!ParasiteSpeciesMap.SPECIES_NAMESPACE.equals(speciesId.getNamespace())) {
            return false;
        }
        ParasiteSpecies entry = ParasiteSpeciesMap.bySpeciesId(speciesId.getPath());
        if (entry == null) {
            return false;
        }
        ClientLevel level = Minecraft.getInstance().level;
        if (level == null) {
            return false;
        }
        Mob standIn = standInFor(pokemon, entry, level);
        if (standIn == null) {
            return false;
        }
        sync(standIn, pokemon, partialTick);

        EntityRenderDispatcher dispatcher = Minecraft.getInstance().getEntityRenderDispatcher();
        EntityRenderer renderer = dispatcher.getRenderer(standIn);
        if (renderer == null) {
            return false;
        }
        renderer.render(standIn, entityYaw, partialTick, poseStack, buffers, packedLight);
        return true;
    }

    private static Mob standInFor(PokemonEntity pokemon, ParasiteSpecies entry, ClientLevel level) {
        Mob existing = STAND_INS.get(pokemon.getId());
        EntityType<?> wanted = csrpType(entry);
        if (existing != null && existing.getType() == wanted) {
            return existing;
        }
        if (wanted == null) {
            return null;
        }
        Entity created = wanted.create(level);
        if (!(created instanceof Mob mob)) {
            return null;
        }
        if (STAND_INS.size() > MAX_STAND_INS) {
            STAND_INS.clear();
        }
        STAND_INS.put(pokemon.getId(), mob);
        return mob;
    }

    private static EntityType<?> csrpType(ParasiteSpecies entry) {
        ResourceLocation id = ResourceLocation.fromNamespaceAndPath(
                ParasiteSpeciesMap.CSRP_NAMESPACE, entry.csrpPath());
        EntityType<?> type = BuiltInRegistries.ENTITY_TYPE.get(id);
        if (type == null) {
            Csrpmon.LOGGER.warn("CSRP entity type {} is missing, falling back to Cobblemon rendering", id);
        }
        return type;
    }

    /** Mirrors position, rotation and movement so the stand-in animates like the real creature. */
    private static void sync(Mob standIn, PokemonEntity pokemon, float partialTick) {
        standIn.setPos(pokemon.getX(), pokemon.getY(), pokemon.getZ());
        standIn.xo = pokemon.xo;
        standIn.yo = pokemon.yo;
        standIn.zo = pokemon.zo;
        standIn.setYRot(pokemon.getYRot());
        standIn.yRotO = pokemon.yRotO;
        standIn.setXRot(pokemon.getXRot());
        standIn.xRotO = pokemon.xRotO;
        standIn.yBodyRot = pokemon.yBodyRot;
        standIn.yBodyRotO = pokemon.yBodyRotO;
        standIn.yHeadRot = pokemon.yHeadRot;
        standIn.yHeadRotO = pokemon.yHeadRotO;
        standIn.tickCount = pokemon.tickCount;
        standIn.setDeltaMovement(pokemon.getDeltaMovement());
        standIn.setOnGround(pokemon.onGround());
        standIn.setSprinting(pokemon.isSprinting());
        standIn.setShiftKeyDown(pokemon.isShiftKeyDown());
        standIn.walkAnimation.update(pokemon.walkAnimation.speed(), 1.0F);
        standIn.setOldPosAndRot();
    }

    /** Drops a stand-in once Cobblemon is done with the Pokemon entity. */
    public static void forget(int pokemonEntityId) {
        STAND_INS.remove(pokemonEntityId);
    }

    public static void clear() {
        STAND_INS.clear();
    }
}
