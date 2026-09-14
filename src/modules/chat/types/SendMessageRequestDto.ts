export interface SendMessageRequestDTO {
  /** Идентификатор запроса */
  businessId: string;
  /** Табельный номер адресата */
  userId: string;
  /** Имя отправителя */
  engineerName: string;
  /** Табельный номер отправителя */
  engineerId: string;
  /** Сообщение пользователю */
  message: string;
}
