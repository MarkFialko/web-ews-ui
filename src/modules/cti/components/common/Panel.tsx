import { Paper, Box, alpha, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  title: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}

export const Panel = (props: Props) => {
  const { title, icon, action, children } = props;

  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        minHeight: 0,
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: alpha(theme.palette.background.paper, 0.92),
      })}
    >
      <Stack sx={{ height: "100%", minHeight: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ px: 1.5, py: 1.25, borderBottom: 1, borderColor: "divider" }}
        >
          {icon}
          <Typography variant="subtitle1" sx={{ flex: 1, minWidth: 0 }}>
            {title}
          </Typography>
          {action}
        </Stack>
        <Box sx={{ p: 1.5, minHeight: 0, overflow: "auto", flex: 1 }}>
          {children}
        </Box>
      </Stack>
    </Paper>
  );
};
