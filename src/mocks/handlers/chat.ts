import { http, HttpResponse } from "msw";
import {
  chatAttachmentMock,
  chatHistoryMock,
  sendMessageResponseMock,
} from "../data/chat";

/** Моки для web-ews-middle/chat/*, контракты см. в @modules/chat/types. */
export const chatHandlers = [
  http.get("*/web-ews-middle/chat/history/:numberId", () => {
    return HttpResponse.json(chatHistoryMock);
  }),
  http.post("*/web-ews-middle/chat/sendMessage", () => {
    return HttpResponse.json(sendMessageResponseMock);
  }),
  http.get("*/web-ews-middle/chat/attachment/:guid", () => {
    return new HttpResponse(chatAttachmentMock, {
      headers: { "Content-Type": "application/octet-stream" },
    });
  }),
];
