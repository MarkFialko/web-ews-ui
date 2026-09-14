import { Tooltip, IconButton, alpha } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  label: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const CallActionIcon = (props: Props) => {
  const { label, icon, active = false, disabled = false, onClick } = props;
  return (
    <Tooltip title={label}>
      <span style={{ display: "block" }}>
        <IconButton
          color={active ? "primary" : "default"}
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          sx={(theme) => ({
            width: "100%",
            minWidth: 40,
            height: 40,
            border: 1,
            borderColor: active
              ? theme.palette.primary.main
              : theme.palette.divider,
            bgcolor: active
              ? alpha(theme.palette.primary.main, 0.08)
              : "background.paper",
            "&.Mui-disabled": {
              bgcolor: theme.palette.action.disabledBackground,
              borderColor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
          })}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};
