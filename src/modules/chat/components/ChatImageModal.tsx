import { useEffect } from "react";
import { Box, Dialog, Typography } from "@mui/material";

import { useChatImage } from "../hooks";
import { ChatSpinner } from "./ChatSpinner";

export type ChatImageModalProps = {
  open: boolean;
  attachment: { guid: string; mimeType: string };
  onClose: () => void;
};

/** Модальное окно с увеличенным изображением вложения чата. */
export const ChatImageModal = ({
  open,
  attachment,
  onClose,
}: ChatImageModalProps) => {
  const { dataUrl, isLoading, isError, error, load } = useChatImage(
    attachment.guid,
    attachment.mimeType,
  );

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      slotProps={{ paper: { sx: { overflow: "hidden" } } }}
    >
      <Box p={2} minWidth={320} minHeight={200} position="relative">
        {isLoading && <ChatSpinner />}

        {isError && (
          <Typography color="error" variant="body2" px={2} py={4}>
            {error ?? "Не удалось загрузить изображение"}
          </Typography>
        )}

        {!isLoading && !isError && dataUrl && (
          <Box
            component="img"
            src={dataUrl}
            alt="Вложение"
            sx={{
              display: "block",
              mx: "auto",
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: 1,
            }}
          />
        )}
      </Box>
    </Dialog>
  );
};
