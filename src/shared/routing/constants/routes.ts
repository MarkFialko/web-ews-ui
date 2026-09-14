export const TICKET_ID_KEY = "ticketId";

export const ROUTES = {
  REQUESTS: "/requests",
  REQUEST: `/requests/ticket/:${TICKET_ID_KEY}`,
  CTI: "/cti",
} as const;
