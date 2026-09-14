import { Pagination, Stack, Typography } from "@mui/material";

import { FormInputDropdown } from "@shared/ui/rhf/FormInputDropdown";
import { WORKLOG_HEADER_TEXTS } from "../constants";
import type { Control, UseFormWatch } from "react-hook-form";

import {
  ITEMS_PER_PAGE_OPTIONS,
  type WorklogFormValues,
} from "../hooks/useWorklogForm";

interface WorklogPaginationProps {
  control: Control<WorklogFormValues>;
  watch: UseFormWatch<WorklogFormValues>;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

const t = WORKLOG_HEADER_TEXTS;

const SIZE_OPTIONS = ITEMS_PER_PAGE_OPTIONS.map((n) => ({
  label: String(n),
  value: String(n),
}));

export function WorklogPagination(props: WorklogPaginationProps) {
  const { control, watch, totalPages, totalElements, onPageChange } = props;

  const page = watch().page;
  const size = Number(watch().size);

  const start = page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);

  const showPagination = totalPages > 1;

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography variant="body2" color="text.secondary">
        {totalElements > 0
          ? `${start}–${end} из ${totalElements}`
          : t.noEntries}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2}>
        <FormInputDropdown
          name="size"
          control={control}
          label={t.itemsPerPage}
          options={SIZE_OPTIONS}
        />

        {showPagination && (
          <Pagination
            sx={{
              ".MuiPagination-ul": {
                justifySelf: "flex-end",
                flexWrap: "nowrap",
              },
            }}
            page={page + 1}
            count={totalPages}
            onChange={(_event, value) => onPageChange(value - 1)}
            showFirstButton
            showLastButton
            color="primary"
          />
        )}
      </Stack>
    </Stack>
  );
}
