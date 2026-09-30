package alku.csrpmon.network;

import alku.csrpmon.Csrpmon;
import alku.csrpmon.gameplay.WildEncounterManager;
import io.netty.buffer.ByteBuf;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerPlayer;
import net.neoforged.neoforge.network.handling.IPayloadContext;

/**
 * Sent when the player presses the battle key while looking at a CSRP creature.
 *
 * <p>Carries no data: the server re-traces the crosshair itself, so a client cannot ask for a
 * battle with a creature it is not actually aiming at.</p>
 */
public record BattleRequestPayload() implements CustomPacketPayload {
    public static final BattleRequestPayload INSTANCE = new BattleRequestPayload();

    public static final CustomPacketPayload.Type<BattleRequestPayload> TYPE =
            new CustomPacketPayload.Type<>(
                    ResourceLocation.fromNamespaceAndPath(Csrpmon.MODID, "battle_request"));

    public static final StreamCodec<ByteBuf, BattleRequestPayload> STREAM_CODEC =
            StreamCodec.unit(INSTANCE);

    @Override
    public CustomPacketPayload.Type<? extends CustomPacketPayload> type() {
        return TYPE;
    }

    /** Runs on the server, on the main thread. */
    public static void handle(BattleRequestPayload payload, IPayloadContext context) {
        if (context.player() instanceof ServerPlayer player) {
            context.enqueueWork(() -> WildEncounterManager.startBattleLookingAt(player));
        }
    }
}
