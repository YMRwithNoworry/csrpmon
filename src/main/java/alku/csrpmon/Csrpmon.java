package alku.csrpmon;

import alku.csrpmon.config.CsrpmonConfig;
import alku.csrpmon.species.ParasiteSpeciesMap;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.fml.ModContainer;
import net.neoforged.fml.common.Mod;
import net.neoforged.fml.config.ModConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * CSRPmon - lets Scape and Run: Parasites creatures fight like Pokemon.
 *
 * <p>The addon registers every supported parasite as a real Cobblemon species, calms the creatures
 * down so they no longer hunt on their own, and swaps a creature for a Pokemon entity when a player
 * starts an encounter. Battles, catching, experience and evolution are all Cobblemon's own.</p>
 */
@Mod(Csrpmon.MODID)
public final class Csrpmon {
    public static final String MODID = "csrpmon";
    public static final Logger LOGGER = LoggerFactory.getLogger("CSRPmon");

    public Csrpmon(IEventBus modBus, ModContainer container) {
        container.registerConfig(ModConfig.Type.COMMON, CsrpmonConfig.SPEC);
        LOGGER.info("CSRPmon loaded: {} CSRP creatures can now be battled and caught as Pokemon.",
                ParasiteSpeciesMap.size());
    }
}
