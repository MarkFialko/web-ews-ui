import { http, HttpResponse } from "msw";

/** Мок для web-ews-middle/esm-actions/set-protocol/:taskNumber, контракты см. в @shared/protocol/types. */
export const protocolHandlers = [
  http.post("*/web-ews-middle/esm-actions/set-protocol/:taskNumber", () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
