import type { ReactNode } from "react";

import { alpha, IconButton, Tooltip } from "@mui/material";

interface Props {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}

export const PinnedToolButton = (props: Props) => {
  const { label, icon, active, onClick } = props;
  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        color={active ? "primary" : "default"}
        onClick={onClick}
        sx={(theme) => ({
          width: 40,
          height: 40,
          border: 1,
          borderColor: active
            ? theme.palette.primary.main
            : theme.palette.divider,
          borderRadius: 1.5,
          bgcolor: active
            ? alpha(theme.palette.primary.main, 0.08)
            : "background.paper",
        })}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};
