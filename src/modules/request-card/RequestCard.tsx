import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Paper, Stack, Tab, Tabs } from "@mui/material";
import { formatDateTime } from "@shared/utils";
import { getModuleErrorStateProps, type DevErrorKind } from "@shared/dev";
import type { AppNotificationSeverity } from "@shared/notifications";
import type { ClientProfile, ClientIncident } from "@modules/client-card";
import type { KnowledgeListArticle } from "./components/common/AdaptiveCommunicationBlock";
import { useOptimisticTaskCache } from "./hooks/useOptimisticTaskCache";
import { formatSlaLeft } from "./utils";

import RequestHeader from "./components/common/RequestHeader";
import { RequestBriefingCard } from "./components/common/RequestBriefingCard";
import { RequestCardSkeleton } from "./components/common/RequestCardSkeleton";
import { RequestTagsSection } from "./components/tags";
import RequestDetailsTab from "./components/tab-request/RequestDetailsTab";
import ClientTabPanel from "./components/tab-client/ClientTabPanel";
import WorkstationTabPanel from "./components/tab-workstation/WorkstationTabPanel";
import AccessTabPanel from "./components/tab-access/AccessTabPanel";
import HistoryTabPanel from "./components/tab-history/HistoryTabPanel";
import type { RequestDTO } from "@shared/request";

export type RequestCardProps = {
  incidentId: string;
  client?: ClientProfile;
  clientIncidents?: ClientIncident[];
  onClose?: () => void;
  onOpenIncident?: (incident: ClientIncident) => void;
  errorMessage?: string;
  errorSeverity?: "info" | "warning" | "error";
  onErrorRetry?: () => void;
  devRequestErrorKind?: DevErrorKind;
  onRequestErrorRetry?: () => void;
  devClientErrorKind?: DevErrorKind;
  onClientErrorRetry?: () => void;
  onActionNotify?: (
    message: string,
    severity?: AppNotificationSeverity,
  ) => void;
  knowledgeIntentArticle?: KnowledgeListArticle | null;
  onLinkKnowledgeArticle?: (articleId: string) => void;
};

export const TAB_LABELS = {
  REQUEST: "request",
  CLIENT: "client",
  WORKSTATION: "workstation",
  ACCESS: "access",
  HISTORY: "history",
} as const;

export type RequestCardTab = (typeof TAB_LABELS)[keyof typeof TAB_LABELS];

const RECENT_INCIDENTS_STORAGE_KEY = "last_incidents";
const MAX_STORED_INCIDENTS = 10;

const recordLastIncident = (businessId: string) => {
  try {
    const raw = localStorage.getItem(RECENT_INCIDENTS_STORAGE_KEY);
    const list: Record<string, string> = raw ? JSON.parse(raw) : {};

    list[businessId] = new Date().toISOString();

    const sorted = Object.entries(list).sort(
      ([, a], [, b]) => new Date(b).getTime() - new Date(a).getTime(),
    );
    const trimmed = Object.fromEntries(sorted.slice(0, MAX_STORED_INCIDENTS));

    localStorage.setItem(RECENT_INCIDENTS_STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage недоступен — игнорируем
  }
};

function RequestCard({
  incidentId,
  onClose,
  onOpenIncident,
  errorMessage,
  errorSeverity = "warning",
  onErrorRetry,
  devRequestErrorKind = "none",
  onRequestErrorRetry,
  devClientErrorKind = "none",
  onClientErrorRetry,
}: RequestCardProps) {
  const [uncontrolledActiveTab, setUncontrolledActiveTab] =
    useState<RequestCardTab>(TAB_LABELS.REQUEST);

  const {
    taskData,
    employeeInfo,
    employeePhoto,
    employeeArms,
    accessInfo,
    lastTickets,
    refetch,
  } = useOptimisticTaskCache(incidentId);

  const { businessId, initiator = {} as RequestDTO["initiator"] } = (taskData ??
    {}) as RequestDTO;
  const personalNumber = initiator?.personalNumber ?? "";

  useEffect(() => {
    if (taskData && businessId) {
      recordLastIncident(businessId);
    }
  }, [taskData, businessId]);

  const slaInfo = useMemo(() => formatSlaLeft(taskData), [taskData]);

  const availableTabs = useMemo<RequestCardTab[]>(() => {
    const tabs: RequestCardTab[] = [TAB_LABELS.REQUEST];
    if (personalNumber) {
      tabs.push(
        TAB_LABELS.CLIENT,
        TAB_LABELS.WORKSTATION,
        TAB_LABELS.ACCESS,
        TAB_LABELS.HISTORY,
      );
    }
    return tabs;
  }, [personalNumber]);
  const activeTab = uncontrolledActiveTab;
  const setActiveTab = (nextTab: RequestCardTab) => {
    setUncontrolledActiveTab(nextTab);
  };
  const resolvedActiveTab = availableTabs.includes(activeTab)
    ? activeTab
    : TAB_LABELS.REQUEST;

  const showRequestErrorNotice =
    devRequestErrorKind === "info" || devRequestErrorKind === "action";
  const requestErrorStateProps = showRequestErrorNotice
    ? getModuleErrorStateProps("Карточка обращения", devRequestErrorKind)
    : null;
  const showClientErrorNotice =
    resolvedActiveTab !== TAB_LABELS.REQUEST &&
    (devClientErrorKind === "info" || devClientErrorKind === "action");
  const clientErrorStateProps =
    resolvedActiveTab !== TAB_LABELS.REQUEST && devClientErrorKind !== "none"
      ? getModuleErrorStateProps("Карточка клиента", devClientErrorKind)
      : null;

  return taskData ? (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        height: { lg: "calc(100vh - 32px)" },
        overflowY: "auto",
        pb: 4,
      }}
    >
      <RequestHeader
        incident={taskData}
        createdAtLabel={formatDateTime(taskData.createdAt)}
        slaLabel={slaInfo.label}
        slaTooltip={slaInfo.clockLabel}
        slaTone={slaInfo.tone}
        onClose={onClose}
        onTaskUpdate={refetch}
      />

      <Box
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: 2,
          scrollbarGutter: "stable",
        }}
      >
        <Stack spacing={1.75}>
          {requestErrorStateProps ? (
            <Alert
              severity={requestErrorStateProps.severity}
              variant="outlined"
              action={
                onRequestErrorRetry ? (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={onRequestErrorRetry}
                  >
                    {requestErrorStateProps.retryLabel}
                  </Button>
                ) : undefined
              }
            >
              <strong>{requestErrorStateProps.title}</strong>{" "}
              {requestErrorStateProps.description}
            </Alert>
          ) : null}

          {errorMessage ? (
            <Alert
              severity={errorSeverity}
              action={
                onErrorRetry ? (
                  <Button color="inherit" size="small" onClick={onErrorRetry}>
                    Повторить
                  </Button>
                ) : undefined
              }
            >
              {errorMessage}
            </Alert>
          ) : null}

          {showClientErrorNotice && clientErrorStateProps ? (
            <Alert
              severity={clientErrorStateProps.severity}
              variant="outlined"
              action={
                onClientErrorRetry ? (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={onClientErrorRetry}
                  >
                    {clientErrorStateProps.retryLabel}
                  </Button>
                ) : undefined
              }
            >
              <strong>{clientErrorStateProps.title}</strong>{" "}
              {clientErrorStateProps.description}
            </Alert>
          ) : null}

          <RequestBriefingCard incident={taskData} />

          <Tabs
            value={resolvedActiveTab}
            onChange={(_, value: RequestCardTab) => {
              setActiveTab(value);
            }}
          >
            <Tab value={TAB_LABELS.REQUEST} label="Заявка" />
            {personalNumber ? (
              <Tab value={TAB_LABELS.CLIENT} label="Клиент" />
            ) : null}
            {personalNumber ? (
              <Tab value={TAB_LABELS.WORKSTATION} label="Инфо об АРМ" />
            ) : null}
            {personalNumber ? (
              <Tab value={TAB_LABELS.ACCESS} label="Доступы" />
            ) : null}
          </Tabs>

          <Box sx={{ flex: 1, overflowY: "auto", scrollbarGutter: "stable" }}>
            <Stack spacing={1.75}>
              {resolvedActiveTab === TAB_LABELS.REQUEST ? (
                <RequestDetailsTab
                  incident={taskData}
                  slaLabel={slaInfo.label}
                  tagsSlot={
                    <RequestTagsSection
                      key={taskData.tags}
                      request={taskData}
                    />
                  }
                />
              ) : null}

              {resolvedActiveTab === TAB_LABELS.CLIENT ? (
                <ClientTabPanel
                  employeeNumber={personalNumber}
                  isActive
                  employeeInfo={employeeInfo}
                  employeePhoto={employeePhoto}
                />
              ) : null}

              {resolvedActiveTab === TAB_LABELS.WORKSTATION ? (
                <WorkstationTabPanel
                  employeeNumber={personalNumber}
                  isActive
                  workstations={employeeArms}
                />
              ) : null}

              {resolvedActiveTab === TAB_LABELS.ACCESS ? (
                <AccessTabPanel
                  employeeNumber={personalNumber}
                  isActive
                  accessData={accessInfo}
                />
              ) : null}

              {resolvedActiveTab === TAB_LABELS.HISTORY ? (
                <HistoryTabPanel
                  employeeNumber={personalNumber}
                  isActive
                  ticketsData={lastTickets}
                  activeIncidentId={incidentId}
                  onOpenIncident={onOpenIncident}
                />
              ) : null}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  ) : (
    <RequestCardSkeleton />
  );
}

export default RequestCard;
