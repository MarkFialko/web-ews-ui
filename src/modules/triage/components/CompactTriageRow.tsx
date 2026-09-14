import { memo, type CSSProperties } from "react";
import { alpha, Box, Paper, Stack, Tooltip, Typography } from "@mui/material";
import MarkChatUnreadOutlinedIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";

import { formatDateTime } from "@shared/utils";
import type { RequestDTO } from "@shared/request";

import { LabelChip } from "./LabelChip";
import { CHAT_TOOLTIP, chatIconSx, chatIconSvgSx } from "../constants";

const PAPER_BASE: CSSProperties = {
  position: "relative",
  p: 1,
  pl: "12px",
  cursor: "pointer",
  boxShadow: "none",
  boxSizing: "border-box",
};

type PaperSxParams = {
  isActive: boolean;
  isInHistory: boolean;
  slaColor: "error" | "warning" | "success";
};

const getPAPER_SX =
  (p: PaperSxParams): SxProps<Theme> =>
  (theme) => ({
    ...PAPER_BASE,
    borderColor: p.isActive
      ? theme.palette.primary.main
      : theme.palette.divider,
    backgroundColor: p.isActive
      ? alpha(theme.palette.primary.main, 0.08)
      : p.isInHistory
        ? alpha(theme.palette.grey[500], 0.36)
        : theme.palette.background.paper,
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: 4,
      borderRadius: "2px 0 0 2px",
      backgroundColor: theme.palette[p.slaColor].main,
    },
  });

const TITLE_STACK_SX: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2.8px",
};

const LABELS_BOX_SX: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "4px",
  alignItems: "center",
  minHeight: "20px",
};

type Props = {
  businessId: string;
  request: RequestDTO;
  isActive: boolean;
  viewedRequestSet: Set<string>;
  onSelectRequest: (request: RequestDTO) => void;
  isInHistory: boolean;
  slaColor: "error" | "warning" | "success";
  compactSlaLabel: string;
  onChat?: (businessId: string) => void;
  activeChatIds?: ReadonlySet<string>;
};

function CompactTriageRowInner({
  businessId,
  request,
  isActive,
  onSelectRequest,
  isInHistory,
  slaColor,
  compactSlaLabel,
  onChat,
  activeChatIds,
}: Props) {
  const handleChatIconClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onChat?.(businessId);
  };

  return (
    <Paper
      variant="outlined"
      sx={getPAPER_SX({ isActive, isInHistory, slaColor })}
      onClick={() => onSelectRequest(request)}
    >
      <Box sx={TITLE_STACK_SX}>
        <Stack direction="row" spacing={0.6} alignItems="center">
          <Typography
            variant="body2"
            noWrap
            sx={{ fontWeight: 700, lineHeight: 1.2 }}
          >
            {businessId}
          </Typography>
          <Tooltip
            title={"Контрольный срок: " + formatDateTime(request.targetDate)}
            placement="top"
          >
            <Typography variant="caption" color="text.secondary" noWrap>
              SLA {compactSlaLabel}
            </Typography>
          </Tooltip>
        </Stack>

        <Tooltip title={request.title} placement="top">
          <Typography variant="body2" noWrap color="text.primary">
            {request.title.length > 50
              ? request.title.slice(0, 50) + "..."
              : request.title}
          </Typography>
        </Tooltip>

        <Box sx={LABELS_BOX_SX}>
          {request.labels &&
            request.labels.map((label) => (
              <LabelChip key={label.name} label={label} />
            ))}
          {onChat && activeChatIds?.has(businessId) && (
            <Tooltip title={CHAT_TOOLTIP} placement="top">
              <Box sx={chatIconSx(true)} onClick={handleChatIconClick}>
                <MarkChatUnreadOutlinedIcon sx={chatIconSvgSx} />
              </Box>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export const CompactTriageRow = memo(CompactTriageRowInner);
