import { Routes, Route, Navigate, useParams } from "react-router-dom";

import {
  createTicketRoute,
  TICKET_ID_KEY,
  COMMUNICATION_MAP,
  ROUTES,
} from "@shared/routing";

import EngineerWorkspace from "@modules/engineer-workspace/EngineerWorkspace";

import { RequestsLayout } from "../layouts";

const NavigateToChatCommunication = () => {
  const params = useParams();

  return (
    <Navigate
      to={createTicketRoute(params[TICKET_ID_KEY]!, COMMUNICATION_MAP.CHAT)}
      replace
    />
  );
};

export const RequestsRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.REQUESTS} element={<RequestsLayout />}>
        <Route index element={<EngineerWorkspace />} />
        <Route path="ticket/:ticketId" element={<EngineerWorkspace />} />
      </Route>

      <Route
        path="ticket/:ticketId/chat"
        element={<NavigateToChatCommunication />}
      />
      <Route path="*" element={<Navigate to={ROUTES.REQUESTS} replace />} />
    </Routes>
  );
};
