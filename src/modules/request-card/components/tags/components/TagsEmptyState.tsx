import { Typography } from "@mui/material";

export function TagsEmptyState() {
  return (
    <Typography
      variant="body1"
      color="text.secondary"
      sx={{ textAlign: "center", py: 3 }}
    >
      Ничего не найдено
    </Typography>
  );
}
