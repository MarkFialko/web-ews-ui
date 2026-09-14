import { NEW_INTERACTION, RONA_TIMEOUT } from "@sber-scpl/core/jssdk";
import { useTelephonyService } from "./TelephonyProvider";
import { useActiveVoiceInteraction } from "./useActiveVoiceInteraction";
import { useCallHistory } from "./useCallHistory";
import { useCtiEvents } from "./useCtiEvents";
import { useCallback, useEffect, useRef } from "react";
import { useVoiceInteractionSnapshot } from "./useVoiceInteractionSnapshot";
import { resolveInteractionNumber } from "../utils";
import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";

export const useSaveHistory = () => {
  const [, addCall] = useCallHistory();

  const service = useTelephonyService();
  const interaction = useActiveVoiceInteraction();
  const snapshot = useVoiceInteractionSnapshot(interaction);

  const log = useWorklogLogger();

  // Flag: NEW_INTERACTION уже сработал, ждём snapshot.data
  const pendingRef = useRef(false);

  const saveInteraction = useCallback(
    (interactionData: NonNullable<typeof snapshot>["data"]) => {
      if (!interactionData) return;
      addCall(
        interactionData.direction,
        resolveInteractionNumber(interactionData),
      );
      log({
        action:
          interactionData.direction === "inbound"
            ? WORKLOG_ACTIONS.CTI_CALL_INBOUND
            : WORKLOG_ACTIONS.CTI_CALL_OUTBOUND,
        task: interaction?.id ?? "Information",
        commentParams: { data: resolveInteractionNumber(interactionData) },
      });
    },
    [addCall, log, interaction?.id],
  );

  // Ждём появления snapshot.data.
  useEffect(() => {
    if (pendingRef.current && snapshot?.data) {
      saveInteraction(snapshot.data);
      pendingRef.current = false;
    }
  }, [snapshot?.data, saveInteraction]);

  const handleNewInteraction = useCallback(() => {
    pendingRef.current = true;
  }, []);

  const handleRonaTimeout = useCallback(() => {
    const interactionData = snapshot?.data;

    if (!interactionData) return;

    log({
      action: WORKLOG_ACTIONS.CTI_CALL_RONA,
      task: interaction?.id ?? "Interaction",
      commentParams: { data: resolveInteractionNumber(interactionData) },
    });

    addCall("missed", resolveInteractionNumber(interactionData));
  }, [snapshot, addCall, interaction?.id, log]);

  useCtiEvents(service, {
    [NEW_INTERACTION]: handleNewInteraction,
  });

  useCtiEvents(interaction, {
    [RONA_TIMEOUT]: handleRonaTimeout,
  });
};
