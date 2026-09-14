import type { Theme } from "@mui/material";

const CONTAINER = (theme: Theme) => ({
  height: "100vh",
  bgcolor: theme.palette.background.default,
  color: theme.palette.text.primary,
  p: { xs: 1.5, md: 2 },
});

const GRID = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    lg: "340px minmax(420px, 1fr) 360px",
  },
  gap: 1.5,
  height: { lg: "calc(100vh - 32px)" },
};

export const CTI_SX = { CONTAINER, GRID };
