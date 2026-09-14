import type { ReactNode } from "react";

import { Box, Stack, Typography } from "@mui/material";
import { CopyButton } from "@shared/ui";

export function ContactValue({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.75}
      sx={{
        minWidth: 0,
        px: 1,
        py: 0.65,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      {icon}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
      </Box>
      <CopyButton value={value} hint={`Скопировать ${label.toLowerCase()}`} />
    </Stack>
  );
}
