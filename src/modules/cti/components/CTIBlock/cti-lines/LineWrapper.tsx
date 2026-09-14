import { Paper, Stack } from "@mui/material";
import type { PropsWithChildren, ReactNode } from "react";

interface Props {
  extraActions?: ReactNode;
}

export const LineWrapper = (props: PropsWithChildren<Props>) => {
  const { extraActions, children } = props;
  return (
    <Paper variant="outlined" sx={{ p: 0.75, borderRadius: 2 }}>
      <Stack spacing={0.75}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          {children}
        </Stack>

        <Stack direction="row" spacing={0.75} alignSelf="flex-end" pt={1}>
          {extraActions}
        </Stack>
      </Stack>
    </Paper>
  );
};
