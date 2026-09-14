import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";

import {
  useActiveVoiceInteraction,
  useAgentSnapshot,
  useTelephonyService,
} from "@modules/cti/model";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type {
  IState,
  IStateReason,
  WorkitemStateID,
} from "@sber-scpl/core/jssdk";
import { useAppNotifications } from "@shared/notifications";
import { useState, useRef } from "react";

const getAgentStatusLabel = (
  workitemStateID: WorkitemStateID,
  state: IState,
  reason: IStateReason,
  nextState: IState,
  nextReason: IStateReason,
) => {
  if (workitemStateID === "OnHold") {
    if (nextState || nextReason) {
      return `На удержании (Запланировано: ${
        nextReason?.label ?? nextState?.label
      })`;
    }
    return "На удержании";
  }
  if (workitemStateID === "Wrapup") {
    if (nextState || nextReason) {
      return `Поствызывная обработка (Запланировано: ${
        nextReason?.label ?? nextState?.label
      })`;
    }
    return "Поствызывная обработка";
  }
  if (nextState || nextReason) {
    return `${reason?.label ?? state?.label} (Запланировано: ${
      nextReason?.label ?? nextState?.label
    })`;
  }
  return reason?.label ?? state?.label;
};

export const AgentStatusSelect = () => {
  const { notifyError, notifySuccess } = useAppNotifications();
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [showBreakStatuses, setShowBreakStatuses] = useState(false);
  const keepStatusMenuOpen = useRef(false);

  const service = useTelephonyService();
  const interaction = useActiveVoiceInteraction();
  const { state, dictionaries } = useAgentSnapshot();
  const workitemState = interaction?.getWorkitemState();
  const log = useWorklogLogger();

  const states = dictionaries?.states ?? [];

  const breakReasons = (
    states.find(({ id }) => id === "NotReady")?.reasons ?? []
  ).filter(({ reasonType }) => reasonType === "user");

  const loggedOffReasonId = (
    states.find(({ id }) => id === "LoggedOff")?.reasons ?? []
  ).find(({ reasonType }) => reasonType === "user")?.id;

  const dictionaryAgentState = states.find((s) => s.id === state?.stateID);
  const dictionaryAgentReason = dictionaryAgentState?.reasons?.find(
    (r) => r.id === state?.reasonID,
  );
  const dictionaryNextAgentState = states.find(
    (s) => s.id === state?.nextAgentState,
  );
  const dictionaryNextAgentReason = dictionaryNextAgentState?.reasons?.find(
    (r) => r.id === state?.nextReasonID,
  );

  const agentLabel = getAgentStatusLabel(
    workitemState?.workitemStateID,
    dictionaryAgentState,
    dictionaryAgentReason,
    dictionaryNextAgentState,
    dictionaryNextAgentReason,
  );

  return (
    <FormControl size="small" fullWidth>
      <InputLabel>Статус оператора</InputLabel>
      <Select
        label="Статус оператора"
        open={isStatusMenuOpen}
        value={agentLabel}
        onOpen={() => setIsStatusMenuOpen(true)}
        onClose={() => {
          if (keepStatusMenuOpen.current) return;

          setIsStatusMenuOpen(false);
          setShowBreakStatuses(false);
        }}
        onChange={async (event) => {
          const nextStatus = event.target.value as string;

          if (nextStatus === "ready") {
            const result = await service.getAgent()?.changeState("Ready");
            if (result?.ok) {
              log({
                action: WORKLOG_ACTIONS.CTI_AGENT_READY,
                task: "Information",
              });
            } else {
              notifyError(`Не удалось сменить статус: ${result?.resultDesc}`);
            }
            return;
          }

          if (nextStatus === "logout") {
            const stopResult = await service
              .getAgent()
              ?.stop(loggedOffReasonId!);

            if (stopResult?.ok) {
              service.disconnect();
              notifySuccess("Сессия оператора успешно завершена");
              return;
            }

            notifyError(
              `Не удалось завершить сессию оператора: ${stopResult?.resultDesc}`,
            );

            await service
              .getAgent()
              ?.changeState("NotReady", loggedOffReasonId);
            log({
              action: WORKLOG_ACTIONS.CTI_AGENT_LOGGEDOFF,
              task: "Information",
            });
            return;
          }

          if (nextStatus === "break-toggle") {
            keepStatusMenuOpen.current = true;
            setShowBreakStatuses((current) => !current);
            window.setTimeout(() => {
              setIsStatusMenuOpen(true);
              keepStatusMenuOpen.current = false;
            }, 0);
            return;
          }

          const changeResult = await service
            .getAgent()
            ?.changeState("NotReady", nextStatus);
          if (changeResult?.ok) {
            log({
              action: WORKLOG_ACTIONS.CTI_AGENT_NOTREADY,
              task: "Information",
            });
          } else {
            notifyError(
              `Не удалось сменить статус: ${changeResult?.resultDesc}`,
            );
          }
        }}
        renderValue={() => agentLabel}
      >
        <MenuItem
          value={agentLabel}
          disabled
          sx={{
            pointerEvents: "none",
            maxHeight: 0,
            maxWidth: 0,
            overflow: "hidden",
            opacity: "0 !important",
          }}
        >
          {agentLabel}
        </MenuItem>
        <MenuItem value="ready">Готов</MenuItem>

        <MenuItem value="break-toggle" selected={showBreakStatuses}>
          Перерыв
        </MenuItem>

        {showBreakStatuses
          ? breakReasons.map((reason) => (
              <MenuItem key={reason.id} value={reason.id} sx={{ pl: 4 }}>
                {reason.label}
              </MenuItem>
            ))
          : null}

        <MenuItem value="logout">Выйти из всех служб</MenuItem>
      </Select>
    </FormControl>
  );
};
