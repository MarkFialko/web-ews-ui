import { useEffect, useRef, useState } from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import { Send } from "lucide-react";
import dayjs from "dayjs";

import { extractErrorMessage } from "@shared/api";
import { useChatHistory, useChat } from "./hooks";
import {
  AISuggestedReply,
  ChatError,
  ChatImageModal,
  ChatMessages,
  ChatSpinner,
  RepliesTextField,
} from "./components";
import type {
  ChatAttachmentDto,
  MessageDTO,
  SendMessageRequestDTO,
  SendMessageResponseDTO,
} from "./types";
import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";
import { useUser } from "@shared/user";

import type { RequestDTO } from "@shared/request";
import { useChatNotificationContext } from "@modules/triage/hooks";
import { useConfirmNotificationReadMutation } from "@modules/triage/api/notification";

const MAX_MESSAGE_LENGTH = 4096;

export type ChatPanelProps = {
  request: RequestDTO;
};

export const ChatPanel = (props: ChatPanelProps) => {
  const { request } = props;

  const { user } = useUser();

  const log = useWorklogLogger();

  const {
    messages: pollingMessages,
    isLoading,
    error,
    refetch,
  } = useChatHistory(request.businessId);

  const chatContext = useChatNotificationContext();
  const [confirmRead] = useConfirmNotificationReadMutation();

  useEffect(() => {
    if (!chatContext) return;

    const { businessId } = request;
    const messageId = chatContext.resolveMessageId(businessId);
    if (messageId == null) return;

    const timer = setTimeout(() => {
      confirmRead({ messageId })
        .then(() => {
          chatContext.clearBump([businessId]);
          chatContext.removeBusinessId(businessId);
          chatContext.dismissMessage(messageId);
          chatContext.onDismiss(businessId, messageId);
        })
        .catch(() => {
          /* уже подтверждено или истекло */
        });
    }, 2000);

    return () => clearTimeout(timer);
  }, [chatContext, confirmRead, request]);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [activeAttachment, setActiveAttachment] =
    useState<ChatAttachmentDto | null>(null);

  const initiatorId = request?.initiator?.personalNumber ?? "";

  const errorWithInput = input.trim().length > MAX_MESSAGE_LENGTH;

  useEffect(() => {
    Array.isArray(pollingMessages) && setMessages(pollingMessages);
  }, [pollingMessages.length]);

  const { sendMessage } = useChat();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const showAISuggest =
    !isLoading &&
    !error &&
    !messages.some(
      (msg) => (msg.userType === "ENG" && msg.username === user?.fio) ?? "",
    );

  const handleSend = (event: SubmitEvent, text?: string) => {
    event.preventDefault();

    if (errorWithInput) return;

    if (!text?.trim() && !input.trim()) return;

    const key = Math.random();

    const messageDTO: MessageDTO = {
      key: key,
      numberId: request.businessId,
      datetime: dayjs
        .tz(dayjs(), "Europe/Moscow")
        .format("YYYY-MM-DDTHH:mm:ss.SSS"),
      userId: initiatorId,
      userType: "ENG",
      username: user?.fio ?? "",
      message: text || input,
      status: "PENDING",
    };

    setMessages((messages) => [messageDTO, ...messages]);

    const sendMessageDTO: SendMessageRequestDTO = {
      businessId: request.businessId,
      userId: messageDTO.userId,
      engineerName: user!.fio,
      engineerId: user!.employeeNumber,
      message: messageDTO.message,
    };

    const updateMessage = (
      status: "ERROR" | "INFO" | "PENDING",
      error?: string,
    ) => {
      setMessages((prev) => {
        const indexOfMessage = prev.findIndex((m) => m.key === key);
        if (indexOfMessage === -1) return prev;
        prev.splice(indexOfMessage, 1, {
          ...messageDTO,
          status: status,
          error: error,
        });

        return prev;
      });
    };

    sendMessage(sendMessageDTO)
      .then((data: SendMessageResponseDTO) => {
        if (data.status === "SUCCESS") {
          updateMessage("INFO");
        } else {
          updateMessage("ERROR", data.statusGroup);
        }
        log({
          action: WORKLOG_ACTIONS.WRITE_CHAT,
          task: request.businessId,
        });
      })
      .catch((e) => updateMessage("ERROR", extractErrorMessage(e.data)));

    setInput("");
  };

  return (
    <Stack height="100%" overflow="hidden">
      {isLoading && <ChatSpinner />}

      {error && <ChatError error={error} onRefetch={refetch} />}

      <ChatMessages
        messages={[...messages].reverse()}
        currentUsername={user?.fio ?? ""}
        messagesEndRef={messagesEndRef}
        onAttachmentClick={setActiveAttachment}
      >
        {showAISuggest && (
          <AISuggestedReply
            request={request}
            input={input}
            onSend={(text) =>
              handleSend(new Event("submit") as unknown as SubmitEvent, text)
            }
            onEdit={(text) => setInput(text)}
          />
        )}
      </ChatMessages>

      <Stack spacing={0.5}>
        <Stack
          component="form"
          onSubmit={handleSend}
          sx={{ alignItems: "center" }}
          direction="row"
        >
          <RepliesTextField
            input={input}
            setInput={setInput}
            onSend={handleSend}
          />
          <IconButton
            type="submit"
            disabled={!input.trim() || errorWithInput}
            color="primary"
            sx={{ p: 1.5 }}
          >
            <Send size={18} />
          </IconButton>
        </Stack>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
        >
          Нажмите Enter для отправки
        </Typography>
      </Stack>

      {activeAttachment && (
        <ChatImageModal
          open={Boolean(activeAttachment)}
          attachment={activeAttachment}
          onClose={() => setActiveAttachment(null)}
        />
      )}
    </Stack>
  );
};
