import { http, HttpResponse } from "msw";
import {
  accessInfoMock,
  employeeArmsMock,
  employeeInfoMock,
  employeePhotoMock,
  lastTicketsMock,
  vipVerifyMock,
} from "../data/requestCard";

/**
 * Моки для web-ews-middle/employee/*, web-ews-middle/esm-datasource/last-tickets/*
 * и web-ews-middle/esm-actions/{setTags,takeInWork}, контракты см. в
 * @modules/request-card/types. Хендлер /employee/users/:employeeNumber общий
 * с @modules/call (getEmployeePhones читает из него userMainInfo.phones).
 */
export const requestCardHandlers = [
  http.get("*/web-ews-middle/employee/vip-verify/:employeeNumber", () => {
    return HttpResponse.json(vipVerifyMock);
  }),
  http.get("*/web-ews-middle/employee/users/:employeeNumber", () => {
    return HttpResponse.json(employeeInfoMock);
  }),
  http.get("*/web-ews-middle/employee/arms/:employeeNumber", () => {
    return HttpResponse.json(employeeArmsMock);
  }),
  http.get("*/web-ews-middle/employee/userPhoto/:employeeNumber", () => {
    return HttpResponse.json(employeePhotoMock);
  }),
  http.get("*/web-ews-middle/employee/access/:employeeNumber", () => {
    return HttpResponse.json(accessInfoMock);
  }),
  http.get("*/web-ews-middle/esm-datasource/last-tickets/:userTabNum", () => {
    return HttpResponse.json(lastTicketsMock);
  }),
  http.post("*/web-ews-middle/esm-actions/setTags", () => {
    return new HttpResponse(null, { status: 204 });
  }),
  http.post("*/web-ews-middle/esm-actions/takeInWork", () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
