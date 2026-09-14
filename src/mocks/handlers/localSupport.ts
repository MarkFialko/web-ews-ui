import { http, HttpResponse } from "msw";
import {
  sberEsmKeyResponseMock,
  sberEsmSbsResponseMock,
} from "../data/localSupport";

/** Моки для web-ews-middle/sbs/*, контракты см. в @modules/local-support/types. */
export const localSupportHandlers = [
  http.get("*/web-ews-middle/sbs/get-new-task/:entityId", () => {
    return HttpResponse.json(sberEsmSbsResponseMock);
  }),
  http.post("*/web-ews-middle/sbs/complete-task", () => {
    return HttpResponse.json(sberEsmKeyResponseMock);
  }),
];
