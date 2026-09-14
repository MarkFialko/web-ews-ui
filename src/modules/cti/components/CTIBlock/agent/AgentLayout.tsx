import { Paper, alpha, Stack, Typography } from "@mui/material";

import { AgentStatusSelect } from "./AgentStatusSelect";
import { useAgentSnapshot, useTimer } from "@modules/cti/model";

export const AgentLayout = () => {
  const { state } = useAgentSnapshot();

  const timer = useTimer(state?.timestampAgentState);

  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: 0.85,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.05),
      })}
    >
      <Stack spacing={0.75}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
        >
          <Stack alignItems="flex-end" spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              Таймер статуса
            </Typography>
            <Typography variant="subtitle2">{timer}</Typography>
          </Stack>
        </Stack>

        <AgentStatusSelect />
      </Stack>
    </Paper>
  );
};
