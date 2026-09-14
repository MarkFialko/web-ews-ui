export const PROTOCOL_TYPE_CODES = {
  /** Сообщение пользователю */
  USER_MESSAGE: "USER_MESSAGE",
  MESSAGE_TO_INITIATOR: "MESSAGE_TO_INITIATOR",
  /** Сообщение инженеру */
  ENGINEER_MESSAGE: "ENGINEER_MESSAGE",
  MESSAGE_TO_PERFORMER: "MESSAGE_TO_PERFORMER",
} as const;

export type ProtocolType =
  (typeof PROTOCOL_TYPE_CODES)[keyof typeof PROTOCOL_TYPE_CODES];

/**
  createdBy: engeneerInfo?.empObjectId ?? '',
  replyTo: null,
  taskId: incident?.taskId ?? '',
  taskNumber: incident?.businessId ?? '',
  textMessage: message,
  typeCode:  toClient ? 'USER_MESSAGE' : 'ENGINEER_MESSAGE'
   */

export interface SendToProtocolDTO {
  /** businessId заявки */
  taskNumber: string;
  /** taskId заявки  */
  taskId: string;
  replyTo: null;
  /** Сообщение */
  textMessage: string;
  /** Тип сообщения */
  typeCode: ProtocolType;
  /** UUID отправителя */
  createdBy: string;
}
