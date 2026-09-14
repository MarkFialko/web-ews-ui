import { useState } from "react";

import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import { Chip, IconButton, Menu, MenuItem, Stack } from "@mui/material";

import { SORT_OPTIONS } from "../constants";
import type { TriageSortDirection, TriageSortKey } from "../types";
import { getSortOptionLabel } from "../utils";

type Props = {
  sortKey: TriageSortKey;
  sortDirection: TriageSortDirection;
  setSortKey: (value: TriageSortKey) => void;
  setSortDirection: (value: TriageSortDirection) => void;
};

export function TriageSort(props: Props) {
  const { sortKey, setSortKey, sortDirection, setSortDirection } = props;

  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{ ml: { md: "auto" } }}
    >
      <Chip
        clickable
        variant="outlined"
        label={`Сортировка: ${getSortOptionLabel(sortKey).toLowerCase()}`}
        onClick={(event) => setSortAnchorEl(event.currentTarget)}
      />
      <IconButton
        size="small"
        onClick={() =>
          setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        }
        sx={{ border: 1, borderColor: "divider", borderRadius: 999 }}
      >
        {sortDirection === "asc" ? (
          <ArrowUpwardRoundedIcon sx={{ fontSize: 18 }} />
        ) : (
          <ArrowDownwardRoundedIcon sx={{ fontSize: 18 }} />
        )}
      </IconButton>
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => setSortAnchorEl(null)}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sortKey}
            onClick={() => {
              setSortKey(option.value);
              if (sortKey !== option.value) {
                setSortDirection("asc");
              }
              setSortAnchorEl(null);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
}
