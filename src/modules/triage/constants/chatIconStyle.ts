import type { SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles";

/** Цвет чат-иконки из MUI палитры. */
export const CHAT_ICON_COLOR = "success.main";

/** Текст тултипа на чат-иконке. */
export const CHAT_TOOLTIP = "Входящее сообщение в чат";

/**
 * Пульсация прозрачности зелёной иконки.
 * Анимируется только opacity — без цвета и фона, чтобы не было белых кадров.
 * Уважает prefers-reduced-motion.
 */
export const chatPulseSx: SxProps<Theme> = {
  "@keyframes chat-notification-pulse": {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.4 },
  },
  animation: "chat-notification-pulse 1.8s ease-in-out infinite",
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

/**
 * Цвет ставим на саму иконку, а не на обёртку: в теме глобальный
 * MuiSvgIcon-root override (color: text.primary) перебивает наследуемый
 * цвет родителя. Локальный sx имеет приоритет над styleOverrides темы.
 */
export const chatIconSvgSx: SxProps<Theme> = {
  fontSize: 16,
  color: CHAT_ICON_COLOR,
};

/** Общие стили чат-иконки-метки с пульсацией. */
export const chatIconSx = (clickable?: boolean): SxProps<Theme> => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "filter 0.5s ease",
  width: 20,
  height: 20,
  flexShrink: 0,
  cursor: clickable ? "pointer" : "default",
  ...chatPulseSx,
  "&:hover": {
    animation: "none",
    opacity: 1,
    filter: "brightness(1.3)",
  },
});
