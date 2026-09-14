import type { IncType } from "./types";

export const STATE_CODES = {
  REGISTERED: "REGISTERED",
  INWORKGROUP_ASSIGNED: "INWORKGROUP_ASSIGNED",
  INWORKGROUP_RETURNED: "INWORKGROUP_RETURNED",
  INWORKGROUP_APPROVED: "INWORKGROUP_APPROVED",
  INWORKGROUP_NOT_APPROVED: "INWORKGROUP_NOT_APPROVED",
  APPROVE_WAITING: "APPROVE_WAITING",
  APPROVE_REQUEST_INFO: "APPROVE_REQUEST_INFO",
  APPROVE_GIVE_INFO: "APPROVE_GIVE_INFO",
  IN_WORK: "IN_WORK",
  IN_WORK_WORK: "IN_WORK_WORK",
  IN_WORK_REQUEST_INFO: "IN_WORK_REQUEST_INFO",
  IN_WORK_GIVE_INFO: "IN_WORK_GIVE_INFO",
  IN_WORK_TASK_CREATED: "IN_WORK_TASK_CREATED",
  IN_WORK_TASK_COMPLETED: "IN_WORK_TASK_COMPLETED",
  IN_WORK_REQUEST_INFORMATION: "IN_WORK_REQUEST_INFORMATION",
  IN_WORK_GIVE_INFORMATION: "IN_WORK_GIVE_INFORMATION",
  COMPLETED: "COMPLETED",
  CLOSED: "CLOSED",
  WAITING: "WAITING",
} as const;

export const PRIORITY_CODES = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  IMPORTANT: "IMPORTANT",
  CRITICAL: "CRITICAL",
} as const;

export const STATE_CODES_RUS_MAP: Record<keyof typeof STATE_CODES, string> = {
  REGISTERED: "Зарегистрирован",
  INWORKGROUP_ASSIGNED: "Назначен",
  INWORKGROUP_RETURNED: "Возврат в работу",
  INWORKGROUP_APPROVED: "Согласован",
  INWORKGROUP_NOT_APPROVED: "Не согласован",
  APPROVE_WAITING: "Ожидает согласования",
  APPROVE_REQUEST_INFO: "Уточнение информации по согласованию",
  APPROVE_GIVE_INFO: "Получена дополнительная информация по согласованию",
  IN_WORK: "В работе",
  IN_WORK_WORK: "В работе",
  IN_WORK_REQUEST_INFO: "Уточнение информации",
  IN_WORK_GIVE_INFO: "Получена дополнительная информация",
  IN_WORK_TASK_CREATED: "ЗНР созданы",
  IN_WORK_TASK_COMPLETED: "ЗНР выполнены",
  IN_WORK_REQUEST_INFORMATION: "Уточнение информации",
  IN_WORK_GIVE_INFORMATION: "Получена дополнительная информация",
  COMPLETED: "Выполнен",
  CLOSED: "Закрыт",
  WAITING: "Ожидание",
} as const;

export const PRIORITY_CODES_RUS_MAP: Record<
  keyof typeof PRIORITY_CODES,
  string
> = {
  LOW: "Низкий",
  MEDIUM: "Средний",
  HIGH: "Высокий",
  IMPORTANT: "Важный",
  CRITICAL: "Критичный",
} as const;

export const AVAILABILITY_INC_TYPE: IncType = "AVAILABILITY_INC";

export const TICKET_TYPES = {
  INC: "INC", // Инцидент
  SR: "SR", // ЗНО
  SRT: "SRT", // ЗНР
  INCT: "INCT", // ЗПИ
} as const;

export type TicketActionEntityType =
  (typeof TICKET_TYPES)[keyof typeof TICKET_TYPES];

export const TICKET_ENTITY_TYPE_LABELS: Record<TicketActionEntityType, string> =
  {
    INC: "Инцидент",
    SR: "ЗНО",
    SRT: "ЗНР",
    INCT: "ЗПИ",
  };
