import type { IncType, PriorityCode, StateCode } from "@shared/request";

export type EngineerRequestStatus =
  | "Новая"
  | "Зарегистрирован"
  | "Назначен"
  | "В работе"
  | "В работе/Уточнение информации"
  | "Ожидает клиента"
  | "Ожидание ответа"
  | "Эскалация"
  | "Требуется ответ"
  | "Выполнен"
  | "Закрыт"
  | "Возврат"
  | "Отказ"
  | "Решено";

export type EngineerRequest = {
  /** UUID задачи в ESM */
  taskId: string;
  businessId: string;
  title: string | null;
  stateCode: StateCode;
  priorityCode: PriorityCode | null;
  workGroup: {
    id: string;
    businessId: string;
    workGroupLabel: string;
  };
  itService: {
    id: string;
    code: string;
    name: string;
    label: string | null;
  };
  configurationElement: string | null;
  initiator: {
    id: string;
    personalNumber: string;
    lastName: string | null;
    firstName: string | null;
    middleName: string | null;
    hired: string | null;
    fired: string | null;
    timeZone: number | null;
    subdivision: {
      id: string | null;
      name: string | null;
      terbank: string | null;
      subbranch: string | null;
    } | null;
    position: {
      id: string | null;
      name: string | null;
      position?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    createdAt: string | null;
    updatedAt: string | null;
  } | null;
  tags: string | null;
  description: string;
  createdAt: string | null;
  targetDate: string | null;
  factFinishDate: string | null;
  assignee: {
    personalNumber: string;
    lastName: string | null;
    firstName: string | null;
    middleName: string | null;
  };
  incType?: IncType;
};