import { Typography } from "@mui/material";

export function SecondarySeparator() {
  return (
    <Typography
      component="span"
      variant="caption"
      color="text.disabled"
      sx={{ flexShrink: 0 }}
    >
      ·
    </Typography>
  );
}
