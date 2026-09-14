import { Stack, CircularProgress, Typography } from "@mui/material";

export const ChatSpinner = () => {
  return (
    <Stack spacing={1} py={2} alignItems="center">
      <CircularProgress />
      <Typography>Загружаем сообщения...</Typography>
    </Stack>
  );
};
