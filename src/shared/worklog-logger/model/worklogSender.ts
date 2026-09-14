import type { WorklogEventDto } from "../types/BufferedWorklogEvent";
import type { WorklogSendOutcome } from "../utils/classifyWorklogError";

export type WorklogSender = (
  events: WorklogEventDto[],
  options?: { keepalive?: boolean },
) => Promise<WorklogSendOutcome>;

let sender: WorklogSender | null = null;

/**
 * Отправщик внедряется через сеттер: буфер — модульный синглтон,
 * хуки в нём вызывать нельзя, прямой импорт store даёт циклические импорты.
 */
export const setWorklogSender = (next: WorklogSender | null): void => {
  sender = next;
};

export const getWorklogSender = (): WorklogSender | null => sender;
