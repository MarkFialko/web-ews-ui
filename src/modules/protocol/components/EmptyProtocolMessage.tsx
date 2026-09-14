import { Alert } from "@mui/material";

export const EmptyProtocolMessage = () => {
  return (
    <Alert severity="info" variant="outlined">
      Доступна только запись.
    </Alert>
  );
};
