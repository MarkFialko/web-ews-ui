import { Box, Tooltip, useTheme, Typography } from "@mui/material";
import SmartToyOutlined from "@mui/icons-material/SmartToyOutlined";
import PersonOutline from "@mui/icons-material/PersonOutline";
import EngineeringOutlined from "@mui/icons-material/EngineeringOutlined";
import ImageNotSupported from "@mui/icons-material/ImageNotSupported";
import dayjs from "dayjs";

import type { MessageDTO, ChatAttachmentDto } from "../types";
import { classifyAttachmentStatus } from "../utils";
import { AttachmentThumbnail } from "./AttachmentThumbnail";

// Палитра акцентов по ролям (Light / Dark)
const ACCENT_COLORS: Record<
  MessageDTO["userType"],
  { light: string; dark: string }
> = {
  BOT: { light: "#000080", dark: "#64B5F6" },
  USER: { light: "#00796B", dark: "#4DB6AC" },
  ENG: { light: "#303F9F", dark: "#7986CB" },
};

const SELF_COLOR = { light: "#BDBDBD", dark: "#757575" };

const BG_INCOMING = { light: "#FAFAFA", dark: "#424242" };
const BG_OUTGOING = { light: "#F5F5F5", dark: "#212121" };

const getAccentColor = (
  userType: MessageDTO["userType"],
  isCurrentEng: boolean,
  isDark: boolean,
): string => {
  if (isCurrentEng) {
    return isDark ? SELF_COLOR.dark : SELF_COLOR.light;
  }
  const c = ACCENT_COLORS[userType];
  return isDark ? c.dark : c.light;
};

const getBgColor = (isCurrentEng: boolean, isDark: boolean): string =>
  isCurrentEng
    ? isDark
      ? BG_OUTGOING.dark
      : BG_OUTGOING.light
    : isDark
      ? BG_INCOMING.dark
      : BG_INCOMING.light;

/** Иконка для роли */
const RoleIcon = ({ userType }: { userType: MessageDTO["userType"] }) => {
  const sx = { fontSize: 14 };
  switch (userType) {
    case "BOT":
      return <SmartToyOutlined sx={sx} />;
    case "USER":
      return <PersonOutline sx={sx} />;
    case "ENG":
    default:
      return <EngineeringOutlined sx={sx} />;
  }
};

/** Форматирование HH:MM из datetime с преобразованием Moscow → локальная tz */
const formatTime = (datetime: string): string => {
  try {
    return dayjs
      .tz(datetime, "Europe/Moscow")
      .tz(dayjs.tz.guess())
      .format("HH:mm");
  } catch {
    return "";
  }
};

// --- MessageBubble ---

export type MessageBubbleProps = {
  message: MessageDTO;
  isCurrentEng: boolean;
  /** Обработчик клика по кликабельному вложению (только для поддерживаемого формата). */
  onAttachmentClick?: (attachment: ChatAttachmentDto) => void;
};

export const MessageBubble = ({
  message,
  isCurrentEng,
  onAttachmentClick,
}: MessageBubbleProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = getAccentColor(message.userType, isCurrentEng, isDark);
  const bgColor = getBgColor(isCurrentEng, isDark);
  const time = formatTime(message.datetime);

  const attachmentStatus = classifyAttachmentStatus(message.mimeType);
  const isSupported = attachmentStatus === "image-supported";
  const isUnsupported = attachmentStatus === "image-unsupported";
  const attachment: ChatAttachmentDto = {
    guid: message.message,
    mimeType: message.mimeType ?? "",
  };

  return (
    <Box
      display="flex"
      justifyContent={isCurrentEng ? "flex-end" : "flex-start"}
      mb={2}
      data-testid={isCurrentEng ? "message-current-eng" : "message-incoming"}
    >
      <Box maxWidth="70%" display="flex" flexDirection="column" gap={0.5}>
        {/* Тело сообщения */}
        <Box
          sx={{
            border: `1px solid ${accentColor}`,
            backgroundColor: bgColor,
            borderRadius: 1,
            padding: "8px 12px",
            paddingTop: isCurrentEng ? "6px" : "8px",
          }}
        >
          {/* Подпись — только для входящих, внутри бокса с сообщением */}
          {!isCurrentEng && (
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Box
                component="span"
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: `1.5px solid ${accentColor}`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <RoleIcon userType={message.userType} />
              </Box>
              <Typography
                component="span"
                sx={{
                  color: accentColor,
                  fontWeight: 500,
                  fontSize: "13px",
                }}
              >
                {message.username}
              </Typography>
            </Box>
          )}

          {isSupported ? (
            <AttachmentThumbnail
              key={attachment.guid}
              {...attachment}
              onClick={() => onAttachmentClick?.(attachment)}
            />
          ) : isUnsupported ? (
            <Tooltip title="Неподдерживаемый формат" arrow>
              <Box
                component="span"
                sx={{ display: "inline-flex" }}
                data-testid="attachment-icon-unsupported"
              >
                <ImageNotSupported sx={{ fontSize: 34, mt: 0.5 }} />
              </Box>
            </Tooltip>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.primary,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {message.message}
            </Typography>
          )}
          {time && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                textAlign: "right",
                display: "block",
                mt: 0.5,
              }}
            >
              {time}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
