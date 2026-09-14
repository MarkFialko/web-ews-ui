import { http, HttpResponse } from "msw";
import {
  confirmNotificationReadMock,
  unreadNotificationsMock,
} from "../data/notifications";

/** Моки для web-ews-middle/notifications/*, контракты см. в @modules/triage/types. */
export const notificationHandlers = [
  http.get("*/web-ews-middle/notifications/at-work-unreaded", () => {
    return HttpResponse.json(unreadNotificationsMock);
  }),
  http.get("*/web-ews-middle/notifications/confirm/:messageId", () => {
    return HttpResponse.json(confirmNotificationReadMock);
  }),
];
