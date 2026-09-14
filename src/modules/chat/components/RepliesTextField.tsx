import {
  useEffect,
  useState,
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
} from "react";
import { Stack, TextField } from "@mui/material";

import { QUICK_REPLIES } from "../constants";
import { QuickReplies } from "./QuickReplies";

interface Props {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  onSend: (event: SubmitEvent, text: string) => void;
}

export const RepliesTextField = (props: Props) => {
  const { input, setInput, onSend } = props;

  const [quickReplyIndex, setQuickReplyIndex] = useState(0);

  const showTemplates = input.startsWith("/");

  const filteredTemplates = showTemplates
    ? QUICK_REPLIES.filter((template) =>
        template.code.toLowerCase().startsWith(input.toLowerCase()),
      )
    : [];

  useEffect(() => {
    if (!showTemplates) return;
    setQuickReplyIndex(0);
  }, [showTemplates]);

  const acceptQuickReply = (index: number) => {
    const template = filteredTemplates[index];
    if (!template) return;
    setInput(template.text);
    setQuickReplyIndex(0);
  };

  const handleKeydown = (event: KeyboardEvent) => {
    const key = event.key;
    const isShiftPressed = event.shiftKey;

    if (showTemplates && filteredTemplates.length > 0) {
      if (key === "ArrowDown") {
        event.preventDefault();
        setQuickReplyIndex((prev) =>
          Math.min(prev + 1, filteredTemplates.length - 1),
        );
        return;
      }
      if (key === "ArrowUp") {
        event.preventDefault();
        setQuickReplyIndex((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (key === "Tab") {
        event.preventDefault();
        acceptQuickReply(quickReplyIndex);
        return;
      }
      if (key === "Enter" && !isShiftPressed) {
        event.preventDefault();

        const template = filteredTemplates[quickReplyIndex];

        if (template) {
          onSend(event as unknown as SubmitEvent, template.text);
          setInput("");
          return;
        }
        onSend(event as unknown as SubmitEvent, input);
        return;
      }
    }
    if (event.key === "Enter" && !isShiftPressed) {
      event.preventDefault();
      onSend(event as unknown as SubmitEvent, input);
    }
  };

  return (
    <Stack sx={{ position: "relative", width: "100%" }}>
      <QuickReplies
        replies={filteredTemplates}
        activeIndex={quickReplyIndex}
        onAcceptQuickReply={acceptQuickReply}
      />
      <TextField
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Написать ответ..."
        multiline
        maxRows={3}
        variant="outlined"
        fullWidth
        onKeyDown={handleKeydown}
      />
    </Stack>
  );
};
