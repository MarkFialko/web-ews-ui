import type { MessageDTO } from "./MessageDto";

export interface SendMessageResponseDTO {
  content: [MessageDTO];
  page: 1;
  status: "SUCCESS" | "ERROR";
  statusGroup: string;
}
