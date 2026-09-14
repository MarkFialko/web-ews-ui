import type { WorklogSource } from "@shared/worklog";

/**
 * Событие в буфере IndexedDB до отправки на бэкенд.
 *
 * Контракт требует все восемь полей в каждом отправляемом объекте: опциональных
 * полей нет. Если значения не предусмотрено, оно заменяется пустой строкой на
 * этапе создания события в хуке, а не отсутствующим полем.
 */
export interface BufferedWorklogEvent {
  key: string;
  action: string;
  task: string;
  engineer: string;
  engineerName: string;
  department: string;
  source: WorklogSource;
  comment: string;
  createdAt: string;
}

/** DTO пачки событий для отправки на бэкенд */
export type WorklogEventDto = Omit<BufferedWorklogEvent, "key">;
