import { useCallback } from "react";
import { useSnackbar } from "notistack";
import type { AppNotificationSeverity } from "./types";

export const useAppNotifications = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notify = useCallback(
    (message: string, severity: AppNotificationSeverity = "success") => {
      enqueueSnackbar(message, { variant: severity });
    },
    [enqueueSnackbar],
  );

  const notifySuccess = useCallback(
    (message: string) => notify(message, "success"),
    [notify],
  );
  const notifyError = useCallback(
    (message: string) => notify(message, "error"),
    [notify],
  );
  const notifyInfo = useCallback(
    (message: string) => notify(message, "info"),
    [notify],
  );
  const notifyWarning = useCallback(
    (message: string) => notify(message, "warning"),
    [notify],
  );

  return {
    notify,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };
};
