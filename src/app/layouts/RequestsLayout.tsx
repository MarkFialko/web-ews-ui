import { alpha, Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AppHeader } from "@shared/components";

/** Лайаут-страница раздела «Запросы»: шапка приложения и рабочее место
 *  (очередь, заявка, инструменты) через <Outlet />. */
export function RequestsLayout() {
  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "40px minmax(0, 1fr)",
        background: `
          radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, 0.12)}, transparent 28%),
          linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.96)} 0%, ${theme.palette.background.default} 100%)
        `,
        color: "text.primary",
      })}
    >
      <AppHeader />
      <Box sx={{ p: 1, minHeight: 0, boxSizing: "border-box" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
