import { Box, Stack } from "@mui/material";
import type { ComponentType } from "react";

import { TriageRowSkeleton } from "./TriageRowSkeleton";
import { CompactTriageRowSkeleton } from "./CompactTriageRowSkeleton";

const SKELETON_ROW_COUNT_DEFAULT = 10;
const SKELETON_ROW_COUNT_COMPACT = 15;

type RowType = "request" | "compact";

const ROW_COMPONENT_MAP: Record<RowType, ComponentType> = {
  request: TriageRowSkeleton,
  compact: CompactTriageRowSkeleton,
};

const ROW_COUNT_MAP: Record<RowType, number> = {
  request: SKELETON_ROW_COUNT_DEFAULT,
  compact: SKELETON_ROW_COUNT_COMPACT,
};

export function TriageListSkeleton({ rowType }: { rowType: RowType }) {
  const RowComponent = ROW_COMPONENT_MAP[rowType];
  const count = ROW_COUNT_MAP[rowType];

  const rows = Array.from({ length: count }, (_, i) => (
    <Box key={i as number} sx={{ pb: 1.5 }}>
      {/* @ts-expect-error — RowComponent типизирован через Record */}
      <RowComponent />
    </Box>
  ));

  return <Stack spacing={0.5}>{rows}</Stack>;
}
