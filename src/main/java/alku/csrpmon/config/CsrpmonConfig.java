package alku.csrpmon.config;

import net.neoforged.neoforge.common.ModConfigSpec;

/**
 * Configuration for CSRPmon.
 *
 * <p>Every option can be changed in {@code config/csrpmon-common.toml} without restarting the
 * world; the values are read live from the spec.</p>
 */
public final class CsrpmonConfig {
    public static final ModConfigSpec SPEC;

    public static final ModConfigSpec.BooleanValue PACIFY_CREATURES;
    public static final ModConfigSpec.BooleanValue RETALIATE_WHEN_ATTACKED;
    public static final ModConfigSpec.BooleanValue ENCOUNTERS_ENABLED;
    public static final ModConfigSpec.BooleanValue REQUIRE_POKE_BALL;
    public static final ModConfigSpec.BooleanValue POKE_BALL_CAPTURE;
    public static final ModConfigSpec.BooleanValue SNEAK_ALSO_STARTS_BATTLE;
    public static final ModConfigSpec.BooleanValue RESTORE_CREATURE_AFTER_FLEE;
    public static final ModConfigSpec.IntValue LEVEL_BONUS_PER_EVOLUTION_PHASE;
    public static final ModConfigSpec.IntValue MAX_LEVEL;

    static {
        ModConfigSpec.Builder builder = new ModConfigSpec.Builder();

        builder.comment(
                "Peaceful behaviour.",
                "CSRP creatures do not attack other living things at all. They keep walking and let",
                "you start a Cobblemon battle instead. Retaliation can be switched back on if you",
                "want them to defend themselves.")
                .push("behaviour");
        PACIFY_CREATURES = builder
                .comment("Remove the proactive targeting goals from every CSRP creature and refuse",
                        "to let them acquire a target they did not get attacked by.")
                .define("pacifyCreatures", true);
        RETALIATE_WHEN_ATTACKED = builder
                .comment("Allow a CSRP creature to target the entity that just damaged it.",
                        "Off by default: a CSRP creature never attacks another living thing.",
                        "Turn it on if you would rather they fight back.")
                .define("retaliateWhenAttacked", false);
        builder.pop();

        builder.comment("Turn-based battles through Cobblemon.")
                .push("battle");
        ENCOUNTERS_ENABLED = builder
                .comment("Allow players to start a Cobblemon battle with a CSRP creature.")
                .define("encountersEnabled", true);
        REQUIRE_POKE_BALL = builder
                .comment("A battle only starts when the player holds a Cobblemon Poke Ball.")
                .define("requirePokeBall", true);
        POKE_BALL_CAPTURE = builder
                .comment("Throwing a Poke Ball at a CSRP creature turns it into a wild Pokemon in",
                        "place, so Cobblemon runs its own capture on the ball instead of starting a",
                        "battle. Leave this on if you want to catch creatures by throwing balls;",
                        "turn it off to always open a battle first.")
                .define("pokeBallCapture", true);
        SNEAK_ALSO_STARTS_BATTLE = builder
                .comment("Sneaking and interacting also starts a battle, so the feature can be",
                        "discovered without carrying a Poke Ball.")
                .define("sneakAlsoStartsBattle", true);
        LEVEL_BONUS_PER_EVOLUTION_PHASE = builder
                .comment("Wild CSRP Pokemon gain this many levels for every CSRP evolution phase",
                        "the world has reached, so late-game hives are genuinely dangerous.")
                .defineInRange("levelBonusPerEvolutionPhase", 2, 0, 20);
        MAX_LEVEL = builder
                .comment("Upper bound applied after the evolution phase bonus.")
                .defineInRange("maxLevel", 100, 1, 100);
        RESTORE_CREATURE_AFTER_FLEE = builder
                .comment("If the player runs away, put the CSRP creature back into the world",
                        "instead of silently deleting it.")
                .define("restoreCreatureAfterFlee", true);
        builder.pop();

        SPEC = builder.build();
    }

    private CsrpmonConfig() {
    }
}
