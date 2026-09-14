import {
  WORKITEM_STATE_CHANGED,
  WORKITEM_PARTYLIST_UPDATED,
  MUTED,
  type IWorkitemState,
  type IPartyListParticipant,
  type IVoiceInteractionData,
  type IVoiceInteraction,
} from "@sber-scpl/core/jssdk";
import { isEqual } from "lodash";
import { useRef, useSyncExternalStore } from "react";

const EVENTS = [WORKITEM_STATE_CHANGED, WORKITEM_PARTYLIST_UPDATED, MUTED];

interface VoiceInteractionSnapshot {
  workitemState: IWorkitemState;
  partyList: IPartyListParticipant[];
  data: IVoiceInteractionData;
}

/** Живой снимок одного звонка: статус workitem, список участников, данные взаимодействия (в т.ч. isMuted). */
export function useVoiceInteractionSnapshot(
  interaction: IVoiceInteraction | undefined,
): VoiceInteractionSnapshot | undefined {
  const lastRef = useRef<VoiceInteractionSnapshot | null>(null);

  return useSyncExternalStore(
    (onStoreChange) => {
      if (!interaction) return () => {};
      EVENTS.forEach((event) => interaction.on(event, onStoreChange));
      return () =>
        EVENTS.forEach((event) => interaction.off(event, onStoreChange));
    },
    () => {
      if (!interaction) return;
      const next: VoiceInteractionSnapshot = {
        workitemState: interaction.getWorkitemState(),
        partyList: interaction.getWorkitemPartyList(),
        data: interaction.getInteractionData(),
      };
      const prev = lastRef.current;
      if (
        prev &&
        isEqual(prev.workitemState, next.workitemState) &&
        isEqual(prev.partyList, next.partyList) &&
        isEqual(prev.data, next.data)
      ) {
        return prev;
      }
      lastRef.current = next;
      return next;
    },
  );
}
