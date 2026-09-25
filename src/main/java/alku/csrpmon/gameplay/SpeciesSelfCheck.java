package alku.csrpmon.gameplay;

import alku.csrpmon.Csrpmon;
import alku.csrpmon.species.ParasiteSpecies;
import alku.csrpmon.species.ParasiteSpeciesMap;
import com.cobblemon.mod.common.api.pokemon.PokemonSpecies;
import com.cobblemon.mod.common.pokemon.Species;
import java.util.ArrayList;
import java.util.List;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.event.server.ServerStartedEvent;

/**
 * Checks at startup that every creature this addon maps is actually present in Cobblemon's species
 * registry, and says so in the log.
 *
 * <p>Species are loaded from datapack JSON, so a typo in a file name or a malformed entry means the
 * species silently does not exist and the creature simply refuses to battle. This turns that into an
 * explicit, actionable message instead of a mystery.</p>
 */
@EventBusSubscriber(modid = Csrpmon.MODID)
public final class SpeciesSelfCheck {
    private SpeciesSelfCheck() {
    }

    @SubscribeEvent
    public static void onServerStarted(ServerStartedEvent event) {
        List<String> missing = new ArrayList<>();
        Species sample = null;
        for (ParasiteSpecies entry : ParasiteSpeciesMap.all()) {
            Species species = PokemonSpecies.getByIdentifier(
                    ResourceLocation.fromNamespaceAndPath(ParasiteSpeciesMap.SPECIES_NAMESPACE, entry.speciesId()));
            if (species == null) {
                missing.add(entry.speciesId());
            } else if (sample == null) {
                sample = species;
            }
        }

        int expected = ParasiteSpeciesMap.size();
        if (missing.isEmpty()) {
            String example = sample == null ? "none" : sample.getName() + " (" + sample.getPrimaryType().getName() + ")";
            Csrpmon.LOGGER.info("Cobblemon accepted all {} CSRPmon species, e.g. {}.", expected, example);
            return;
        }
        Csrpmon.LOGGER.error("{} of {} CSRPmon species are missing from Cobblemon's registry: {}",
                missing.size(), expected, String.join(", ", missing));
        Csrpmon.LOGGER.error("A missing species means the matching CSRP creature cannot start a battle. "
                + "Check that data/csrpmon/species/<name>.json exists and parses.");
    }
}
