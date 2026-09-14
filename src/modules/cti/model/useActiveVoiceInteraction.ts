import {
  NEW_INTERACTION,
  INTERACTION_COMPLETED,
  INTERACTIONS_CLEARED,
  type Interaction,
  type IVoiceInteraction,
} from "@sber-scpl/core/jssdk";
import { useSyncExternalStore } from "react";

import { useTelephonyService } from "./TelephonyProvider";

const EVENTS = [NEW_INTERACTION, INTERACTION_COMPLETED, INTERACTIONS_CLEARED];

function isVoiceInteraction(
  interaction: Interaction,
): interaction is IVoiceInteraction {
  return "rtcSession" in interaction;
}

/** Единственное активное голосовое взаимодействие. Телефония здесь всегда работает
 * не более чем с одним звонком одновременно — поэтому вместо списка отдаём один
 * интеракшен либо undefined, а не массив, который в реальности никогда не бывает длиннее 1. */
export function useActiveVoiceInteraction(): IVoiceInteraction | undefined {
  const service = useTelephonyService();

  return useSyncExternalStore(
    (onStoreChange) => {
      EVENTS.forEach((event) => service.on(event, onStoreChange));
      return () =>
        EVENTS.forEach((event) => service.off(event, onStoreChange));
    },
    () => service.getAgent()?.getInteractions().find(isVoiceInteraction),
  );
}
