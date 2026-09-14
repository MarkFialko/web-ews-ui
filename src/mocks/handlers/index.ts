import { userHandlers } from "./user";
import { chatHandlers } from "./chat";
import { ticketActionsHandlers } from "./ticketActions";
import { triageHandlers } from "./triage";
import { notificationHandlers } from "./notifications";
import { localSupportHandlers } from "./localSupport";
import { callHandlers } from "./call";
import { knowledgeBaseHandlers } from "./knowledgeBase";
import { requestCardHandlers } from "./requestCard";
import { relatedRequestsHandlers } from "./relatedRequests";
import { worklogLoggerHandlers } from "./worklogLogger";
import { worklogHandlers } from "./worklog";
import { dictionaryHandlers } from "./dictionary";
import { protocolHandlers } from "./protocol";

/** Сводный список всех MSW-хендлеров. Новые домены (по мере разбора ручек
 * web-ews-middle) добавлять сюда отдельным файлом в этой же папке. */
export const handlers = [
  ...userHandlers,
  ...chatHandlers,
  ...ticketActionsHandlers,
  ...triageHandlers,
  ...notificationHandlers,
  ...localSupportHandlers,
  ...callHandlers,
  ...knowledgeBaseHandlers,
  ...requestCardHandlers,
  ...relatedRequestsHandlers,
  ...worklogLoggerHandlers,
  ...worklogHandlers,
  ...dictionaryHandlers,
  ...protocolHandlers,
];
