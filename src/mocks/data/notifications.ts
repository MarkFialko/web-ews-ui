import type {
  ConfirmReadResponse,
  WebEwsUnreadNotification,
} from "@modules/triage/types";

export const unreadNotificationsMock: WebEwsUnreadNotification[] = [
  {
    id: 501,
    title: "Новое сообщение в чате",
    type: "CHAT",
    bodyHtml:
      "<p>Смирнова Ольга: пришло новое сообщение по заявке SR0001030593</p>",
    displayType: "WebEws",
    createTimestamp: Date.now() - 60_000,
    authorSmId: "SM-30012345",
    showTimeSec: 10,
    lifetimeSec: 300,
  },
];

export const confirmNotificationReadMock: ConfirmReadResponse = "OK";
