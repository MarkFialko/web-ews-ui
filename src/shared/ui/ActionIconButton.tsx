import type { ReactElement } from "react";
import { Box, Tooltip } from "@mui/material";

type Props = {
  bgcolor: string;
  icon: React.ElementType;
  tooltip: string;
  onClick: (e: React.MouseEvent) => void;
  iconSize?: number;
};

/**
 * Прямоугольная кнопка-иконка с цветной заливкой, скруглением 4px
 * и белой иконкой по центру.
 * Единый компонент для кнопок действий (чат/протокол/ЗПИ) в триажных списках,
 * как в демо-, так и в будущем реальном режиме.
 */
export function ActionIconButton({
  bgcolor,
  icon: Icon,
  tooltip,
  onClick,
  iconSize = 14,
}: Props): ReactElement {
  return (
    <Tooltip title={tooltip} placement="top">
      <Box
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e as unknown as React.MouseEvent);
          }
        }}
        sx={(theme) => ({
          width: 20,
          height: 20,
          borderRadius: "4px",
          backgroundColor: bgcolor,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: theme.transitions.create("opacity"),
          "&:hover": { opacity: 0.8 },
        })}
      >
        <Icon sx={{ fontSize: iconSize, color: "#fff", lineHeight: 0 }} />
      </Box>
    </Tooltip>
  );
}
