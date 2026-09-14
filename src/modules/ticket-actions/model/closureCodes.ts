import {
  resolveTicketActionEntityType,
  TICKET_TYPES,
  type TicketActionEntityType,
} from "@shared/request";

export type ClosureOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export const requiresIncidentReason = (entityType: TicketActionEntityType) =>
  entityType === TICKET_TYPES.INC;

export const isIncident = (ticketId: string): boolean =>
  resolveTicketActionEntityType(ticketId) === TICKET_TYPES.INC;

export const isServiceRequest = (ticketId: string): boolean =>
  !isIncident(ticketId);
