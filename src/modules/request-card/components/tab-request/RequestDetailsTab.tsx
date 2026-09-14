import { Paper, Stack, Typography, Collapse, Button } from "@mui/material";
import type { ReactNode } from "react";
import { DataField, SectionHeader } from "@shared/ui";
import { formatDateTime } from "@shared/utils";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { getRusPriorityCode, type RequestDTO } from "@shared/request";
import { Worklog } from "../worklog";

export type RequestDetailsTabProps = {
  incident: RequestDTO;
  tagsSlot?: ReactNode;
  bottomSlot?: ReactNode;
};

const EXCLUDED_PROPERTY_CODES = new Set(["incidentType", "incType "]);

function RequestDetailsTab({
  incident,
  tagsSlot,
  bottomSlot,
}: RequestDetailsTabProps) {
  const [open, setOpen] = useState(false);

  const additionalProperties = incident.properties?.filter(
    (item) => !EXCLUDED_PROPERTY_CODES.has(item.code),
  );

  const categoryProperty = incident.properties?.find(
    (item) => item.code === "incidentType" || item.code === "incType ",
  );

  const mid = Math.ceil((additionalProperties?.length ?? 0) / 2);

  return (
    <Stack spacing={2}>
      <Stack spacing={1.5}>
        <Typography variant="subtitle1">{incident.title}</Typography>
        {tagsSlot}

        <Stack spacing={0.75}>
          <SectionHeader sx={{ mb: 0 }}>Описание проблемы</SectionHeader>
          <Typography
            variant="body2"
            sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}
          >
            {incident.description}
          </Typography>

          {additionalProperties?.length ? (
            <>
              <Button
                onClick={() => setOpen(!open)}
                sx={{
                  alignSelf: "flex-start",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 0,
                  py: 0,
                  minHeight: "unset",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                <Typography
                  variant="fieldLabel"
                  sx={{ ml: 0.5, userSelect: "none" }}
                >
                  Доп информация
                </Typography>
              </Button>
              <Collapse in={open}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  sx={{ px: 1, mt: 0.5 }}
                >
                  <Stack spacing={1} flex={1} minWidth={0}>
                    {additionalProperties.slice(0, mid).map((item) => (
                      <DataField
                        key={item.code}
                        label={item.name}
                        value={item.value}
                      />
                    ))}
                  </Stack>
                  <Stack spacing={1} flex={1} minWidth={0}>
                    {additionalProperties.slice(mid).map((item) => (
                      <DataField
                        key={item.code}
                        label={item.name}
                        value={item.value}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Collapse>
            </>
          ) : null}
        </Stack>
      </Stack>

      {bottomSlot}

      <Paper variant="outlined" sx={{ p: 1.75 }}>
        <Stack spacing={1.5}>
          <SectionHeader sx={{ mb: 0 }}>Ключевые данные</SectionHeader>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Stack spacing={1} flex={1} minWidth={0}>
              <DataField
                label="Рабочая группа"
                value={incident.workGroup?.workGroupLabel || "—"}
              />
              <DataField
                label="Дочерний элемент"
                value={incident.configurationElement}
              />
              <DataField
                label="Исполнитель"
                value={
                  incident.assignee.lastName +
                  (incident.assignee.firstName == null
                    ? ""
                    : " " + incident.assignee.firstName) +
                  (incident.assignee.middleName == null
                    ? ""
                    : " " + incident.assignee.middleName)
                }
              />
              <DataField
                label="Приоритет"
                value={getRusPriorityCode(incident.priorityCode)}
              />
              {categoryProperty && (
                <DataField
                  label="Категория запроса"
                  value={categoryProperty.value}
                />
              )}
            </Stack>
            <Stack spacing={1} flex={1} minWidth={0}>
              <DataField
                label="Создано"
                value={formatDateTime(incident.createdAt)}
              />
              <DataField label="Взято в работу" value={"—"} />
              <DataField
                label="Прогнозная дата"
                value={formatDateTime(incident.planFinishDate)}
              />
              <DataField label="Длительность работ" value={"—"} />
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Worklog key={incident.businessId} businessId={incident.businessId} />
    </Stack>
  );
}

export default RequestDetailsTab;
