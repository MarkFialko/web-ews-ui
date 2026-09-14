import type { WorklogResponseDto } from "@modules/request-card/components/worklog/types";
import { WORKLOG_ACTIONS } from "@shared/worklog-logger/constants";
import { WORKLOG_SOURCE } from "@shared/worklog";

export const worklogResponseMock: WorklogResponseDto = {
  actions: [
    {
      id: "wl-1",
      timestamp: "2026-09-12T10:16:00Z",
      author: {
        personalNumber: "10023458",
        engineerName: "Соколов Артём Викторович",
      },
      description: "Заявка взята в работу",
      source: WORKLOG_SOURCE.WORKLOG,
      action: WORKLOG_ACTIONS.TASK_IN_WORK,
      task: "SR0001030593",
    },
    {
      id: "wl-2",
      timestamp: "2026-09-12T10:25:00Z",
      author: {
        personalNumber: "10023458",
        engineerName: "Соколов Артём Викторович",
      },
      description: "Отправлено сообщение пользователю в чате",
      source: WORKLOG_SOURCE.WORKLOG,
      action: WORKLOG_ACTIONS.WRITE_CHAT,
      task: "SR0001030593",
    },
  ],
  pagination: {
    page: 0,
    size: 20,
    totalElements: 2,
    totalPages: 1,
  },
};
