import type {
  ChatHistoryDTO,
  MessageDTO,
  SendMessageResponseDTO,
} from "@modules/chat/types";

export const chatMessagesMock: MessageDTO[] = [
  {
    key: 1,
    datetime: "2026-09-12T10:14:00Z",
    numberId: "SR0001030593",
    username: "Смирнова Ольга Павловна",
    userId: "30012345",
    userType: "USER",
    message:
      "Здравствуйте! Не открывается 1С, пишет ошибку подключения к серверу.",
  },
  {
    key: 2,
    datetime: "2026-09-12T10:16:00Z",
    numberId: "SR0001030593",
    username: "Соколов Артём Викторович",
    userId: "10023458",
    userType: "ENG",
    message:
      "Добрый день! Уточните, пожалуйста, текст ошибки полностью или пришлите скриншот.",
  },
  {
    key: 3,
    datetime: "2026-09-12T10:18:30Z",
    numberId: "SR0001030593",
    username: "Смирнова Ольга Павловна",
    userId: "30012345",
    userType: "USER",
    message: "8f14e45f-ceea-4a5b-8c1d-1f2e3a4b5c6d",
    mimeType: "image/png",
  },
  {
    key: 4,
    datetime: "2026-09-12T10:25:00Z",
    numberId: "SR0001030593",
    username: "Соколов Артём Викторович",
    userId: "10023458",
    userType: "ENG",
    message:
      "Спасибо, вижу проблему. Перезапустил службу терминального сервера, попробуйте зайти снова.",
  },
];

export const chatHistoryMock: ChatHistoryDTO = {
  content: chatMessagesMock,
  page: {
    size: 20,
    totalElements: chatMessagesMock.length,
    totalPages: 1,
    number: 0,
  },
};

export const sendMessageResponseMock: SendMessageResponseDTO = {
  content: [
    {
      key: 5,
      datetime: new Date().toISOString(),
      numberId: "SR0001030593",
      username: "Соколов Артём Викторович",
      userId: "10023458",
      userType: "ENG",
      message: "Сообщение отправлено пользователю.",
    },
  ],
  page: 1,
  status: "SUCCESS",
  statusGroup: "OK",
};

/** Бинарное содержимое вложения (mock), декодируется на клиенте как Latin-1 строка. */
export const chatAttachmentMock = "mock-attachment-binary-content";
