import { http, HttpResponse } from "msw";

/**
 * Мок для web-ews-middle/call/make, контракты см. в @modules/call/types.
 * getEmployeePhones бьёт в тот же /employee/users/:employeeNumber, что и
 * @modules/request-card — см. requestCardHandlers.
 */
export const callHandlers = [
  http.post("*/web-ews-middle/call/make", () => {
    return HttpResponse.text("SUCCESS");
  }),
];
