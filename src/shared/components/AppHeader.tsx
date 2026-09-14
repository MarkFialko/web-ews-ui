import { alpha, Box, Typography } from "@mui/material";

/** Единая шапка приложения: брендинг WebEWS и навигация по разделам. */
function AppHeader() {
  return (
    <Box
      sx={(theme) => ({
        height: 40,
        px: 1,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: "blur(10px)",
      })}
    >
      <Typography
        sx={{ fontSize: 11, letterSpacing: "0.12em", fontWeight: 700 }}
      >
        WebEWS
      </Typography>
    </Box>
  );
}

export default AppHeader;
