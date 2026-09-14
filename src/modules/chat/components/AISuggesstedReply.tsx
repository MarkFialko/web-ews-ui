import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import type { RequestDTO } from "@shared/request";

type AiSuggestedReplyState = "available" | "manual-draft";

interface Props {
  input: string;
  request: RequestDTO;
  onSend: (value: string) => void;
  onEdit: (value: string) => void;
}

export const AISuggestedReply = (props: Props) => {
  const { request, input, onSend, onEdit } = props;

  const propertyMessage = request.properties.find(
    (p) =>
      p.code === "solutionfaq" ||
      p.name.toLocaleLowerCase() === "текст из решения",
  )?.value;

  if (!propertyMessage) return null;

  const state: AiSuggestedReplyState = input ? "manual-draft" : "available";

  const isManualDraft = state === "manual-draft";

  return (
    <Box data-message-side="suggestion" sx={{ width: "100%" }}>
      <Paper
        variant="outlined"
        sx={(theme) => ({
          px: 2,
          py: 1.5,
          borderColor: theme.palette.divider,
          borderLeft: `3px solid ${
            isManualDraft
              ? theme.palette.text.disabled
              : theme.palette.primary.main
          }`,
          backgroundColor: theme.palette.background.paper,
          opacity: isManualDraft ? 0.68 : 1,
        })}
      >
        <Stack spacing={1.25}>
          <Stack
            direction="row"
            alignItems="baseline"
            justifyContent="space-between"
            gap={1}
          >
            <Typography variant="subtitle2">Ответ AI</Typography>
            {isManualDraft && (
              <Typography variant="caption" color="text.secondary">
                Вы начали свой ответ
              </Typography>
            )}
          </Stack>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {propertyMessage}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              disabled={isManualDraft}
              onClick={() => onSend(propertyMessage)}
            >
              Отправить
            </Button>
            <Button
              size="small"
              variant="text"
              disabled={isManualDraft}
              onClick={() => onEdit(propertyMessage)}
            >
              Изменить
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};
