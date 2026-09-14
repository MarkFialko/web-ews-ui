import type { MessageDTO } from "./MessageDto";

export interface ChatHistoryDTO {
  content: MessageDTO[];
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: 0;
  };
}
