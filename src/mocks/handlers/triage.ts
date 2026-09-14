import { http, HttpResponse } from "msw";
import { triageRequestsMock } from "../data/triage";

/** Моки для web-ews-middle/esm-datasource/taskList/*, контракты см. в @shared/request. */
export const triageHandlers = [
  http.get("*/web-ews-middle/esm-datasource/taskList/:engeneerName", () => {
    return HttpResponse.json(triageRequestsMock);
  }),
];
