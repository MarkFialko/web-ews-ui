import { Typography } from "@mui/material";
import { useLastTicketsQuery } from "@modules/request-card";
import RequestRelatedIncidentsTab from "../tab-request/RequestRelatedIncidentsTab";
import type { ClientIncident } from "@modules/client-card";
import type { TicketItem, TicketsResponse } from "@modules/request-card/types";

export type HistoryTabPanelProps = {
  employeeNumber?: string | null;
  isActive?: boolean;
  activeIncidentId?: string | null;
  onOpenIncident?: (incident: ClientIncident) => void;
  ticketsData?: TicketsResponse | null;
};

const convertTicketItemToClientIncident = (
  item: TicketItem,
  owner: "me" | "group" | "other" | "closed",
): ClientIncident => ({
  id: item.ticketNumber ?? "",
  date: item.createdAt ?? "",
  title: item.subject ?? "",
  group: item.workGroup ?? "",
  status: item.status ?? "",
  priority: item.priority ?? "",
  owner,
  dueAt: item.dueDate ?? "",
  dueLeft: "",
  assignee: item.assignee ?? null,
  summary: item.description ?? item.subject ?? "",
});

const buildClientIncidents = (
  response: TicketsResponse | undefined,
): ClientIncident[] => {
  if (!response) return [];

  return [
    ...(response.onMe ?? []).map((t) =>
      convertTicketItemToClientIncident(t, "me"),
    ),
    ...(response.onGroup ?? []).map((t) =>
      convertTicketItemToClientIncident(t, "group"),
    ),
    ...(response.onOther ?? []).map((t) =>
      convertTicketItemToClientIncident(t, "other"),
    ),
    ...(response.closed ?? []).map((t) =>
      convertTicketItemToClientIncident(t, "closed"),
    ),
  ];
};

function HistoryTabPanel({
  employeeNumber,
  isActive,
  activeIncidentId,
  onOpenIncident,
  ticketsData,
}: HistoryTabPanelProps) {
  const { data: fetchedTickets, isLoading } = useLastTicketsQuery(
    employeeNumber ?? "",
    { skip: !!ticketsData || !employeeNumber || !isActive },
  );
  const resolvedTickets = ticketsData ?? fetchedTickets;

  if (!employeeNumber) {
    return (
      <Typography variant="body2" color="text.secondary">
        Данные об обращениях недоступны.
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Загрузка обращений...
      </Typography>
    );
  }

  const clientIncidents = buildClientIncidents(resolvedTickets);

  return (
    <>
      <RequestRelatedIncidentsTab
        incidents={clientIncidents}
        activeIncidentId={activeIncidentId}
        onOpenIncident={onOpenIncident}
      />
    </>
  );
}

export default HistoryTabPanel;
