import type { PropsWithChildren, ReactNode } from "react";
import { useEffect, useRef, useCallback } from "react";
import {
  Backdrop,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { extractErrorMessage } from "@shared/api";
import { WORKLOG_ACTIONS, useWorklogLogger } from "@shared/worklog-logger";

import { UserRole } from "../types";
import { useUser } from "./useUser";

export function AuthGuard(props: PropsWithChildren) {
  const { children } = props;

  const log = useWorklogLogger();
  const startedRef = useRef(false);
  const { user, isLoading, error } = useUser();

  const logStart = useCallback(() => {
    if (!startedRef.current && user?.employeeNumber) {
      startedRef.current = true;
      log({
        action: WORKLOG_ACTIONS.APP_START,
        task: "Information",
        commentParams: { tn: user.employeeNumber },
      });
    }
  }, [user, log]);

  useEffect(() => {
    logStart();
  }, [logStart]);

  if (isLoading) return <AuthOverlay />;

  if (error) {
    const message =
      "data" in error &&
      (extractErrorMessage(error.data) ?? "Неизвестная ошибка");

    return (
      <AuthError>
        {"status" in error && (
          <ErrorMessage title="Код ответа:" content={error.status} />
        )}
        {message && <ErrorMessage title="Ошибка:" content={message} />}
      </AuthError>
    );
  }

  if (!user)
    return (
      <AuthError>
        <ErrorMessage
          title="Ошибка:"
          content="Не удалось получить пользователя"
        />
      </AuthError>
    );

  const VALID_USER_ROLES = [UserRole.EFS_SBERASSIST_ENGEENER];

  const isUserHasValidRoles = user?.roles?.some((r) =>
    VALID_USER_ROLES.includes(r),
  );

  if (!isUserHasValidRoles)
    return (
      <AuthError>
        <ErrorMessage
          title="Необходимые роли:"
          content={VALID_USER_ROLES.join(", ")}
        />
        <ErrorMessage
          title="Пользовательские роли:"
          content={user.roles.join(", ")}
        />
      </AuthError>
    );

  return children;
}

function AuthOverlay() {
  return (
    <Backdrop open>
      <Stack spacing={1.5} alignItems="center">
        <CircularProgress />
        <Typography>Загружаем пользователя...</Typography>
      </Stack>
    </Backdrop>
  );
}

function AuthError(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <Stack height="100vh" alignItems="center" justifyContent="center">
      <Paper variant="outlined" sx={{ p: 1.5, maxWidth: 700, width: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Ошибка авторизации
        </Typography>
        <Stack spacing={0.5}>{children}</Stack>
      </Paper>
    </Stack>
  );
}

function ErrorMessage(props: { title: string; content: number | string }) {
  const { title, content } = props;

  return (
    <Stack direction="row" spacing={0.5}>
      <Typography whiteSpace="nowrap" color="textSecondary">
        {title}
      </Typography>
      <Typography>{content}</Typography>
    </Stack>
  );
}
