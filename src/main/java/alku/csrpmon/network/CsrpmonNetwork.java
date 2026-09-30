package alku.csrpmon.network;

import alku.csrpmon.Csrpmon;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.network.event.RegisterPayloadHandlersEvent;
import net.neoforged.neoforge.network.registration.PayloadRegistrar;

/** Wires up the one packet this addon needs. */
@EventBusSubscriber(modid = Csrpmon.MODID)
public final class CsrpmonNetwork {
    private CsrpmonNetwork() {
    }

    @SubscribeEvent
    public static void onRegisterPayloads(RegisterPayloadHandlersEvent event) {
        PayloadRegistrar registrar = event.registrar("1");
        registrar.playToServer(BattleRequestPayload.TYPE, BattleRequestPayload.STREAM_CODEC,
                BattleRequestPayload::handle);
    }
}
