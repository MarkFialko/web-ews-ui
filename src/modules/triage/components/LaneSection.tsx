import { Stack, Divider, alpha, Chip } from "@mui/material";
import type { ReactNode } from "react";
import { type TriageLaneKey, TRIAGE_LANE_META } from "../model/triageSelectors";

interface Props {
  lane: TriageLaneKey;
  count: number;
  children: ReactNode;
}

export function LaneSection({ lane, count, children }: Props) {
  return (
    <Stack spacing={0.8}>
      <Divider
        textAlign="left"
        sx={(theme) => {
          const laneColor =
            lane === "overdue"
              ? theme.palette.error.main
              : lane === "risk"
                ? theme.palette.warning.main
                : lane === "new"
                  ? theme.palette.info.main
                  : theme.palette.text.primary;

          return {
            mt: 2,
            mb: 1,
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: theme.palette.background.paper,
            "&::before": {
              width: 0,
            },
            "&::after": {
              borderTopColor: alpha(laneColor, 0.32),
            },
          };
        }}
      >
        <Chip
          label={`${TRIAGE_LANE_META[lane].title} · ${count}`}
          size="small"
          variant="outlined"
          color={
            lane === "overdue"
              ? "error"
              : lane === "risk"
                ? "warning"
                : lane === "new"
                  ? "info"
                  : "default"
          }
          sx={(theme) => ({
            color:
              lane === "overdue"
                ? theme.palette.error.main
                : lane === "risk"
                  ? theme.palette.warning.main
                  : lane === "new"
                    ? theme.palette.info.main
                    : theme.palette.text.primary,
            borderColor:
              lane === "overdue"
                ? alpha(theme.palette.error.main, 0.5)
                : lane === "risk"
                  ? alpha(theme.palette.warning.main, 0.5)
                  : lane === "new"
                    ? alpha(theme.palette.info.main, 0.5)
                    : alpha(theme.palette.text.primary, 0.7),
            backgroundColor:
              lane === "overdue"
                ? alpha(theme.palette.error.main, 0.08)
                : lane === "risk"
                  ? alpha(theme.palette.warning.main, 0.08)
                  : lane === "new"
                    ? alpha(theme.palette.info.main, 0.08)
                    : alpha(theme.palette.text.primary, 0.02),
            fontWeight: 700,
          })}
        />
      </Divider>
      <Stack spacing={1}>{children}</Stack>
    </Stack>
  );
}
