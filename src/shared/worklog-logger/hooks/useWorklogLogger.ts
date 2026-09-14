import { useCallback } from "react";
import { useFeatureFlag } from "@shared/hooks/useFeatureFlag";
import { enqueue } from "../model/buffer";
import { resolveWorklogSource } from "../utils/resolveWorklogSource";
import { buildComment } from "../constants/commentTemplates";

import { useUser } from "@shared/user";

/**
 * Логгер бизнес-действий инженера. Все данные пользователя (табельный номер,
 * ФИО, подразделение) собираются здесь в одном месте: вызывающий код передаёт
 * только код действия, номер заявки и при необходимости параметры комментария.
 *
 * Событие не пишется в буфер, пока не получены данные пользователя: без них
 * не заполнить обязательные engineer / engineerName / department.
 */
export function useWorklogLogger() {
  const { user } = useUser();

  const userReady = Boolean(user?.smId);
  const loggingEnabled = useFeatureFlag("worklogLogging");

  return useCallback(
    (event: {
      action: string;
      task: string;
      commentParams?: Record<string, unknown>;
    }): void => {
      if (!userReady) return;
      if (!loggingEnabled) return;

      enqueue({
        action: event.action,
        task: event.task,
        engineer: user?.smId ?? "",
        engineerName: user?.fio ?? "",
        department: user?.department ?? "",
        comment: buildComment(event.action, event.commentParams),
        createdAt: new Date().toISOString(),
        source: resolveWorklogSource(event.action),
      }).catch(() => {});
    },
    [user?.smId, user?.fio, user?.department, userReady, loggingEnabled],
  );
}
