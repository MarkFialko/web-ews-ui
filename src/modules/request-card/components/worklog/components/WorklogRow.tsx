import { Stack, Box, Typography } from "@mui/material";

import type { WorklogDto } from "../types";
import { WORKLOG_ACTION_RUS } from "../constants";

import dayjs from "dayjs";
import { WorklogActionIcon } from "./WorklogActionIcon";

interface Props {
  worklog: WorklogDto;
}

export const WorklogRow = (props: Props) => {
  const { worklog } = props;

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1.5}
      alignItems={{ xs: "flex-start", md: "stretch" }}
      sx={{ py: 1.25 }}
    >
      <Box
        sx={(theme) => ({
          width: { xs: "100%", md: 168 },
          minWidth: { md: 168 },
          px: 1,
          py: 0.85,
          borderRadius: 1.5,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: "rgba(0, 0, 0, 0.03)",
        })}
      >
        <Typography variant="fieldLabel">
          {dayjs(worklog.timestamp).format("DD.MM.YYYY, HH:mm:ss")}
        </Typography>
        <Typography variant="bodyAccent">
          {worklog.author.engineerName}
        </Typography>
      </Box>

      <Stack spacing={0.6} sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="bodyAccent">
            {WORKLOG_ACTION_RUS[worklog.action]}
          </Typography>
          <WorklogActionIcon
            action={worklog.action}
            businessId={worklog.task}
          />
        </Stack>
        <Typography variant="body2">{worklog.description}</Typography>
      </Stack>
    </Stack>
  );
};
