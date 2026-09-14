import { http, HttpResponse } from "msw";
import { worklogResponseMock } from "../data/worklog";

/**
 * Мок для web-ews-middle/worklog/:businessId (история действий по заявке),
 * контракты см. в @modules/request-card/components/worklog/types. Метод GET —
 * не конфликтует с POST .../worklog/logs из worklogLoggerHandlers.
 */
export const worklogHandlers = [
  http.get("*/web-ews-middle/worklog/:businessId", () => {
    return HttpResponse.json(worklogResponseMock);
  }),
];
