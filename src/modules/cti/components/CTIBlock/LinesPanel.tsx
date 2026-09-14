import { Paper, Stack, Typography } from "@mui/material";
import type { PropsWithChildren } from "react";

interface Props {
  title: string;
}

export const LinesPanel = (props: PropsWithChildren<Props>) => {
  const { title, children } = props;

  return (
    <Paper variant="outlined" sx={{ p: 0.75, borderRadius: 2 }}>
      <Stack spacing={0.75}>
        <Typography variant="caption" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        {children}
      </Stack>
    </Paper>
  );
};
