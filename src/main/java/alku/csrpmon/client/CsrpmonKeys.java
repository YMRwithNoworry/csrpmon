package alku.csrpmon.client;

import alku.csrpmon.Csrpmon;
import com.mojang.blaze3d.platform.InputConstants;
import net.minecraft.client.KeyMapping;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.client.event.RegisterKeyMappingsEvent;

/**
 * The battle key.
 *
 * <p>R is not a collision. Cobblemon already binds R, but its handler only acts when the crosshair
 * is on a player or one of its own {@code PokemonEntity} objects - on an ordinary mob it falls
 * through every branch and does nothing. A CSRP creature is an ordinary mob, so the key is free
 * for this addon to use, and the two never fight over the same press.</p>
 */
@EventBusSubscriber(modid = Csrpmon.MODID, value = Dist.CLIENT)
public final class CsrpmonKeys {
    public static final String CATEGORY = "key.categories.csrpmon";

    public static final KeyMapping BATTLE =
            new KeyMapping("key.csrpmon.battle", InputConstants.KEY_R, CATEGORY);

    private CsrpmonKeys() {
    }

    @SubscribeEvent
    public static void onRegisterKeyMappings(RegisterKeyMappingsEvent event) {
        event.register(BATTLE);
    }
}
