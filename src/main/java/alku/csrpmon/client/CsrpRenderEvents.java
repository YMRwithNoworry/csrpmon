package alku.csrpmon.client;

import alku.csrpmon.Csrpmon;
import com.cobblemon.mod.common.client.render.models.blockbench.pokemon.PosablePokemonEntityModel;
import com.cobblemon.mod.common.entity.pokemon.PokemonEntity;
import net.minecraft.util.Mth;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.client.event.RenderLivingEvent;

/**
 * Draws CSRP creatures with their own model while Cobblemon thinks it is drawing a Pokemon.
 *
 * <p>Cobblemon resolves Pokemon models from its own Blockbench repository, so an addon species would
 * render as a Substitute doll. Catching the ordinary NeoForge living-render event and cancelling it
 * for our species lets the creature's own CSRP renderer take over instead.</p>
 *
 * <p>This deliberately uses a plain event rather than a Mixin into Cobblemon's renderer: it needs no
 * method descriptor, so it cannot be broken by the target's signature, mappings or refmaps, and a
 * problem here degrades to Cobblemon's normal rendering instead of failing the game.</p>
 */
@EventBusSubscriber(modid = Csrpmon.MODID, value = Dist.CLIENT)
public final class CsrpRenderEvents {
    private CsrpRenderEvents() {
    }

    @SubscribeEvent
    public static void onRenderLivingPre(RenderLivingEvent.Pre<PokemonEntity, PosablePokemonEntityModel> event) {
        if (!(event.getEntity() instanceof PokemonEntity pokemon)) {
            return;
        }
        try {
            // The same interpolation EntityRenderDispatcher uses for the yaw it would have passed in.
            float yaw = Mth.rotLerp(event.getPartialTick(), pokemon.yRotO, pokemon.getYRot());
            boolean drawn = CsrpCreatureVisuals.render(
                    pokemon,
                    yaw,
                    event.getPartialTick(),
                    event.getPoseStack(),
                    event.getMultiBufferSource(),
                    event.getPackedLight());
            if (drawn) {
                event.setCanceled(true);
            }
        } catch (Throwable failure) {
            Csrpmon.LOGGER.error("CSRPmon could not draw {} with its CSRP model; "
                            + "Cobblemon's own model will be used instead",
                    pokemon.getPokemon().getSpecies().getResourceIdentifier(), failure);
        }
    }
}
