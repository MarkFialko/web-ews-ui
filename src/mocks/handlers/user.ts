import { http, HttpResponse } from "msw";
import { userCommonMock, userDirectionMock, userInfoMock } from "../data/user";

/** Моки для web-ews-middle/user/*, контракты см. в @shared/user/types. */
export const userHandlers = [
  http.get("*/web-ews-middle/user/info", () => {
    return HttpResponse.json(userInfoMock);
  }),
  http.get("*/web-ews-middle/user/common", () => {
    return HttpResponse.json(userCommonMock);
  }),
  http.get("*/web-ews-middle/user/direction", () => {
    return HttpResponse.json(userDirectionMock);
  }),
];
