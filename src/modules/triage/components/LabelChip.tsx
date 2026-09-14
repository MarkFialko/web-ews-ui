import { memo } from "react";
import { Chip, Tooltip, Box } from "@mui/material";
import WorkOutlineSharpIcon from "@mui/icons-material/WorkOutlineSharp";
import WorkSharpIcon from "@mui/icons-material/WorkSharp";
import MarkChatUnreadOutlinedIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import type { LabelDto } from "../../../shared/label";
import {
  OD_OPEN,
  OD_CLOSE,
  CHAT_TOOLTIP,
  chatIconSx,
  chatIconSvgSx,
} from "../constants";

type Props = {
  label: LabelDto;
  onClick?: (labelName: string) => void;
};

export const LabelChip = memo(({ label, onClick }: Props) => {
  const isOdIcon = label.name === OD_OPEN || label.name === OD_CLOSE;
  const isChatIcon = label.icon === "chat";

  if (isOdIcon) {
    const Icon = label.name === OD_OPEN ? WorkOutlineSharpIcon : WorkSharpIcon;

    return (
      <Tooltip title={label.tooltip} placement="top">
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 16, color: label.color || "text.secondary" }} />
        </Box>
      </Tooltip>
    );
  }

  if (isChatIcon) {
    return (
      <Tooltip title={label.tooltip || CHAT_TOOLTIP} placement="top">
        <Box sx={chatIconSx(!!onClick)}>
          <MarkChatUnreadOutlinedIcon sx={chatIconSvgSx} />
        </Box>
      </Tooltip>
    );
  }

  const bgColor = label.color || "#1976d2";

  return (
    <Tooltip title={label.tooltip} placement="top">
      <Chip
        label={label.name}
        size="small"
        sx={{
          backgroundColor: bgColor,
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.7rem",
          height: 20,
          borderRadius: "4px",
          cursor: "default",
          "& .MuiChip-label": { px: 0.8 },
        }}
      />
    </Tooltip>
  );
});
