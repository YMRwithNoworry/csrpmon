package alku.csrpmon.species;

/**
 * Maps one CSRP creature type onto a Cobblemon species shipped by this addon.
 *
 * @param csrpPath  the path of the CSRP entity type id, for example {@code rupter}
 * @param speciesId the path of the {@code csrpmon} species id, for example {@code rupter}
 * @param minLevel  lowest level a wild creature of this kind can be
 * @param maxLevel  highest level before the world evolution phase bonus is applied
 * @param tier      SRP progression tier, exposed for tooling and documentation
 */
public record ParasiteSpecies(String csrpPath, String speciesId, int minLevel, int maxLevel, int tier) {
}
