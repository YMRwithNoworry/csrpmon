package alku.csrpmon.gameplay;

import alku.csrp.entity.Parasite;
import alku.csrpmon.Csrpmon;
import alku.csrpmon.config.CsrpmonConfig;
import com.cobblemon.mod.common.entity.pokemon.PokemonEntity;
import java.util.ArrayList;
import java.util.List;
import net.minecraft.world.entity.LivingEntity;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.entity.ai.goal.Goal;
import net.minecraft.world.entity.ai.goal.GoalSelector;
import net.minecraft.world.entity.ai.goal.WrappedGoal;
import net.minecraft.world.entity.ai.goal.target.NearestAttackableTargetGoal;
import net.minecraft.world.entity.player.Player;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.event.entity.EntityJoinLevelEvent;
import net.neoforged.neoforge.event.entity.living.LivingChangeTargetEvent;

/**
 * Decides who CSRP creatures are allowed to fight.
 *
 * <p>By default they hunt everything except the two things this addon exists to protect: players
 * and Cobblemon Pokemon. CSRP's own filter is narrower than that - {@code isValidMobTarget} skips
 * animals, water animals, villagers and creepers - so a wider target goal is added on top rather
 * than relying on the goal the creature ships with.</p>
 *
 * <p>Two of CSRP's own rules are kept. Parasites do not hunt each other unless
 * {@code attackOtherParasites} is switched on, because {@code isValidParasiteTarget} in the CSRP
 * source is literally {@code !(target instanceof Parasite)}. And {@code pacifyCreatures} still
 * turns the whole thing off for players who would rather the creatures were harmless.</p>
 */
@EventBusSubscriber(modid = Csrpmon.MODID)
public final class ParasitePacifier {
    /** Runs ahead of CSRP's own target goals, which it adds at priority 4. */
    private static final int HUNT_PRIORITY = 3;

    private ParasitePacifier() {
    }

    @SubscribeEvent
    public static void onEntityJoinLevel(EntityJoinLevelEvent event) {
        if (event.getLevel().isClientSide()) {
            return;
        }
        if (event.getEntity() instanceof Mob mob && mob instanceof Parasite) {
            applyTargetingMode(mob);
        }
    }

    /**
     * The single enforcement point for target choice. It does not matter which goal asked for the
     * target, or whether the creature set it directly.
     */
    @SubscribeEvent
    public static void onLivingChangeTarget(LivingChangeTargetEvent event) {
        if (!(event.getEntity() instanceof Parasite)) {
            return;
        }
        LivingEntity proposed = event.getNewAboutToBeSetTarget();
        if (proposed == null) {
            return;
        }
        if (CsrpmonConfig.PROTECT_PLAYERS_AND_POKEMON.get() && isProtected(proposed)) {
            event.setCanceled(true);
            return;
        }
        if (!CsrpmonConfig.PACIFY_CREATURES.get()) {
            // Hunting normally: anything that got this far is a legitimate target.
            return;
        }
        if (CsrpmonConfig.RETALIATE_WHEN_ATTACKED.get()
                && event.getEntity().getLastHurtByMob() == proposed) {
            return;
        }
        event.setCanceled(true);
    }

    /** Applies the configured targeting behaviour to one creature. */
    public static void applyTargetingMode(Mob mob) {
        if (CsrpmonConfig.PACIFY_CREATURES.get()) {
            stripProactiveTargeting(mob);
        } else if (CsrpmonConfig.ATTACK_ALL_MOBS.get()) {
            addBroadHuntingGoal(mob);
        }
    }

    /** Players and Pokemon are never valid targets while the guard is on. */
    public static boolean isProtected(LivingEntity entity) {
        return entity instanceof Player || entity instanceof PokemonEntity;
    }

    /** True when this candidate is something the creature is allowed to hunt. */
    private static boolean isHuntable(LivingEntity candidate) {
        if (candidate == null || !candidate.isAlive()) {
            return false;
        }
        if (!(candidate instanceof Mob)) {
            return false;
        }
        if (CsrpmonConfig.PROTECT_PLAYERS_AND_POKEMON.get() && isProtected(candidate)) {
            return false;
        }
        if (!CsrpmonConfig.ATTACK_OTHER_PARASITES.get() && candidate instanceof Parasite) {
            return false;
        }
        return true;
    }

    /** A target goal that hunts every mob CSRP's own filter would have skipped. */
    private static final class BroadHuntGoal extends NearestAttackableTargetGoal<Mob> {
        BroadHuntGoal(Mob mob) {
            super(mob, Mob.class, 0, true, false, ParasitePacifier::isHuntable);
        }
    }

    /** Idempotent: a chunk reload makes the creature join the level again. */
    private static void addBroadHuntingGoal(Mob mob) {
        try {
            for (WrappedGoal wrapped : mob.targetSelector.getAvailableGoals()) {
                if (wrapped.getGoal() instanceof BroadHuntGoal) {
                    return;
                }
            }
            mob.targetSelector.addGoal(HUNT_PRIORITY, new BroadHuntGoal(mob));
        } catch (RuntimeException e) {
            Csrpmon.LOGGER.warn("Could not widen targeting for {}: {}", mob.getType(), e.toString());
        }
    }

    /** Removes every proactive "find something to attack" goal this creature owns. */
    public static void stripProactiveTargeting(Mob mob) {
        strip(mob.targetSelector);
        strip(mob.goalSelector);
        if (!CsrpmonConfig.RETALIATE_WHEN_ATTACKED.get()) {
            // A creature can join the level already locked onto something. Drop it, or the
            // pacifier would only stop new targets while the old one keeps being chased.
            mob.setTarget(null);
            mob.setLastHurtByMob(null);
        }
    }

    private static void strip(GoalSelector selector) {
        List<Goal> doomed = new ArrayList<>();
        try {
            for (WrappedGoal wrapped : selector.getAvailableGoals()) {
                Goal goal = wrapped.getGoal();
                if (goal instanceof NearestAttackableTargetGoal<?> || isNearestAttackableTarget(goal)) {
                    doomed.add(goal);
                }
            }
        } catch (RuntimeException e) {
            Csrpmon.LOGGER.warn("Could not inspect a goal selector while pacifying: {}", e.toString());
            return;
        }
        for (Goal goal : doomed) {
            selector.removeGoal(goal);
        }
    }

    private static boolean isNearestAttackableTarget(Goal goal) {
        return goal.getClass().getName().contains("NearestAttackableTarget");
    }
}
