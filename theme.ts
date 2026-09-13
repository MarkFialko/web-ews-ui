import {
  alpha,
  createTheme,
  type Components,
  type PaletteMode,
  type Theme,
  type ThemeOptions,
} from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";

const BORDER_RADIUS = 8;

// Central palette tokens. These are the only semantic colors the app should
// build on top of for generic UI states.
const getPalette = (mode: PaletteMode): ThemeOptions["palette"] => ({
  mode,
  primary: {
    main: "#106DFF",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#E81123",
  },
  warning: {
    main: "#F59E0B",
    contrastText: "#FFFFFF",
  },
  info: {
    main: "#2563EB",
  },
  success: {
    main: "#16A34A",
    dark: "#15803d",
  },
  vip: {
    main: "#6D28D9",
    dark: "#5B21B6",
    contrastText: "#FFFFFF",
    focusRing: "rgba(109, 40, 217, 0.35)",
  },
  text:
    mode === "dark"
      ? {
          primary: "#F3F4F6",
          secondary: "#A1A1AA",
          disabled: "#71717A",
        }
      : {
          primary: "#262626",
          secondary: "#666666",
          disabled: "#8C8C8C",
        },
  divider: mode === "dark" ? "#2B3443" : "#E0E0E0",
  action:
    mode === "dark"
      ? {
          hover: "rgba(255, 255, 255, 0.08)",
          selected: "rgba(255, 255, 255, 0.14)",
          active:
            mode === "dark"
              ? "rgba(255, 255, 255, 0.35)"
              : "rgba(38, 38, 38, 0.55)",
        }
      : {
          hover: alpha("#262626", 0.06),
          selected: alpha("#262626", 0.1),
          active: alpha("#262626", 0.26),
        },
  background:
    mode === "dark"
      ? {
          default: "#0F1724",
          paper: "#172131",
        }
      : {
          default: "#F2F4F7",
          paper: "#FFFFFF",
        },
});

// Core typography scale. Layout components should reference these variants
// instead of hardcoding font sizes in local sx blocks.
const getTypography = (): ThemeOptions["typography"] => ({
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  subtitle1: {
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.35,
  },
  subtitle2: {
    fontSize: "0.8125rem",
    fontWeight: 600,
    lineHeight: 1.35,
  },
  body2: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.55,
  },
  caption: {
    fontSize: "0.75rem",
    fontWeight: 400,
    lineHeight: 1.4,
  },
  button: {
    fontSize: "0.8125rem",
    fontWeight: 600,
    lineHeight: 1.3,
    textTransform: "none",
  },
  bodyAccent: {
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.55,
  },
  fieldLabel: {
    fontSize: "0.75rem",
    fontWeight: 400,
    lineHeight: 1.4,
  },
  metaTiny: {
    fontSize: "0.6875rem",
    fontWeight: 400,
    lineHeight: 1.2,
  },
  panelEyebrow: {
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  sectionHeader: {
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
});

// Component-level defaults and variants. This keeps visual language in one
// place and reduces style duplication in feature modules.
const getComponents = (): Components<Omit<Theme, "components">> => ({
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      "*::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      "*::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.divider,
        borderRadius: "4px",
      },
      "*::-webkit-scrollbar-thumb:hover": {
        backgroundColor: theme.palette.action.active,
      },
      "*::-webkit-scrollbar-corner": {
        background: "transparent",
      },
      "*": {
        scrollbarWidth: "thin",
        scrollbarColor: `${theme.palette.divider} transparent`,
      },
    }),
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        bodyAccent: "p",
        fieldLabel: "span",
        metaTiny: "span",
        panelEyebrow: "span",
        sectionHeader: "span",
      },
    },
    variants: [
      {
        props: { variant: "bodyAccent" },
        style: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { variant: "fieldLabel" },
        style: ({ theme }) => ({
          color: theme.palette.text.disabled,
          display: "block",
        }),
      },
      {
        props: { variant: "metaTiny" },
        style: ({ theme }) => ({
          color: theme.palette.text.disabled,
          display: "block",
        }),
      },
      {
        props: { variant: "panelEyebrow" },
        style: ({ theme }) => ({
          color: theme.palette.text.secondary,
          display: "block",
        }),
      },
      {
        props: { variant: "sectionHeader" },
        style: ({ theme }) => ({
          color: theme.palette.text.secondary,
          display: "block",
        }),
      },
    ],
  },
  MuiAlert: {
    defaultProps: {
      variant: "outlined",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: BORDER_RADIUS,
        color: theme.palette.text.primary,
      }),
      message: ({ theme }) => ({
        color: theme.palette.text.primary,
      }),
      action: ({ theme }) => ({
        display: "flex",
        alignItems: "center",
        margin: 0,
        paddingTop: 0,
        paddingBottom: 0,
        "& .MuiButton-root": {
          minWidth: "auto",
          padding: 0,
          color: theme.palette.primary.main,
          "&:hover": {
            color: "#80ABFC",
            backgroundColor: "transparent",
          },
          "&:active": {
            color: theme.palette.mode === "dark" ? "#80ABFC" : "#14569E",
            backgroundColor: "transparent",
          },
        },
      }),
      outlinedWarning: ({ theme }) => ({
        borderColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.warning.main, 0.38)
            : "#FED277",
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.warning.main, 0.14)
            : "#FFFAEB",
        color: theme.palette.text.primary,
        "& .MuiAlert-icon": {
          color: theme.palette.warning.main,
        },
      }),
      outlinedError: ({ theme }) => ({
        borderColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.error.main, 0.4)
            : "#FCCDD2",
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.error.main, 0.14)
            : "#FFF1F1",
        color: theme.palette.text.primary,
        "& .MuiAlert-icon": {
          color: theme.palette.error.main,
        },
      }),
      outlinedInfo: ({ theme }) => ({
        borderColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.info.main, 0.4)
            : "#C2D6FC",
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.info.main, 0.14)
            : "#F5F8FE",
        color: theme.palette.text.primary,
        "& .MuiAlert-icon": {
          color: theme.palette.info.main,
        },
      }),
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
  },
  MuiButton: {
    defaultProps: {
      size: "small",
      disableElevation: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: "none",
        borderRadius: theme.shape.borderRadius,
        fontWeight: 600,
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
        "&:active": {
          transform: "scale(0.97)",
          boxShadow: "none",
        },
        "&.Mui-focusVisible": {
          boxShadow: "none",
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
        "&.Mui-disabled": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.08)
              : "#D9D9D9",
          color:
            theme.palette.mode === "dark"
              ? theme.palette.text.disabled
              : "#9E9E9E",
          borderColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.08)
              : "#D9D9D9",
        },
      }),
      text: ({ theme }) => ({
        color: theme.palette.text.primary,
      }),
      textPrimary: ({ theme }) => ({
        color: theme.palette.text.primary,
      }),
      sizeSmall: {
        paddingLeft: 16,
        paddingRight: 16,
      },
      containedPrimary: ({ theme }) => ({
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        border: "1px solid transparent",
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.primary.main, 0.86)
              : theme.palette.common.white,
          color:
            theme.palette.mode === "dark"
              ? theme.palette.primary.contrastText
              : theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.main}`,
          boxShadow: "none",
        },
      }),
      containedError: ({ theme }) => ({
        backgroundColor: theme.palette.error.main,
        border: "1px solid transparent",
        "&:hover": {
          backgroundColor: theme.palette.error.dark || theme.palette.error.main,
        },
      }),
      outlinedPrimary: ({ theme }) => ({
        borderColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
      }),
      outlinedSecondary: ({ theme }) => ({
        borderColor: theme.palette.text.primary,
        color: theme.palette.text.primary,
        "&:hover": {
          borderColor: theme.palette.text.primary,
          backgroundColor: alpha(theme.palette.text.primary, 0.08),
        },
      }),
    },
  },
  MuiTextField: {
    defaultProps: {
      size: "small",
    },
  },
  MuiOutlinedInput: {
    defaultProps: {
      size: "small",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.divider,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.text.secondary,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      }),
      input: {
        paddingTop: 8,
        paddingBottom: 8,
      },
      inputSizeSmall: {
        paddingTop: 8,
        paddingBottom: 8,
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.fieldLabel,
        color: theme.palette.text.disabled,
        "&.Mui-focused": {
          color: theme.palette.primary.main,
        },
      }),
    },
  },
  MuiChip: {
    defaultProps: {
      size: "small",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.common.white, 0.1)
            : theme.palette.grey[200],
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.08) : "transparent"}`,
        "& .MuiChip-label": {
          color: "inherit",
          fontSize: theme.typography.caption.fontSize,
          fontWeight: 500,
        },
        "& .MuiChip-icon": {
          color: "inherit",
        },
      }),
    },
    variants: [
      {
        props: { color: "vip" },
        style: ({ theme }) => ({
          backgroundColor: theme.palette.vip.main,
          color: theme.palette.vip.contrastText,
          "& .MuiChip-icon": {
            color: theme.palette.vip.contrastText,
          },
          "&:hover": {
            backgroundColor: theme.palette.vip.dark,
          },
          "&.Mui-focusVisible": {
            boxShadow: `0 0 0 3px ${theme.palette.vip.focusRing}`,
          },
        }),
      },
      {
        props: { color: "work" },
        style: ({ theme }) => ({
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.08)
              : theme.palette.background.default,
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { color: "error" },
        style: ({ theme }) => ({
          backgroundColor: theme.palette.error.main,
          color: theme.palette.common.white,
          "& .MuiChip-icon": {
            color: theme.palette.common.white,
          },
        }),
      },
      {
        props: { color: "success" },
        style: ({ theme }) => ({
          backgroundColor: theme.palette.success.main,
          color: theme.palette.common.white,
          "& .MuiChip-icon": {
            color: theme.palette.common.white,
          },
        }),
      },
      {
        props: { color: "warning" },
        style: ({ theme }) => ({
          backgroundColor: theme.palette.warning.main,
          color: theme.palette.warning.contrastText,
          "& .MuiChip-icon": {
            color: theme.palette.warning.contrastText,
          },
        }),
      },
    ],
  },
  MuiIconButton: {
    defaultProps: {
      size: "small",
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.text.primary,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
        "&:active": {
          transform: "scale(0.97)",
          backgroundColor: theme.palette.action.selected,
        },
        "&.Mui-focusVisible": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }),
      sizeLarge: {
        width: 40,
        height: 40,
      },
    },
    variants: [
      {
        props: { color: "inherit", size: "small" },
        style: ({ theme }) => ({
          width: 26,
          height: 26,
          padding: 0,
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    ],
  },
  MuiSvgIcon: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: ({ theme }) => ({
        backgroundColor: theme.palette.primary.main,
      }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.button,
        minHeight: 40,
        textTransform: "none",
        color: theme.palette.text.secondary,
        "&:hover": {
          color: theme.palette.primary.main,
        },
        "&.Mui-selected": {
          color: theme.palette.text.primary,
        },
      }),
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
        "&:active": {
          backgroundColor: theme.palette.action.selected,
        },
        "&.Mui-selected": {
          backgroundColor: theme.palette.action.selected,
          "&:hover": {
            backgroundColor: theme.palette.action.selected,
          },
        },
        "&.quickReplyItem:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.primary.main, 0.12)
              : alpha(theme.palette.primary.main, 0.08),
        },
        "&.quickReplyItem.Mui-selected": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.primary.main, 0.2)
              : alpha(theme.palette.primary.main, 0.12),
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.primary.main, 0.2)
                : alpha(theme.palette.primary.main, 0.12),
          },
        },
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      grouped: ({ theme }) => ({
        margin: 0,
        borderRadius: theme.shape.borderRadius,
        "&:not(:first-of-type)": {
          borderLeft: "none",
          marginLeft: 0,
        },
      }),
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.button,
        borderRadius: theme.shape.borderRadius,
        border: "none",
        boxShadow: `inset 0 0 0 1px ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        minHeight: 36,
        padding: "6px 12px",
        lineHeight: 1.2,
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
        "& .MuiSvgIcon-root": {
          color: theme.palette.text.primary,
        },
        "&.Mui-selected": {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          boxShadow: `inset 0 0 0 1px ${theme.palette.primary.main}`,
          "&:hover": {
            backgroundColor: theme.palette.primary.main,
          },
          "& .MuiSvgIcon-root": {
            color: theme.palette.primary.contrastText,
          },
        },
      }),
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        "&.paperSubtle": {
          backgroundColor: theme.palette.background.default,
        },
        "&.paperPrimaryOutline": {
          borderColor: theme.palette.primary.main,
        },
        "&.chatBubble": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.04)
              : theme.palette.background.default,
        },
        "&.messageInternal": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.warning.main, 0.16)
              : theme.palette.warning.light,
        },
        "&.messageOutgoing": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.primary.main, 0.16)
              : theme.palette.common.white,
        },
        "&.messageIncoming": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.04)
              : theme.palette.background.default,
        },
      }),
      outlined: ({ theme }) => ({
        borderColor: theme.palette.divider,
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
      }),
    },
  },
});

export const theme = createTheme({
  colorSchemes: {
    light: { palette: getPalette("light") },
    dark: { palette: getPalette("dark") },
  },
  shape: {
    borderRadius: BORDER_RADIUS,
  },
  typography: getTypography(),
  components: getComponents(),
});

export const THEME_MODE_STORAGE_KEY = "ewsproto-theme-mode";
