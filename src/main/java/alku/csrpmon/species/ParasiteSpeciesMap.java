package alku.csrpmon.species;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * The registry of CSRP creature -> Cobblemon species conversions shipped by this addon.
 *
 * <p>The species JSON files live in {@code data/csrpmon/species/}; this table only records which
 * creature becomes which species and how strong the wild encounter is.</p>
 */
public final class ParasiteSpeciesMap {
    /** Namespace of the CSRP mod. */
    public static final String CSRP_NAMESPACE = "csrp";
    /** Namespace of the species added by this addon. */
    public static final String SPECIES_NAMESPACE = "csrpmon";

    private static final Map<String, ParasiteSpecies> BY_CSRP_ID = new LinkedHashMap<>();

    private static void add(String csrpPath, String speciesId, int tier, int minLevel, int maxLevel) {
        BY_CSRP_ID.put(csrpPath, new ParasiteSpecies(csrpPath, speciesId, minLevel, maxLevel, tier));
    }

    static {
        // INBORN (10)
        add("buglin", "buglin", 1, 3, 10);
        add("gnat", "gnat", 1, 3, 10);
        add("lice", "lice", 1, 3, 10);
        add("rupter", "rupter", 2, 10, 20);
        add("mangler", "mangler", 2, 12, 22);
        add("worker", "worker", 2, 10, 20);
        add("carrier_light", "carrier_light", 3, 20, 32);
        add("carrier_heavy", "carrier_heavy", 4, 34, 46);
        add("carrier_flying", "carrier_flying", 1, 3, 10);
        add("movingflesh", "movingflesh", 1, 3, 10);
        // CRUDE (11)
        add("heed", "heed", 2, 12, 22);
        add("thrall", "thrall", 3, 20, 32);
        add("host", "host", 3, 22, 34);
        add("dredge", "dredge", 3, 22, 34);
        add("hostii", "hostii", 4, 38, 50);
        add("crux", "crux", 5, 48, 60);
        add("crux_incomplete", "crux_incomplete", 2, 10, 20);
        add("airscrew", "airscrew", 2, 10, 20);
        add("incompleteform_medium", "incompleteform_medium", 2, 10, 20);
        add("incompleteform_small", "incompleteform_small", 2, 10, 20);
        add("carrier_worm", "carrier_worm", 2, 10, 20);
        // PRIMITIVE (12)
        add("pri_vermin", "pri_vermin", 3, 24, 36);
        add("pri_longarms", "pri_longarms", 4, 34, 46);
        add("pri_summoner", "pri_summoner", 4, 36, 48);
        add("pri_viscera", "pri_viscera", 4, 34, 46);
        add("pri_arachnida", "pri_arachnida", 3, 24, 36);
        add("pri_bolster", "pri_bolster", 3, 24, 36);
        add("pri_burrower", "pri_burrower", 3, 24, 36);
        add("pri_devourer", "pri_devourer", 3, 24, 36);
        add("pri_manducater", "pri_manducater", 3, 24, 36);
        add("pri_reeker", "pri_reeker", 3, 24, 36);
        add("pri_tozoon", "pri_tozoon", 3, 24, 36);
        add("pri_yelloweye", "pri_yelloweye", 3, 24, 36);
        // ADAPTED (12)
        add("ada_arachnida", "ada_arachnida", 4, 34, 46);
        add("ada_bolster", "ada_bolster", 4, 34, 46);
        add("ada_burrower", "ada_burrower", 4, 34, 46);
        add("ada_devourer", "ada_devourer", 4, 34, 46);
        add("ada_longarms", "ada_longarms", 4, 34, 46);
        add("ada_manducater", "ada_manducater", 4, 34, 46);
        add("ada_reeker", "ada_reeker", 4, 34, 46);
        add("ada_summoner", "ada_summoner", 4, 34, 46);
        add("ada_tozoon", "ada_tozoon", 4, 34, 46);
        add("ada_viscera", "ada_viscera", 4, 34, 46);
        add("ada_yelloweye", "ada_yelloweye", 4, 34, 46);
        add("ada_vermin", "ada_vermin", 4, 34, 46);
        // ASSIMILATED (13)
        add("sim_adventurer", "sim_adventurer", 3, 20, 32);
        add("sim_bear", "sim_bear", 3, 20, 32);
        add("sim_bigspider", "sim_bigspider", 3, 20, 32);
        add("sim_cow", "sim_cow", 3, 20, 32);
        add("sim_dragone", "sim_dragone", 3, 20, 32);
        add("sim_enderman", "sim_enderman", 3, 20, 32);
        add("sim_horse", "sim_horse", 3, 20, 32);
        add("sim_human", "sim_human", 3, 20, 32);
        add("sim_pig", "sim_pig", 3, 20, 32);
        add("sim_sheep", "sim_sheep", 3, 20, 32);
        add("sim_squid", "sim_squid", 3, 20, 32);
        add("sim_villager", "sim_villager", 3, 20, 32);
        add("sim_wolf", "sim_wolf", 3, 20, 32);
        // WALKING_HEAD (10)
        add("sim_cowhead", "sim_cowhead", 2, 12, 22);
        add("sim_endermanhead", "sim_endermanhead", 2, 12, 22);
        add("sim_horsehead", "sim_horsehead", 2, 12, 22);
        add("sim_humanhead", "sim_humanhead", 2, 12, 22);
        add("sim_pighead", "sim_pighead", 2, 12, 22);
        add("sim_sheephead", "sim_sheephead", 2, 12, 22);
        add("sim_villagerhead", "sim_villagerhead", 2, 12, 22);
        add("sim_wolfhead", "sim_wolfhead", 2, 12, 22);
        add("sim_adventurerhead", "sim_adventurerhead", 2, 12, 22);
        add("sim_dragonehead", "sim_dragonehead", 2, 12, 22);
        // ASSIMARA (6)
        add("mar_bear", "mar_bear", 4, 34, 46);
        add("mar_cow", "mar_cow", 4, 34, 46);
        add("mar_enderman", "mar_enderman", 4, 34, 46);
        add("mar_human", "mar_human", 4, 34, 46);
        add("mar_sheep", "mar_sheep", 4, 34, 46);
        add("mar_villager", "mar_villager", 4, 34, 46);
        // HIJACKED (3)
        add("hi_blaze", "hi_blaze", 3, 22, 34);
        add("hi_golem", "hi_golem", 3, 22, 34);
        add("hi_skeleton", "hi_skeleton", 3, 22, 34);
        // FERAL (9)
        add("fer_bear", "fer_bear", 4, 34, 46);
        add("fer_cow", "fer_cow", 4, 34, 46);
        add("fer_enderman", "fer_enderman", 4, 34, 46);
        add("fer_horse", "fer_horse", 4, 34, 46);
        add("fer_human", "fer_human", 4, 34, 46);
        add("fer_pig", "fer_pig", 4, 34, 46);
        add("fer_sheep", "fer_sheep", 4, 34, 46);
        add("fer_villager", "fer_villager", 4, 34, 46);
        add("fer_wolf", "fer_wolf", 4, 34, 46);
        // NEXUS (13)
        add("beckon_si", "beckon", 4, 34, 46);
        add("beckon_siii", "beckon_queen", 5, 46, 58);
        add("beckon_siv", "world_node", 6, 58, 80);
        add("beckon_sii", "beckon_sii", 5, 46, 58);
        add("dispatcher_si", "dispatcher_si", 5, 46, 58);
        add("dispatcher_sii", "dispatcher_sii", 5, 46, 58);
        add("dispatcher_siii", "dispatcher_siii", 5, 46, 58);
        add("dispatcher_siv", "dispatcher_siv", 5, 46, 58);
        add("rooter_si", "rooter_si", 5, 46, 58);
        add("rooter_sii", "rooter_sii", 5, 46, 58);
        add("rooter_siii", "rooter_siii", 5, 46, 58);
        add("rooter_siv", "rooter_siv", 5, 46, 58);
        add("rooterball", "rooterball", 5, 46, 58);
        // DETERRENT (5)
        add("dispatcherten", "dispatcherten", 3, 22, 34);
        add("kyphosis", "kyphosis", 3, 22, 34);
        add("seizer", "seizer", 3, 22, 34);
        add("sentry", "sentry", 3, 22, 34);
        add("worm", "worm", 3, 22, 34);
        // PURE (8)
        add("marauder", "marauder", 5, 46, 58);
        add("grunt", "grunt", 4, 34, 46);
        add("bomber_light", "bomber_light", 4, 34, 46);
        add("monarch", "monarch", 4, 34, 46);
        add("overseer", "overseer", 4, 34, 46);
        add("vigilante", "vigilante", 4, 34, 46);
        add("warden", "warden", 4, 34, 46);
        add("marauder_tendril", "marauder_tendril", 4, 34, 46);
        // PREEMINENT (8)
        add("architect", "architect", 5, 46, 58);
        add("bogle", "bogle", 5, 46, 58);
        add("carrier_colony", "carrier_colony", 5, 46, 58);
        add("haunter", "haunter", 5, 46, 58);
        add("bomber_heavy", "bomber_heavy", 5, 46, 58);
        add("wraith", "wraith", 5, 46, 58);
        add("succor", "succor", 5, 46, 58);
        add("seeker", "seeker", 5, 46, 58);
        // DERIVED (2)
        add("draconite", "draconite", 5, 50, 62);
        add("kirin", "kirin", 6, 58, 75);
        // ANCIENT (4)
        add("anc_dreadnaut", "anc_dreadnaut", 6, 58, 75);
        add("anc_overlord", "anc_overlord", 6, 60, 80);
        add("anc_dreadnaut_ten", "anc_dreadnaut_ten", 6, 58, 80);
        add("anc_pod", "anc_pod", 6, 58, 80);
        // ABOMINATION (2)
        add("abo_bodies", "abo_bodies", 2, 12, 22);
        add("abo_head", "abo_head", 2, 12, 22);
    }

    private ParasiteSpeciesMap() {
    }

    /** Returns the conversion for a CSRP entity type path, or {@code null} when this addon ignores it. */
    public static ParasiteSpecies byCsrpPath(String csrpPath) {
        return BY_CSRP_ID.get(csrpPath);
    }

    /** Returns the conversion that produced a {@code csrpmon} species, or {@code null} for other species. */
    public static ParasiteSpecies bySpeciesId(String speciesId) {
        for (ParasiteSpecies entry : BY_CSRP_ID.values()) {
            if (entry.speciesId().equals(speciesId)) {
                return entry;
            }
        }
        return null;
    }

    public static Collection<ParasiteSpecies> all() {
        return BY_CSRP_ID.values();
    }

    public static int size() {
        return BY_CSRP_ID.size();
    }
}
