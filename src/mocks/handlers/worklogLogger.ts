import { http, HttpResponse } from "msw";

/**
 * Мок для web-ews-middle/worklog/logs, контракты см. в
 * @shared/worklog-logger/api/worklogLogsApi. Бэк отвечает 204 с пустым телом.
 */
export const worklogLoggerHandlers = [
  http.post("*/web-ews-middle/worklog/logs", () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
