import { createContext, useContext } from "react";

/** Значение контекста уведомлений чата — бамп/дисмисс/скролл. */
export interface ChatNotificationContextValue {
  /** Все businessId, для которых сейчас есть непрочитанные уведомления. */
  activeBusinessIds: ReadonlySet<string>;
  /** Разрешить messageId по businessId (используется ChatPanel для confirm). */
  resolveMessageId: (businessId: string) => number | undefined;
  /** Убрать businessId из карты (после confirm). */
  removeBusinessId: (businessId: string) => void;
  /** Убрать businessId из bump store (ChatPanel после confirm). */
  clearBump: (ids?: string[]) => void;
  /** Подтвердить прочтение — мгновенный дисмисс, иконка и бамп исчезают сразу. */
  dismissMessage: (messageId: number) => void;
  /** Вызывается после дисмисса — триггерит скролл ко всем зарегистрированным спискам. */
  onDismiss: (businessId: string, messageId: number) => void;
  /**
   * Зарегистрировать колбэк скролла для triage-листа.
   * Возвращает функцию для снятия регистрации.
   */
  registerScrollHandler: (
    key: string,
    handler: (businessId: string, messageId: number) => void,
  ) => () => void;
}

export const ChatNotificationContext =
  createContext<ChatNotificationContextValue | null>(null);

/**
 * Хук для доступа к контексту уведомлений чата.
 * Используется в RequestRow/CompactTriageRow для рендера иконки
 * и в ChatPanel для confirm-флоу.
 *
 * Не вызывать вне TriageModule — вернёт null.
 */
export function useChatNotificationContext(): ChatNotificationContextValue | null {
  return useContext(ChatNotificationContext);
}
