import { useCallback, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";

import {
  COMMUNICATION_TAB,
  ROUTES,
  TICKET_ID_KEY,
  type Communication,
} from "../constants";
import {
  createTicketRoute,
  getcommunication as getCommunication,
} from "../utils";

export const useRequestsRouter = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const log = useWorklogLogger();

  const ticketId = useMemo(() => params[TICKET_ID_KEY] ?? null, [params]);
  const communication = useMemo(
    () =>
      ticketId ? getCommunication(searchParams.get(COMMUNICATION_TAB)) : null,
    [ticketId, searchParams],
  );

  const openTicket = useCallback(
    (ticketId: string, communication: Communication | null) => {
      navigate(createTicketRoute(ticketId, communication));
    },
    [navigate],
  );

  const opencommunication = useCallback(
    (communication: Communication) => {
      if (!ticketId) return;

      navigate(createTicketRoute(ticketId, communication));
    },
    [navigate, ticketId],
  );

  const closecommunication = useCallback(() => {
    if (!ticketId) return;
    navigate(createTicketRoute(ticketId, null));
  }, [ticketId, navigate]);

  const openRequests = useCallback(() => {
    navigate(ROUTES.REQUESTS);
  }, [navigate]);

  const closeRequest = useCallback(() => {
    if (!ticketId) return;
    log({ action: WORKLOG_ACTIONS.TASK_OUT, task: ticketId });
    navigate(ROUTES.REQUESTS);
  }, [navigate, log, ticketId]);

  return {
    ticketId,
    communication: communication,
    openTicket,
    openRequests,
    closeRequest,
    opencommunication,
    closecommunication,
  };
};
