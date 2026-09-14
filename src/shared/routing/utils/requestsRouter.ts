import {
  COMMUNICATION_TAB,
  COMMUNICATIONS,
  ROUTES,
  TICKET_ID_KEY,
  type communication,
} from "../constants";

const isValidcommunication = (c: string | null): c is communication => {
  if (!c) return false;

  return COMMUNICATIONS.includes(c as communication);
};

export const getcommunication = (c: string | null): communication | null => {
  return isValidcommunication(c) ? (c as communication) : null;
};

export const createTicketRoute = (ticketId: string, c: string | null) => {
  const params = new URLSearchParams();

  const communication = getcommunication(c);

  if (communication) {
    params.append(COMMUNICATION_TAB, communication);
  }

  return `${ROUTES.REQUEST.replace(`:${TICKET_ID_KEY}`, ticketId)}?${params.toString()}`;
};
