package alku.csrpmon.mixin.client;

import alku.csrpmon.Csrpmon;
import alku.csrpmon.client.CsrpCreatureVisuals;
import com.cobblemon.mod.common.client.render.pokemon.PokemonRenderer;
import com.cobblemon.mod.common.entity.pokemon.PokemonEntity;
import com.mojang.blaze3d.vertex.PoseStack;
import net.minecraft.client.renderer.MultiBufferSource;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/**
 * Replaces Cobblemon's Pokemon model with the original CSRP model for species this addon adds.
 *
 * <p>Cobblemon resolves models from its own repository, so an addon species would otherwise render
 * as a Substitute doll. Intercepting the top of the render call is the only place where the choice
 * can be made without re-authoring every creature as a Bedrock model.</p>
 */
@Mixin(value = PokemonRenderer.class, remap = false)
public abstract class PokemonRendererMixin {
    @Inject(
            method = "render(Lcom/cobblemon/mod/common/entity/pokemon/PokemonEntity;FLcom/mojang/blaze3d/vertex/PoseStack;Lnet/minecraft/client/renderer/MultiBufferSource;I)V",
            at = @At("HEAD"),
            cancellable = true,
            remap = false
    )
    private void csrpmon$renderParasiteModel(PokemonEntity entity, float entityYaw, float partialTick,
                                              PoseStack poseStack, MultiBufferSource buffers, int packedLight,
                                              CallbackInfo ci) {
        try {
            if (CsrpCreatureVisuals.render(entity, entityYaw, partialTick, poseStack, buffers, packedLight)) {
                ci.cancel();
            }
        } catch (Throwable failure) {
            Csrpmon.LOGGER.error("CSRPmon could not draw {} with its CSRP model; using the Cobblemon model instead",
                    entity.getPokemon().getSpecies().getResourceIdentifier(), failure);
        }
    }
}
