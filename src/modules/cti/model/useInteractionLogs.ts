import { useCallback, useEffect } from "react";

import {
  INTERACTION_COMPLETED,
  AGENT_HANGUP,
  CLIENT_HANGUP,
  CONSULT_HANGUP,
  CONTEXT_CHANGED,
  JOINED_TO_CONFERENCE,
  RONA_TIMEOUT,
  SERVER_HANGUP,
  WORKITEM_STATE_CHANGED,
  WORKITEM_PARTYLIST_UPDATED,
} from "@sber-scpl/core/jssdk";

import {
  TRANSPORT_CONNECTING,
  TRANSPORT_CONNECTED,
  TRANSPORT_DISCONNECTED,
  TRANSPORT_ERROR,
  useTelephonyService,
} from "./TelephonyProvider";

import { useActiveVoiceInteraction } from "./useActiveVoiceInteraction";
import { useVoiceInteractionSnapshot } from "./useVoiceInteractionSnapshot";
import { useCtiEvents } from "./useCtiEvents";
import { AGENT_EVENTS } from "./telephonyService";
import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";

export const INTERACTION_EVENTS = {
  WORKITEM_STATE_CHANGED: WORKITEM_STATE_CHANGED,
  WORKITEM_PARTYLIST_UPDATED: WORKITEM_PARTYLIST_UPDATED,
  RONA_TIMEOUT: RONA_TIMEOUT,
  SERVER_HANGUP: SERVER_HANGUP,
  CONSULT_HANGUP: CONSULT_HANGUP,
  AGENT_HANGUP: AGENT_HANGUP,
  INTERACTION_COMPLETED: INTERACTION_COMPLETED,
  CONTEXT_CHANGED: CONTEXT_CHANGED,
  JOINED_TO_CONFERENCE: JOINED_TO_CONFERENCE,
  CLIENT_HANGUP: CLIENT_HANGUP,
} as const;

/** Форматирует данные события в строку для логов */
const formatValue = (value: unknown): string => {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, (_, v) => {
        if (typeof v === "function") return "[Function]";
        if (v instanceof Event) return `[Event: ${v.type}]`;
        return v;
      });
    } catch {
      return "[Object]";
    }
  }
  return String(value);
};

/** Извлекает читаемые данные из события взаимодействия */
const extractInteractionInfo = (
  interaction: ReturnType<typeof useActiveVoiceInteraction>,
): Record<string, unknown> => {
  if (!interaction) return {};

  const data = interaction.getInteractionData?.();
  const workitemState = interaction.getWorkitemState?.();
  const partyList = interaction.getWorkitemPartyList?.();

  return {
    direction: data?.direction ?? null,
    primaryCallingNumber: data?.primaryCallingNumber ?? null,
    primaryDestinationNumber: data?.primaryDestinationNumber ?? null,
    service: data?.service?.name ?? null,
    workitemStateId: workitemState?.workitemStateID ?? null,
    participantCount: partyList?.length ?? 0,
    isMuted: data?.isMuted ?? null,
  };
};

/**
 * Хук для логирования всех действий и событий из звонка (voice interaction).
 *
 * Подписывается на:
 * - События транспорта: TRANSPORT_CONNECTING, TRANSPORT_CONNECTED,
 *   TRANSPORT_DISCONNECTED, TRANSPORT_ERROR
 * - События уровня сервиса: NEW_INTERACTION, INTERACTION_COMPLETED,
 *   INTERACTIONS_CLEARED, AGENT_STATE_CHANGED, AGENT_MODE_CHANGED,
 *   CAPACITY_UPDATED, CONTACT_DATA_UPDATED, CONNECTION_STATUS_CHANGED
 * - События уровня взаимодействия: WORKITEM_STATE_CHANGED,
 *   WORKITEM_PARTYLIST_UPDATED, MUTED, NEW_RTC_SESSION, RTC_SESSION_TRACK
 *
 * Все события выводятся в console.log с префиксом `[CTI LOG]` и
 * детальной информацией о текущем состоянии взаимодействия.
 *
 * @example
 * ```tsx
 * function CTIModule() {
 *   useInteractionLogs();
 *   return <CTIBlock />;
 * }
 * ```
 */
export function useInteractionLogs(): void {
  const service = useTelephonyService();
  const interaction = useActiveVoiceInteraction();
  const snapshot = useVoiceInteractionSnapshot(interaction);

  const log = useWorklogLogger();

  /** Логирование одного события */
  const logEvent = useCallback(
    (eventName: string, ...args: unknown[]) => {
      const prefix = "[CTI LOG]";
      const timestamp = new Date().toISOString();

      const info = interaction
        ? extractInteractionInfo(interaction)
        : { interaction: null };

      const logPayload = {
        timestamp,
        event: eventName,
        hasInteraction: !!interaction,
        ...info,
        args: args.map(formatValue),
      };

      console.log(`${prefix} ${eventName}`, logPayload);
    },
    [interaction],
  );

  /** События уровня сервиса */
  useCtiEvents(service, {
    [AGENT_EVENTS.AGENT_MODE_CHANGED]: () => {
      logEvent(AGENT_EVENTS.AGENT_MODE_CHANGED);
    },
    [AGENT_EVENTS.AGENT_STATE_CHANGED]: () => {
      logEvent(AGENT_EVENTS.AGENT_STATE_CHANGED);
    },
    [AGENT_EVENTS.CAPACITY_UPDATED]: () => {
      logEvent(AGENT_EVENTS.CAPACITY_UPDATED);
    },
    [AGENT_EVENTS.CHANGED_VOICE_MODE]: (...args: unknown[]) => {
      logEvent(AGENT_EVENTS.CHANGED_VOICE_MODE, ...args);
    },
    [AGENT_EVENTS.CLOSE_AGENT_SESSION]: (...args: unknown[]) => {
      logEvent(AGENT_EVENTS.CLOSE_AGENT_SESSION, ...args);
    },
    [AGENT_EVENTS.CONTACT_DATA_UPDATED]: (...args: unknown[]) => {
      logEvent(AGENT_EVENTS.CONTACT_DATA_UPDATED, ...args);
    },
    [AGENT_EVENTS.DEACTIVATE_AGENT]: (...args: unknown[]) => {
      logEvent(AGENT_EVENTS.DEACTIVATE_AGENT, ...args);
    },
    [AGENT_EVENTS.INTERACTIONS_CLEARED]: (...args: unknown[]) => {
      logEvent(AGENT_EVENTS.INTERACTIONS_CLEARED, ...args);
    },
    [AGENT_EVENTS.INTERACTION_COMPLETED]: (...args: unknown[]) => {
      logEvent(AGENT_EVENTS.INTERACTION_COMPLETED, ...args);
    },
    [AGENT_EVENTS.NEED_RECOVERY_WORKITEM]: (...args: unknown[]) => {
      logEvent(AGENT_EVENTS.NEED_RECOVERY_WORKITEM, ...args);
    },
    [AGENT_EVENTS.NEW_INTERACTION]: (...args: unknown[]) => {
      logEvent(AGENT_EVENTS.NEW_INTERACTION, ...args);
    },
    [AGENT_EVENTS.RECONNECTION_ATTEMPTS_HAVE_ENDED]: (
      ...args: unknown[]
    ) => {
      logEvent(AGENT_EVENTS.RECONNECTION_ATTEMPTS_HAVE_ENDED, ...args);
    },
    [AGENT_EVENTS.SERVER_IS_NOT_AVAILABLE]: (...args: unknown[]) => {
      logEvent(AGENT_EVENTS.SERVER_IS_NOT_AVAILABLE, ...args);
    },
    // События транспорта
    [TRANSPORT_CONNECTING]: () => {
      logEvent(TRANSPORT_CONNECTING);
      log({
        action: WORKLOG_ACTIONS.CTI_TRANSPORT_CONNECTING,
        task: "Inofrmation",
      });
    },
    [TRANSPORT_CONNECTED]: () => {
      logEvent(TRANSPORT_CONNECTED);
      log({
        action: WORKLOG_ACTIONS.CTI_TRANSPORT_CONNECTED,
        task: "Inofrmation",
      });
    },
    [TRANSPORT_DISCONNECTED]: (...args: unknown[]) => {
      logEvent(TRANSPORT_DISCONNECTED, ...args);
      log({
        action: WORKLOG_ACTIONS.CTI_TRANSPORT_DISCONNECTED,
        task: "Inofrmation",
      });
    },
    [TRANSPORT_ERROR]: (...args: unknown[]) => {
      logEvent(TRANSPORT_ERROR, ...args);
      log({
        action: WORKLOG_ACTIONS.CTI_TRANSPORT_ERROR,
        task: "Inofrmation",
      });
    },
  });

  /** События уровня взаимодействия */
  useCtiEvents(interaction, {
    [INTERACTION_EVENTS.AGENT_HANGUP]: (...args: unknown[]) => {
      logEvent(INTERACTION_EVENTS.AGENT_HANGUP, ...args);
    },
    [INTERACTION_EVENTS.CLIENT_HANGUP]: (...args: unknown[]) => {
      logEvent(INTERACTION_EVENTS.CLIENT_HANGUP, ...args);
    },
    [INTERACTION_EVENTS.CONSULT_HANGUP]: (...args: unknown[]) => {
      logEvent(INTERACTION_EVENTS.CONSULT_HANGUP, ...args);
    },
    [INTERACTION_EVENTS.CONTEXT_CHANGED]: (...args: unknown[]) => {
      logEvent(INTERACTION_EVENTS.CONTEXT_CHANGED, ...args);
    },
    [INTERACTION_EVENTS.INTERACTION_COMPLETED]: (...args: unknown[]) => {
      logEvent(INTERACTION_EVENTS.INTERACTION_COMPLETED, ...args);
    },
    [INTERACTION_EVENTS.JOINED_TO_CONFERENCE]: (...args: unknown[]) => {
      logEvent(INTERACTION_EVENTS.JOINED_TO_CONFERENCE, ...args);
    },
    [INTERACTION_EVENTS.RONA_TIMEOUT]: (...args: unknown[]) => {
      logEvent(INTERACTION_EVENTS.RONA_TIMEOUT, ...args);
    },
    [INTERACTION_EVENTS.SERVER_HANGUP]: (...args: unknown[]) => {
      logEvent(INTERACTION_EVENTS.SERVER_HANGUP, ...args);
    },
    [INTERACTION_EVENTS.WORKITEM_PARTYLIST_UPDATED]: (
      ...args: unknown[]
    ) => {
      logEvent(INTERACTION_EVENTS.WORKITEM_PARTYLIST_UPDATED, ...args);
    },
    [INTERACTION_EVENTS.WORKITEM_STATE_CHANGED]: (...args: unknown[]) => {
      logEvent(INTERACTION_EVENTS.WORKITEM_STATE_CHANGED, ...args);
    },
  });

  /** Логирование snapshots при их обновлении */
  useEffect(() => {
    if (snapshot) {
      console.log("[CTI LOG] snapshot", {
        workitemState: snapshot.workitemState,
        partyList: snapshot.partyList,
        data: snapshot.data,
      });
    }
  }, [snapshot]);
}
