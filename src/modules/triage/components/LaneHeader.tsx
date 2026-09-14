import { alpha, Chip, Divider } from "@mui/material";
import { type TriageLaneKey, TRIAGE_LANE_META } from "../model/triageSelectors";

function getLaneColorKey(
  lane: TriageLaneKey,
): "error" | "warning" | "info" | "secondary" | "default" {
  if (lane === "userFeedback") return "secondary";
  if (lane === "overdue") return "error";
  if (lane === "risk") return "warning";
  if (lane === "new") return "info";
  return "default";
}

type LaneHeaderProps = {
  lane: TriageLaneKey;
  count: number;
};

export function LaneHeader({ lane, count }: LaneHeaderProps) {
  return (
    <Divider
      textAlign="left"
      sx={(theme) => {
        const laneColor =
          lane === "userFeedback"
            ? theme.palette.secondary.main
            : lane === "overdue"
              ? theme.palette.error.main
              : lane === "risk"
                ? theme.palette.warning.main
                : lane === "new"
                  ? theme.palette.info.main
                  : theme.palette.text.primary;

        return {
          mt: 0,
          mb: 0,
          position: "sticky",
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
        color={getLaneColorKey(lane)}
        sx={(theme) => {
          const laneColor =
            lane === "userFeedback"
              ? theme.palette.secondary.main
              : lane === "overdue"
                ? theme.palette.error.main
                : lane === "risk"
                  ? theme.palette.warning.main
                  : lane === "new"
                    ? theme.palette.info.main
                    : theme.palette.text.primary;

          return {
            color: laneColor,
            borderColor: alpha(laneColor, 0.5),
            backgroundColor: alpha(laneColor, 0.08),
            fontWeight: 700,
            mb: 1,
            mt: 1.5,
          };
        }}
      />
    </Divider>
  );
}
