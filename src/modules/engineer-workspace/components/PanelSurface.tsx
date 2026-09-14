import { Box } from "@mui/material";
import type { ReactNode } from "react";

export function PanelSurface({
  children,
  contentOverflow = "auto",
}: {
  children: ReactNode;
  contentOverflow?: "auto" | "hidden";
}) {
  return (
    <Box sx={{ minWidth: 0, minHeight: 0, overflow: contentOverflow }}>
      {children}
    </Box>
  );
}
