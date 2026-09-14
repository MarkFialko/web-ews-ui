import type { PropsWithChildren, RefObject } from "react";
import { alpha, Box, useTheme } from "@mui/material";

import type { MessageDTO, ChatAttachmentDto } from "../types";
import { MessageBubble } from "./Message";

const SX = {
  flex: 1,
  overflowY: "auto",
  p: 2,
  m: 0,
};

export type Props = {
  messages: MessageDTO[];
  currentUsername: string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onAttachmentClick?: (attachment: ChatAttachmentDto) => void;
};

/** Парсинг локальной даты из ISO-строки */
const parseLocalDate = (isoDateTime: string): Date | null => {
  try {
    const [datePart] = isoDateTime.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

const isSameDay = (d1: Date, d2: Date): boolean =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const formatDateLabel = (date: Date, today: Date): string => {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) return "Сегодня";
  if (isSameDay(date, yesterday)) return "Вчера";

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

// --- Подкомпоненты ---

const DateSeparator = ({ date }: { date: Date }) => {
  const theme = useTheme();
  const today = new Date();
  const label = formatDateLabel(date, today);

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      my={2}
      sx={{
        color: alpha(theme.palette.text.secondary, 0.7),
        fontSize: "12px",
        fontWeight: 500,
        "&::before, &::after": {
          content: '""',
          flex: 1,
          height: "1px",
          backgroundColor: theme.palette.divider,
        },
      }}
    >
      <span>{label}</span>
    </Box>
  );
};

// --- Основной компонент ---

export const ChatMessages = ({
  messages,
  currentUsername,
  messagesEndRef,
  onAttachmentClick,
  children,
}: PropsWithChildren<Props>) => {
  let lastValidDate: Date | null = null;

  return (
    <Box sx={SX}>
      <Box>
        {messages.map((msg) => {
          const isCurrentEng =
            msg.userType === "ENG" && msg.username === currentUsername;
          const msgDate = parseLocalDate(msg.datetime);
          let showSeparator = false;

          if (msgDate) {
            if (lastValidDate === null) {
              showSeparator = true;
            } else if (!isSameDay(msgDate, lastValidDate)) {
              showSeparator = true;
            }
            lastValidDate = msgDate;
          }

          return (
            <Box key={msg.key}>
              {showSeparator && msgDate && <DateSeparator date={msgDate} />}
              <MessageBubble
                message={msg}
                isCurrentEng={isCurrentEng}
                onAttachmentClick={onAttachmentClick}
              />
            </Box>
          );
        })}

        {children}

        <div ref={messagesEndRef} />
      </Box>
    </Box>
  );
};
