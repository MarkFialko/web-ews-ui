import { Box, Typography, Paper, Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import {
  getCommunicationChannelMeta,
  formatCommunicationTimestamp,
  getCommunicationState,
} from "../../utils";
import { COMMUNICATION_STATE, TOOL_IDS } from "../../constants";
import type { RequestCommunicationMessage } from "../../types";
import type { communication } from "@shared/routing";

export type CommunicationHubProps = {
  state: ReturnType<typeof getCommunicationState>;
  onOpenTool?: (toolId: communication, articleId?: string) => void;
};

export function CommunicationHub({ state, onOpenTool }: CommunicationHubProps) {
  if (state.state === COMMUNICATION_STATE.INITIAL) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="fieldLabel" sx={{ mr: 0.5 }}>
          Уточнить информацию:
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ChatOutlinedIcon />}
          onClick={() => onOpenTool?.(TOOL_IDS.CHAT)}
        >
          Чат
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DescriptionOutlinedIcon />}
          onClick={() => onOpenTool?.(TOOL_IDS.PROTOCOL)}
        >
          Протокол
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<PhoneOutlinedIcon />}
          onClick={() => onOpenTool?.(TOOL_IDS.CALL)}
        >
          Звонок
        </Button>
      </Box>
    );
  }

  if (state.state === COMMUNICATION_STATE.WAITING) {
    const channelMeta = getCommunicationChannelMeta(state.channel);

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.5 }}>
        <channelMeta.Icon
          sx={{ color: "text.secondary", fontSize: 18, flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2">
            Запрошена информация {channelMeta.viaLabel}{" "}
            <Typography
              component="span"
              variant="fieldLabel"
              sx={{ display: "inline" }}
            >
              · {formatCommunicationTimestamp(state.timestamp)}
            </Typography>
          </Typography>
          <Typography variant="fieldLabel">
            Ожидание ответа пользователя
          </Typography>
        </Box>
        <Button
          size="small"
          variant="text"
          endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
          onClick={() => onOpenTool?.(state.channel)}
        >
          {channelMeta.openLabel}
        </Button>
      </Box>
    );
  }

  const channelMeta = getCommunicationChannelMeta(state.channel);
  const message = state.message as RequestCommunicationMessage;

  return (
    <Box sx={{ p: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
        <channelMeta.Icon
          sx={{ color: "success.main", fontSize: 18, flexShrink: 0 }}
        />
        <Typography variant="bodyAccent">Ответ от пользователя</Typography>
        <Typography variant="fieldLabel">
          · {formatCommunicationTimestamp(message.timestamp)}
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: 1.5,
          mb: 1,
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.success.main, 0.08)
              : theme.palette.grey[50],
          borderColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.success.main, 0.24)
              : theme.palette.divider,
        })}
      >
        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
          {message.text}
        </Typography>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
          onClick={() => onOpenTool?.(state.channel)}
        >
          Ответить
        </Button>
      </Box>
    </Box>
  );
}
