import { Box, Stack, Typography } from "@mui/material";
import { CopyButton } from "@shared/ui";

export function ClientPlainText({
  label,
  value,
  copyable = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.35}
      sx={{ minWidth: 0 }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 0 }}>
        {label}:{" "}
        <Box
          component="span"
          sx={{
            color: "text.primary",
            fontWeight: 800,
            overflowWrap: "anywhere",
          }}
        >
          {value}
        </Box>
      </Typography>
      {copyable ? (
        <CopyButton value={value} hint={`Скопировать ${label.toLowerCase()}`} />
      ) : null}
    </Stack>
  );
}
