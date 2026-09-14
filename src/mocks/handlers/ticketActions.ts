import { http, HttpResponse } from "msw";
import {
  closeCodesMock,
  incReasonMock,
  itServiceMock,
  lateReasonMock,
  workgroupByLabelMock,
  workgroupMembersMock,
  workgroupsMock,
} from "../data/ticketActions";

/**
 * Моки для web-ews-middle/workgroup/*, web-ews-middle/static-info/* и
 * web-ews-middle/esm-actions/close-task/*, контракты см. в
 * @modules/ticket-actions/types. Статичные пути (list, members, service/:id)
 * зарегистрированы раньше динамического /workgroup/:label, чтобы MSW не
 * перехватил их как значение параметра.
 */
export const ticketActionsHandlers = [
  http.get("*/web-ews-middle/workgroup/list", () => {
    return HttpResponse.json(workgroupsMock);
  }),
  http.get("*/web-ews-middle/workgroup/members", () => {
    return HttpResponse.json(workgroupMembersMock);
  }),
  http.get("*/web-ews-middle/workgroup/service/:serviceCodeId", () => {
    return HttpResponse.json(itServiceMock);
  }),
  http.get("*/web-ews-middle/workgroup/:workgroupLabel", () => {
    return HttpResponse.json(workgroupByLabelMock);
  }),
  http.get("*/web-ews-middle/static-info/close-codes", () => {
    return HttpResponse.json(closeCodesMock);
  }),
  http.get("*/web-ews-middle/static-info/late-reasons", () => {
    return HttpResponse.json(lateReasonMock);
  }),
  http.get("*/web-ews-middle/static-info/inc/inc-reason", () => {
    return HttpResponse.json(incReasonMock);
  }),
  http.put("*/web-ews-middle/esm-actions/close-task/:taskNumber", () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
