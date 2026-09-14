import { Stack, Alert, Button, AlertTitle } from "@mui/material";

import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { extractErrorMessage } from "@shared/api";

interface Props {
  error: FetchBaseQueryError | SerializedError;
  onRefetch: () => void;
}

export const ChatError = (props: Props) => {
  const { error, onRefetch } = props;

  return (
    <Stack p={2}>
      <Alert
        severity="warning"
        variant="outlined"
        action={
          <Button color="inherit" size="small" onClick={onRefetch}>
            Перезагрузить
          </Button>
        }
      >
        <AlertTitle>Ошибка при получении истории сообщений</AlertTitle>
        {extractErrorMessage(error?.data)}
      </Alert>
    </Stack>
  );
};
