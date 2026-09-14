import { PauseOutlined } from "@mui/icons-material";
import { IconButton, alpha, type IconButtonProps } from "@mui/material";

interface Props extends IconButtonProps {
  disabled?: boolean;
}

export const PauseIcon = (props: Props) => {
  return (
    <IconButton
      {...props}
      color="warning"
      sx={(theme) => ({
        width: 34,
        height: 34,
        border: 1,
        borderColor: "transparent",
        bgcolor: props.disabled
          ? "background.paper"
          : alpha(theme.palette.warning.main, 0.4),
      })}
    >
      <PauseOutlined />
    </IconButton>
  );
};
