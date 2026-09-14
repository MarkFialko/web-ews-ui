import { formatCompactDateTime } from "@shared/utils";
import { Paper, alpha, Stack, Chip, Typography } from "@mui/material";

import type { ProtocolEntry } from "./ProtocolList";

interface Props {
  entry: ProtocolEntry;
}

export const ProtocolMessage = (props: Props) => {
  const { entry } = props;

  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: 1.25,
        borderRadius: `${theme.shape.borderRadius}px`,
        backgroundColor:
          entry.target === "engineer"
            ? alpha(theme.palette.primary.main, 0.08)
            : alpha(theme.palette.success.main, 0.08),
      })}
    >
      <Stack spacing={0.6}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Chip
            size="small"
            color={entry.target === "engineer" ? "primary" : "success"}
            variant="outlined"
            label={entry.target === "engineer" ? "Инженеру" : "Пользователю"}
          />
          <Typography variant="caption" color="text.secondary">
            {formatCompactDateTime(entry.atRaw)}
          </Typography>
        </Stack>
        <Typography variant="body2">{entry.text}</Typography>
        <Typography variant="caption" color="text.secondary">
          Автор: {entry.author}
        </Typography>
      </Stack>
    </Paper>
  );
};
