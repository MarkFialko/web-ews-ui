import type {
  TicketActionDirtyState,
  TicketActionDirtyField,
} from "../types/ticketActionDraft";

export const buildEmptyDirtyState = (): TicketActionDirtyState => ({
  object: false,
  group: false,
  assignee: false,
  resolution: false,
  service: false,
  actionReason: false,
  closureCode: false,
  incidentReason: false,
  lateReason: false,
});

export const markClean = (
  state: TicketActionDirtyState,
  field: TicketActionDirtyField,
): TicketActionDirtyState => ({ ...state, [field]: false });

export const TICKET_ACTION_FIELD_LABELS: Record<
  TicketActionDirtyField,
  string
> = {
  object: "Объект",
  group: "Рабочая группа",
  assignee: "Исполнитель",
  resolution: "Решение",
  service: "Объект",
  actionReason: "Причина",
  closureCode: "Код закрытия",
  incidentReason: "Причина инцидента",
  lateReason: "Причина нарушения КС",
};
