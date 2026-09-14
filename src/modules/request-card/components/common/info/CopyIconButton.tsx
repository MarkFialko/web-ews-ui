import { IconButton } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

export type CopyIconButtonProps = {
  onClick: () => void;
  size?: "small" | "medium";
};

export function CopyIconButton({
  onClick,
  size = "small",
  iconColor,
}: CopyIconButtonProps) {
  return (
    <IconButton
      size={size}
      color="inherit"
      onClick={onClick}
      sx={{ border: "none", p: 0.35 }}
    >
      <ContentCopyRoundedIcon
        sx={{ fontSize: 14, ...(iconColor && { color: iconColor }) }}
      />
    </IconButton>
  );
}
