import {
  PRIORITY_CODES_RUS_MAP,
  STATE_CODES_RUS_MAP,
  TICKET_ENTITY_TYPE_LABELS,
  TICKET_TYPES,
  type TicketActionEntityType,
} from "./constants";
import type { RequestDTO } from "./types";
import { AVAILABILITY_INC_TYPE } from "./constants";

export const getRusStateCode = (stateCode: RequestDTO["stateCode"]) =>
  STATE_CODES_RUS_MAP[stateCode] ?? `Неизвестный статус: ${stateCode}`;

export const getRusPriorityCode = (priorityCode: RequestDTO["priorityCode"]) =>
  PRIORITY_CODES_RUS_MAP[priorityCode!] ??
  `Неизвестный приоритет: ${priorityCode}`;

export const isAvailabilityIncident = (request: RequestDTO): boolean =>
  !!request.incType && request.incType === AVAILABILITY_INC_TYPE;

/** Вычисляет entityType из businessId заявки.
 * Порядок проверок важен: INCT должен идти до INC, SRT -- до SR.
 * Соответствует маппингу в getEsmLink / buildEsmLink. */
export const resolveTicketActionEntityType = (
  ticketId: string,
): TicketActionEntityType => {
  const normalizedId = ticketId.trim().toUpperCase();

  if (normalizedId.startsWith("INCT")) return TICKET_TYPES.INCT;
  if (normalizedId.startsWith("INC")) return TICKET_TYPES.INC;
  if (normalizedId.startsWith("SRT")) return TICKET_TYPES.SRT;
  if (normalizedId.startsWith("SR")) return TICKET_TYPES.SR;

  throw new Error(`Не удалось определить тип сущности для ${ticketId}`);
};

export const getRusRequestType = (businessId: string) => {
  return TICKET_ENTITY_TYPE_LABELS[resolveTicketActionEntityType(businessId)];
};
