export interface MessageDTO {
  key: number;
  datetime: string;
  numberId: string;
  /** ФИО Инженера или пользователя */
  username: string;
  userId: string;
  userType: "USER" | "ENG" | "BOT";
  /** Сообщение от инженера или пользователя (для вложения-изображения содержит GUID документа) */
  message: string;
  mimeType?: string;
  status?: "PENDING" | "ERROR" | "INFO";
  error?: string;
}
