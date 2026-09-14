import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { formatDateTime } from "@shared/utils";
import { buildEsmLink } from "../../utils/esmLink";
import type { ClientIncident } from "@modules/client-card";

export type RequestRelatedIncidentsTabProps = {
  incidents: ClientIncident[];
  activeIncidentId?: string | null;
  onOpenIncident?: (incident: ClientIncident) => void;
};

const getOwnerLabel = (owner: ClientIncident["owner"]) => {
  if (owner === "onMe") return "На мне";
  if (owner === "onGroup") return "На моей РГ";
  if (owner === "closed") return "Закрытые";
  return "На другой РГ";
};

const getStatusColor = (status: string) => {
  const normalized = status?.toLowerCase();
  if (normalized?.includes("эскал")) return "error";
  if (normalized?.includes("работ")) return "success";
  if (normalized?.includes("ответ") || normalized?.includes("ожида"))
    return "warning";
  return "default";
};

const OWNER_GROUPS = [
  { label: "На мне", value: "onMe" },
  { label: "На моей РГ", value: "onGroup" },
  { label: "На другой РГ", value: "onOther" },
  { label: "Закрытые", value: "closed" },
] as const;

function RequestRelatedIncidentsTab({
  incidents,
  activeIncidentId,
  onOpenIncident,
}: RequestRelatedIncidentsTabProps) {
  const [currentGroup, setCurrentGroup] = useState("onMe");

  if (incidents?.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Нет связанных обращений по клиенту.
      </Typography>
    );
  }

  const groupIncidents = useMemo(
    () =>
      incidents && Object.hasOwn(incidents, currentGroup)
        ? incidents[currentGroup]
        : [],
    [currentGroup, incidents],
  );

  return (
    <Stack spacing={1.25}>
      <Stack direction="row" spacing={1}>
        {OWNER_GROUPS.map(({ label, value }) => {
          const isActive = currentGroup === value;

          return (
            <Button
              key={value}
              variant="outlined"
              size="small"
              sx={{
                height: "3em",
                minWidth: "auto",
                px: 1.5,
                borderColor: isActive ? "primary.main" : "text.primary",
                borderWidth: "1.9px",
              }}
              onClick={() => setCurrentGroup(value)}
            >
              {label}
            </Button>
          );
        })}
      </Stack>

      {incidents?.dataQuality === "LIMITED" && (
        <Typography variant="caption" color="text.primary">
          Часть данных временно недоступна.
        </Typography>
      )}

      {groupIncidents.length > 0 ? (
        groupIncidents.map(
          ({
            incidentId,
            title,
            openTime,
            status,
            priority,
            summary,
            dueAt,
            dueLeft,
            closedAt,
          }) => {
            const isActive = incidentId === activeIncidentId;

            return (
              <Accordion key={incidentId} disableGutters variant="outlined">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon fontSize="small" />}
                  sx={{
                    px: 1.5,
                    "& .MuiAccordionSummary-content": {
                      my: 1.25,
                    },
                  }}
                >
                  <Stack spacing={0.75} sx={{ minWidth: 0, width: "100%" }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle2" noWrap>
                        {incidentId} · {title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {formatDateTime(openTime)}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={0.75}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Chip size="small" label={getOwnerLabel(currentGroup)} />
                      <Chip
                        size="small"
                        label={status}
                        color={getStatusColor(status)}
                      />
                      <Chip size="small" label={priority} />
                    </Stack>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 1.5 }}>
                  <Stack spacing={1.25}>
                    <Typography variant="body2" color="text.secondary">
                      {summary}
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Typography variant="caption" color="text.secondary">
                        Контрольный срок: {dueAt}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Остаток КС: {dueLeft}
                      </Typography>
                      {closedAt ? (
                        <Typography variant="caption" color="text.secondary">
                          Закрыто: {closedAt}
                        </Typography>
                      ) : null}
                    </Stack>

                    <Stack direction="row" justifyContent="flex-start">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={async () => {
                          const link = await buildEsmLink(incidentId);
                          window.open(link, "_blank");
                        }}
                      >
                        Открыть заявку
                      </Button>
                    </Stack>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          },
        )
      ) : (
        <Typography variant="caption" color="text.secondary">
          Запросы отсутствуют
        </Typography>
      )}
    </Stack>
  );
}

export default RequestRelatedIncidentsTab;
