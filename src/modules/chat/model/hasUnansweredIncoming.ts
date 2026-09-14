/**
 * Проверяет, есть ли в истории чата входящее сообщение от USER,
 * на которое инженер ещё не ответил.
 *
 * Логика:
 * - Ищем последнее сообщение с userType === 'USER'
 * - После него нет ни одного с userType === 'ENG'
 * - Если есть — возвращаем true (есть непрочитанное входящее)
 *
 * @param messages — массив сообщений чата (MessageDTO[])
 * @returns boolean — есть непрочитанное входящее
 *
 * Примечание:
 * - Работает только для полной истории чата. Для кнопки на строке списка
 *   требуется батч-метод /chat/history?numberId=a,b,c (см. B2).
 * - Иконка кнопки: MarkChatUnreadOutlinedIcon
 */
export const hasUnansweredIncoming = (
  messages: Array<{ userType: "USER" | "ENG" }>,
): boolean => {
  if (!messages || messages.length === 0) return false;

  let lastUserIndex = -1;

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.userType === "USER") {
      lastUserIndex = i;
      break;
    }
  }

  if (lastUserIndex === -1) return false;

  /* После последнего USER — ищем, есть ли ENGINEER после */
  for (let i = lastUserIndex + 1; i < messages.length; i++) {
    if (messages[i].userType === "ENG") return false;
  }

  return true;
};
