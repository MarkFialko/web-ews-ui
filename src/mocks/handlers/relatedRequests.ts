import { http, HttpResponse } from "msw";
import { reassignResultMock, templateMock } from "../data/relatedRequests";

/**
 * Моки для web-ews-middle/esm-datasource/template, web-ews-middle/esm-actions
 * (inc/:id/inct, sr/:id/srt, reassign/:businessId), контракты см. в
 * @modules/related-requests/api.
 */
export const relatedRequestsHandlers = [
  http.get("*/web-ews-middle/esm-datasource/template/:businessId", () => {
    return HttpResponse.json(templateMock);
  }),
  http.post("*/web-ews-middle/esm-actions/inc/:incidentId/inct", () => {
    return HttpResponse.json({});
  }),
  http.post("*/web-ews-middle/esm-actions/sr/:requestId/srt", () => {
    return HttpResponse.json({});
  }),
  http.put("*/web-ews-middle/esm-actions/reassign/:businessId", () => {
    return HttpResponse.json(reassignResultMock);
  }),
];
