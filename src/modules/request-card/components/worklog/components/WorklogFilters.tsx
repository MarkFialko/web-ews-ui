import { Button, Stack } from "@mui/material";

import type { Control } from "react-hook-form";

import { FormInputDropdown, FormInputDate, FormInputText } from "@shared/ui";

import { WORKLOG_ACTION_RUS, WORKLOG_HEADER_TEXTS } from "../constants";

import type { WorklogFormValues } from "../hooks/useWorklogForm";
import dayjs from "dayjs";
import { WORKLOG_SOURCE } from "@shared/worklog";
import { ACTION_SOURCE_MAP, type WorklogAction } from "@shared/worklog-logger";

const ACTION_OPTIONS = Object.entries(WORKLOG_ACTION_RUS)
  .filter(([value]) => {
    return ACTION_SOURCE_MAP[value as WorklogAction] === WORKLOG_SOURCE.WORKLOG;
  })
  .map(([value, label]) => ({ label, value }));

interface WorklogFiltersProps {
  control: Control<WorklogFormValues>;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function WorklogFilters(props: WorklogFiltersProps) {
  const { control, hasActiveFilters, onReset } = props;

  const t = WORKLOG_HEADER_TEXTS;

  return (
    <Stack
      spacing={1.5}
      sx={{
        p: 1.5,
        borderRadius: 1,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: (theme) => theme.palette.action.disabledBackground,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "flex-end" }}
      >
        <FormInputDate
          name="startDate"
          control={control}
          label={t.filterStartDate}
          maxDate={dayjs()}
        />

        <FormInputDate
          name="endDate"
          control={control}
          label={t.filterEndDate}
          maxDate={dayjs()}
        />

        <FormInputText
          name="authorPersonalNumber"
          control={control}
          label={t.filterAuthor}
          debounceMs={500}
          slotProps={{
            textField: {
              placeholder: t.filterAuthorPlaceholder,
              inputProps: { inputMode: "numeric", pattern: "[0-9]*" },
            },
          }}
        />

        <FormInputDropdown
          name="action"
          control={control}
          label={t.filterAction}
          options={[
            { label: t.filterAllActions, value: "" },
            ...ACTION_OPTIONS,
          ]}
        />

        {hasActiveFilters && (
          <Button
            sx={{ height: 39, width: 220 }}
            variant="contained"
            onClick={onReset}
          >
            {t.resetFilters}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
