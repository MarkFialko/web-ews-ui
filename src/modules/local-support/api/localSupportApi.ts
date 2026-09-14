import { baseApi } from "@shared/api/baseApi";
import type { SberEsmSbsRequest } from "../types/sberEsmSbsRequest";
import type { SberEsmSbsResponse } from "../types/sberEsmSbsResponse";
import type { SberEsmKeyResponse } from "../types/sberEsmKeyResponse";

export const localSupportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewTask: builder.query<SberEsmSbsResponse, string>({
      query: (entityId) => ({
        url: `web-ews-middle/sbs/get-new-task/${encodeURIComponent(entityId)}`,
        method: "GET",
      }),
    }),
    completeTask: builder.mutation<SberEsmKeyResponse, SberEsmSbsRequest>({
      query: (request) => ({
        url: "web-ews-middle/sbs/complete-task",
        method: "POST",
        body: request,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetNewTaskQuery, useCompleteTaskMutation } = localSupportApi;
