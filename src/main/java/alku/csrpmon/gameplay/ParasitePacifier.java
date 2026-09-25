package alku.csrpmon.gameplay;

import alku.csrp.entity.Parasite;
import alku.csrpmon.Csrpmon;
import alku.csrpmon.config.CsrpmonConfig;
import java.util.ArrayList;
import java.util.List;
import net.minecraft.world.entity.LivingEntity;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.entity.ai.goal.Goal;
import net.minecraft.world.entity.ai.goal.GoalSelector;
import net.minecraft.world.entity.ai.goal.WrappedGoal;
import net.minecraft.world.entity.ai.goal.target.NearestAttackableTargetGoal;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.event.entity.EntityJoinLevelEvent;
import net.neoforged.neoforge.event.entity.living.LivingChangeTargetEvent;

/**
 * Makes CSRP creatures stop hunting on their own.
 *
 * <p>SRP parasites pick fights with two goals: {@code HurtByTargetGoal} (retaliation) and
 * {@code NearestAttackableTargetGoal} (proactive hunting). This class strips the proactive one and
 * then refuses every target the creature did not earn by being attacked, so a parasite standing in
 * a field will walk past a player instead of charging them.</p>
 *
 * <p>Retaliation stays available unless {@code retaliateWhenAttacked} is switched off, which keeps
 * the creatures from becoming free loot.</p>
 */
@EventBusSubscriber(modid = Csrpmon.MODID)
public final class ParasitePacifier {
    private ParasitePacifier() {
    }

    @SubscribeEvent
    public static void onEntityJoinLevel(EntityJoinLevelEvent event) {
        if (event.getLevel().isClientSide() || !CsrpmonConfig.PACIFY_CREATURES.get()) {
            return;
        }
        if (event.getEntity() instanceof Mob mob && mob instanceof Parasite) {
            stripProactiveTargeting(mob);
        }
    }

    /**
     * Vetoes target acquisition for CSRP creatures unless the target is the entity that last hurt
     * them. This is the enforcement point: it does not matter which goal asked for the target.
     */
    @SubscribeEvent
    public static void onLivingChangeTarget(LivingChangeTargetEvent event) {
        if (!CsrpmonConfig.PACIFY_CREATURES.get() || !(event.getEntity() instanceof Parasite)) {
            return;
        }
        LivingEntity proposed = event.getNewAboutToBeSetTarget();
        if (proposed == null) {
            return;
        }
        if (CsrpmonConfig.RETALIATE_WHEN_ATTACKED.get()
                && event.getEntity().getLastHurtByMob() == proposed) {
            return;
        }
        event.setCanceled(true);
    }

    /** Removes every proactive "find something to attack" goal this creature owns. */
    public static void stripProactiveTargeting(Mob mob) {
        strip(mob.targetSelector);
        strip(mob.goalSelector);
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
