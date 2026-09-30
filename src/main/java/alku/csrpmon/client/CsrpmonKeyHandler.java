package alku.csrpmon.client;

import alku.csrpmon.Csrpmon;
import alku.csrpmon.network.BattleRequestPayload;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.client.event.ClientTickEvent;
import net.neoforged.neoforge.network.PacketDistributor;

/** Asks the server for a battle whenever the battle key is pressed. */
@EventBusSubscriber(modid = Csrpmon.MODID, value = Dist.CLIENT)
public final class CsrpmonKeyHandler {
    private CsrpmonKeyHandler() {
    }

    @SubscribeEvent
    public static void onClientTick(ClientTickEvent.Post event) {
        while (CsrpmonKeys.BATTLE.consumeClick()) {
            PacketDistributor.sendToServer(BattleRequestPayload.INSTANCE);
        }
    }
}
