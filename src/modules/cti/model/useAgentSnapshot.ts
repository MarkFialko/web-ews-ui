import {
  type IAgentState,
  type IAgentMode,
  type IDictionaries,
  AGENT_STATE_CHANGED,
  AGENT_MODE_CHANGED,
  CAPACITY_UPDATED,
  type IWebSocketStatus,
} from "@sber-scpl/core/jssdk";
import { useRef, useSyncExternalStore } from "react";
import { isEqual } from "lodash";
import { useTelephonyService } from "./TelephonyProvider";
import { CONNECTION_STATUS_CHANGED } from "./telephonyService";

interface AgentSnapshot {
  status: IWebSocketStatus;
  state?: IAgentState;
  mode?: IAgentMode;
  dictionaries?: IDictionaries;
}

const EVENTS = [
  CONNECTION_STATUS_CHANGED,
  AGENT_STATE_CHANGED,
  AGENT_MODE_CHANGED,
  CAPACITY_UPDATED,
];

/** Статус подключения + состояние/режим агента. Пересчитывается только когда что-то реально изменилось,
 * чтобы не ловить предупреждение useSyncExternalStore про нестабильный getSnapshot. */
export function useAgentSnapshot(): AgentSnapshot {
  const service = useTelephonyService();
  const lastRef = useRef<AgentSnapshot | null>(null);

  return useSyncExternalStore(
    (onStoreChange) => {
      EVENTS.forEach((event) => service.on(event, onStoreChange));
      return () =>
        EVENTS.forEach((event) => service.off(event, onStoreChange));
    },
    () => {
      const agent = service.getAgent();
      const next: AgentSnapshot = {
        status: service.getStatus(),
        state: agent?.getAgentState(),
        mode: agent?.getAgentMode(),
        dictionaries: agent?.getDictionaries(),
      };
      const prev = lastRef.current;
      if (
        prev &&
        isEqual(prev.status, next.status) &&
        isEqual(prev.state, next.state) &&
        isEqual(prev.mode, next.mode) &&
        isEqual(prev.dictionaries, next.dictionaries)
      ) {
        return prev;
      }
      lastRef.current = next;
      return next;
    },
  );
}
