import { baseApi } from "@shared/api/baseApi";

import type { WorklogEventDto } from "../types/BufferedWorklogEvent";

export type SendWorklogLogsArgs = {
  events: WorklogEventDto[];
  keepalive?: boolean;
};

export const worklogLogsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendWorklogLogs: build.mutation<void, SendWorklogLogsArgs>({
      query: ({ events, keepalive }) => ({
        url: "web-ews-middle/worklog/logs",
        method: "POST",
        body: events,
        // Бэк отвечает 204 с пустым телом: json-парсер дал бы PARSING_ERROR и
        // доставленная пачка ушла бы повторно.
        responseHandler: (response) => response.text(),
        // FetchArgs расширяет RequestInit, поэтому поле долетает до нативного
        // fetch внутри fetchBaseQuery.
        keepalive,
      }),
    }),
  }),
});
