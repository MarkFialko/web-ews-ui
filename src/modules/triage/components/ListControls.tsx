import {
  IconButton,
  Stack,
  Tooltip,
  alpha,
  type TriageFocusFilter,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { TriageSortKey } from "../types";
import type { buildTriageSummary } from "../model/triageSelectors";
import { SummaryActionChip } from "./SummaryActionChip";
import { TriageSort } from "./TriageSort";

type SortOptions = {
  sortKey: TriageSortKey;
  setSortKey: (key: TriageSortKey) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (dir: "asc" | "desc") => void;
};

type ListControlsProps = {
  sortOptions: SortOptions;
  focusFilter: TriageFocusFilter;
  summary: ReturnType<typeof buildTriageSummary>;
  totalCount: number;
  onSetFocusFilter: (value: TriageFocusFilter) => void;
  onToggleFocus: (value: TriageFocusFilter) => void;
  onResetFilters?: () => void;
  hasNonDefaultFilters?: boolean;
};

const FILTER_CHIPS = [
  { label: "Все", value: "all" as const, tone: "default" as const },
  { label: "Проср.", value: "overdue" as const, tone: "error" as const },
  { label: "SLA риск", value: "risk" as const, tone: "warning" as const },
  { label: "Новые", value: "new" as const, tone: "info" as const },
];

type FilterChip = (typeof FILTER_CHIPS)[number];

const getSummaryValue = (
  summary: ReturnType<typeof buildTriageSummary>,
  filter: FilterChip,
) => {
  switch (filter.value) {
    case "overdue":
      return summary.overdue;
    case "risk":
      return summary.risk;
    case "new":
      return summary.fresh;
    case "rest":
      return summary.rest;
    default:
      return 0;
  }
};

export function ListControls({
  sortOptions,
  focusFilter,
  summary,
  totalCount,
  onSetFocusFilter,
  onToggleFocus,
  onResetFilters,
  hasNonDefaultFilters,
}: ListControlsProps) {
  return (
    <Stack
      spacing={1}
      sx={(theme) => ({
        p: 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.default, 0.42),
      })}
    >
      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
      >
        {FILTER_CHIPS.map((chip) => (
          <SummaryActionChip
            key={chip.value}
            label={chip.label}
            value={
              chip.value === "all" ? totalCount : getSummaryValue(summary, chip)
            }
            tone={chip.tone}
            active={focusFilter === chip.value}
            onClick={() =>
              chip.value === "all"
                ? onSetFocusFilter(chip.value)
                : onToggleFocus(chip.value)
            }
          />
        ))}
        <TriageSort {...sortOptions} />
        {hasNonDefaultFilters && (
          <Tooltip title="Сбросить фильтры">
            <IconButton size="small" onClick={onResetFilters}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
}
