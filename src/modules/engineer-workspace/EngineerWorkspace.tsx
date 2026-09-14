import { alpha, Box, useColorScheme } from "@mui/material";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Activity,
} from "react";
import {
  useCommandPalette,
  useCommandPaletteSource,
} from "@app/command-palette";
import { CompactTriageModule, TriageModule } from "@modules/triage";

import {
  ChatNotificationContext,
  useChatMessageBump,
} from "@modules/triage/hooks";
import type { EngineerRequest } from "@modules/engineer-requests";
import { RequestCardModule } from "@modules/request-card";
import { ModuleDevGate } from "@shared/dev";
import { useAppNotifications } from "@shared/notifications";
import {
  DEFAULT_DEV_ERROR_SIMULATION_STATE,
  type DevErrorSimulationState,
} from "@shared/dev";
import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";
import { TICKET_TOOL_LAUNCHERS } from "./commands/ticketToolLaunchers";
import { buildDefaultWorkspaceCommands } from "./commands/workspaceCommandRegistry";
import { useKeyPress } from "@shared/hooks";
import { useTriageRequests } from "@modules/triage/model";
import { useUser } from "@shared/user";
import { ToolPanelShell } from "./components/ToolPanelShell";
import { PanelSurface } from "./components/PanelSurface";
import {
  COMMUNICATION_MAP,
  useRequestsRouter,
  type Communication,
} from "@shared/routing";

import { WorkspaceToolPanel } from "./components/WorkspaceToolPanel";

type WorkspaceMode = "triage" | "ticket" | "tool";

const MAX_OPEN_REQUESTS = 12;

const upsertOpenRequestIds = (current: string[], requestId: string) =>
  [requestId, ...current.filter((item) => item !== requestId)].slice(
    0,
    MAX_OPEN_REQUESTS,
  );

const getMode = (
  activeRequestId: string | null,
  c: Communication | null,
): WorkspaceMode => {
  if (!activeRequestId) return "triage";
  if (c) return "tool";
  return "ticket";
};

export default function EngineerWorkspace() {
  const { notify } = useAppNotifications();

  const {
    ticketId,
    communication,
    openRequests,
    closeRequest,
    openTicket,
    opencommunication,
    closecommunication,
  } = useRequestsRouter();

  const sourceRequestById = useMemo(() => new Map<string, unknown>(), []);
  const requestById = useMemo(() => new Map<string, EngineerRequest>(), []);

  const [viewedRequestIds, setViewedRequestIds] = useState<string[]>([]);
  const [devErrorSimulation, setDevErrorSimulation] =
    useState<DevErrorSimulationState>(DEFAULT_DEV_ERROR_SIMULATION_STATE);
  const { open: openCommandPalette, close: closeCommandPalette } =
    useCommandPalette();

  const workspaceMode = getMode(ticketId, communication);

  const visibleViewedRequestIds = useMemo(
    () =>
      viewedRequestIds.filter((requestId) => sourceRequestById.has(requestId)),
    [sourceRequestById, viewedRequestIds],
  );

  const effectiveViewedRequestIds = useMemo(
    () =>
      ticketId
        ? upsertOpenRequestIds(visibleViewedRequestIds, ticketId)
        : visibleViewedRequestIds,
    [ticketId, visibleViewedRequestIds],
  );

  const handleCallDraftStateChange = useCallback(() => {
    // No-op placeholder; expand with actual call draft logic.
  }, []);

  const log = useWorklogLogger();

  const { triageRequests } = useTriageRequests();
  const { user } = useUser();

  const chatBump = useChatMessageBump({
    triageRequests,
    employeeNumber: user?.employeeNumber,
  });

  const scrollHandlersRef = useRef<
    Record<string, (businessId: string, messageId: number) => void>
  >({});

  /**
   * Вызывается после dismiss — скроллит все зарегистрированные triage-листы
   * к заявке, которая переместилась из lane "userFeedback" в свою нормальную позицию.
   */
  const onDismiss = useCallback((businessId: string, messageId: number) => {
    const handlers = Object.values(scrollHandlersRef.current);
    for (const h of handlers) {
      h(businessId, messageId);
    }
  }, []);

  // Регистрация колбэка скролла для triage-листа — вызывается из TriageList/
  // CompactTriageList при монтировании/отключении.
  const registerScrollHandler = useCallback(
    (
      key: string,
      handler: (businessId: string, messageId: number) => void,
    ) => {
      scrollHandlersRef.current[key] = handler;
      return () => {
        delete scrollHandlersRef.current[key];
      };
    },
    [],
  );

  // Большой список запросов (очередь) монтируется один раз на всё время
  // считаем сам переход в режим triage (включая первичный показ), а не
  // монтирование компонента. Кода `ews.list.open` в БТ нет — заведён нами.
  const prevWorkspaceModeRef = useRef<WorkspaceMode | null>(null);
  useEffect(() => {
    if (
      workspaceMode === "triage" &&
      prevWorkspaceModeRef.current !== "triage"
    ) {
      log({
        action: WORKLOG_ACTIONS.LIST_OPEN,
        task: "Information",
      });
    }

    prevWorkspaceModeRef.current = workspaceMode;
  }, [workspaceMode, log]);

  const selectRequest = useCallback(
    (ticketId: string) => {
      setViewedRequestIds((current) =>
        upsertOpenRequestIds(current, ticketId),
      );
      log({ action: WORKLOG_ACTIONS.OPEN_TASK_BIG, task: ticketId });
      openTicket(ticketId, null);
    },
    [openTicket, log],
  );

  const restoreRequestContext = useCallback(
    (ticketId: string) => {
      setViewedRequestIds((current) =>
        upsertOpenRequestIds(current, ticketId),
      );
      log({ action: WORKLOG_ACTIONS.OPEN_TASK, task: ticketId });
      openTicket(ticketId, null);
    },
    [openTicket, log],
  );

  // Открытие чата из метки «новое сообщение» в списке.
  // Идём напрямую через onOpenTool (обновляет URL на /ticket/:id/chat),
  // не полагаясь на requestById — в момент клика заявка может быть ещё
  // не подгружена, но чат рендерится по businessId из URL.
  const openChatFromNotification = useCallback(
    (businessId: string) => {
      setViewedRequestIds((current) =>
        upsertOpenRequestIds(current, businessId),
      );
      openTicket(businessId, COMMUNICATION_MAP.CHAT);
    },
    [openTicket, setViewedRequestIds],
  );

  const createLocalSupportEntry = useCallback(() => {
    notify("Обращение в локальную поддержку создано.");
  }, [notify]);

  useKeyPress("Escape", (isPressed) => {
    if (!isPressed) return;

    if (communication) {
      closecommunication();
      return;
    }

    if (ticketId) {
      closeRequest();
    }
  });

  const { mode, setMode } = useColorScheme();

  const defaultPaletteCommands = useMemo(
    () =>
      buildDefaultWorkspaceCommands({
        mode: mode as "light" | "dark",
        toggleMode: () => {
          setMode(mode === "dark" ? "light" : "dark");
          closeCommandPalette();
        },
      }),
    [closeCommandPalette, mode, setMode],
  );

  useCommandPaletteSource({ defaultItems: defaultPaletteCommands });

  const toolContent = ticketId ? (
    <WorkspaceToolPanel
      activeRequestId={ticketId}
      toolId={communication}
      onClose={openRequests}
      onCreateLocalSupportEntry={createLocalSupportEntry}
      devErrorSimulation={devErrorSimulation}
      onDevErrorSimulationChange={setDevErrorSimulation}
      onCallDraftStateChange={handleCallDraftStateChange}
      onCloseRequest={closeRequest}
    />
  ) : null;

  return (
    <ModuleDevGate
      moduleName="Приложение"
      crashLabel="EngineerWorkspaceApp"
      devCrash={devErrorSimulation.app}
      resetKey={`app:${devErrorSimulation.app}`}
      onReset={() =>
        setDevErrorSimulation((current) => ({
          ...current,
          app: "none",
        }))
      }
    >
      <ChatNotificationContext.Provider
        value={{
          activeBusinessIds: chatBump.activeBusinessIds,
          resolveMessageId: chatBump.resolveMessageId,
          removeBusinessId: chatBump.removeBusinessId,
          clearBump: chatBump.clearBump,
          dismissMessage: chatBump.dismissMessage,
          onDismiss,
          registerScrollHandler,
        }}
      >
        <Box
          sx={(theme) => ({
            background: `
          radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, 0.12)}, transparent 28%),
          linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.96)} 0%, ${theme.palette.background.default} 100%)
        `,
            color: "text.primary",
          })}
        >
          <Box
            sx={{
              height: "calc(100vh - 56px)",
              p: 1,
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gap: 1,
                height: "100%",
                minHeight: 0,
                gridTemplateColumns:
                  workspaceMode === "triage"
                    ? { xs: "1fr", lg: "minmax(0, 1fr) 72px" }
                    : workspaceMode === "tool"
                      ? {
                          xs: "1fr",
                          lg: "minmax(250px, 20%) minmax(0, 45%) minmax(340px, 35%)",
                        }
                      : {
                          xs: "1fr",
                          lg: "minmax(250px, 20%) minmax(0, 1fr) 72px",
                        },
              }}
            >
              {workspaceMode === "triage" && (
                <PanelSurface>
                  <TriageModule
                    resetKey={`triage:${devErrorSimulation.triage}`}
                    onReload={() =>
                      setDevErrorSimulation((current) => ({
                        ...current,
                        triage: "none",
                      }))
                    }
                    devCrash={devErrorSimulation.triage}
                    activeRequestId={ticketId}
                    viewedRequestIds={effectiveViewedRequestIds}
                    onOpenRequest={(request) => {
                      selectRequest(request.businessId);
                    }}
                    onChat={openChatFromNotification}
                  />
                </PanelSurface>
              )}
              <Activity mode={workspaceMode !== "triage" ? "visible" : "hidden"}>
                <CompactTriageModule
                  resetKey={`compact-triage:${devErrorSimulation.compactTriage}`}
                  onReload={() =>
                    setDevErrorSimulation((current) => ({
                      ...current,
                      compactTriage: "none",
                    }))
                  }
                  devCrash={devErrorSimulation.compactTriage}
                  requestId={ticketId}
                  viewedRequestIds={effectiveViewedRequestIds}
                  onSelectRequest={(request) => {
                    restoreRequestContext(request.businessId);
                  }}
                  onChat={openChatFromNotification}
                />
              </Activity>
              {workspaceMode !== "triage" && (
                <PanelSurface contentOverflow="hidden">
                  <RequestCardModule
                    resetKey={`request-card:${devErrorSimulation.requestCard}`}
                    onReload={() =>
                      setDevErrorSimulation((current) => ({
                        ...current,
                        requestCard: "none",
                      }))
                    }
                    devCrash={devErrorSimulation.requestCard}
                    incidentId={ticketId!}
                    devClientErrorKind={devErrorSimulation.clientCard}
                    onClientErrorRetry={() =>
                      setDevErrorSimulation((current) => ({
                        ...current,
                        clientCard: "none",
                      }))
                    }
                    onActionNotify={(message, severity = "success") =>
                      notify(message, severity)
                    }
                    knowledgeIntentArticle={null}
                    onLinkKnowledgeArticle={() => {}}
                    onClose={openRequests}
                    onOpenIncident={(incident) => {
                      const nextRequest = requestById.get(incident.id);
                      if (nextRequest)
                        restoreRequestContext(nextRequest.businessId);
                    }}
                  />
                </PanelSurface>
              )}

              <ToolPanelShell
                tools={workspaceMode === "triage" ? [] : TICKET_TOOL_LAUNCHERS}
                activeToolId={communication}
                onClose={closecommunication}
                onToolClick={opencommunication}
                onPaletteClick={openCommandPalette}
                activeRequestId={ticketId!}
              >
                {toolContent}
              </ToolPanelShell>
            </Box>
          </Box>
        </Box>
      </ChatNotificationContext.Provider>
    </ModuleDevGate>
  );
}
