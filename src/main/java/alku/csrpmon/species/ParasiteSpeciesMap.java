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
        // Tier 1 - primitive swarmers
        add("buglin", "buglin", 1, 3, 10);
        add("gnat", "gnat", 1, 3, 10);
        add("lice", "lice", 1, 3, 10);
        // Tier 2 - rupters and adapted workers
        add("rupter", "rupter", 2, 10, 20);
        add("mangler", "mangler", 2, 12, 22);
        add("worker", "worker", 2, 10, 20);
        add("heed", "heed", 2, 12, 22);
        // Tier 3 - derived bodies
        add("thrall", "thrall", 3, 20, 32);
        add("host", "host", 3, 22, 34);
        add("dredge", "dredge", 3, 22, 34);
        add("carrier_light", "carrier_light", 3, 20, 32);
        add("pri_vermin", "pri_vermin", 3, 24, 36);
        // Tier 4 - pure parasites and heavy carriers
        add("carrier_heavy", "carrier_heavy", 4, 34, 46);
        add("pri_longarms", "pri_longarms", 4, 34, 46);
        add("pri_summoner", "pri_summoner", 4, 36, 48);
        add("pri_viscera", "pri_viscera", 4, 34, 46);
        add("hostii", "hostii", 4, 38, 50);
        // Tier 5 - marauders and hive command
        add("marauder", "marauder", 5, 46, 58);
        add("architect", "architect", 5, 46, 58);
        add("crux", "crux", 5, 48, 60);
        add("draconite", "draconite", 5, 50, 62);
        // Tier 6 - apex and ancient forms
        add("kirin", "kirin", 6, 58, 75);
        add("anc_dreadnaut", "anc_dreadnaut", 6, 58, 75);
        add("anc_overlord", "anc_overlord", 6, 60, 80);
        // Beckon nest line
        add("beckon_si", "beckon", 4, 34, 46);
        add("beckon_siii", "beckon_queen", 5, 46, 58);
        add("beckon_siv", "world_node", 6, 58, 80);    }

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
