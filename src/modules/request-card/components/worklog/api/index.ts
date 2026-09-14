import { baseApi } from "@shared/api";

import type { WorklogRequestDto, WorklogResponseDto } from "../types";
import dayjs from "dayjs";

const worklogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorklog: builder.query<WorklogResponseDto, WorklogRequestDto>({
      query: (dto: WorklogRequestDto) => {
        const params = new URLSearchParams();

        if (dto.page != null) params.set("page", String(dto.page));
        if (dto.size != null) params.set("size", String(dto.size));
        if (dto.startDate)
          params.set(
            "startDate",
            `${dayjs(dto.startDate).format("YYYY-MM-DD")}T00:00:00Z`,
          );
        if (dto.endDate)
          params.set(
            "endDate",
            `${dayjs(dto.endDate).format("YYYY-MM-DD")}T23:59:59Z`,
          );
        if (dto.authorPersonalNumber != null)
          params.set("authorPersonalNumber", String(dto.authorPersonalNumber));
        if (dto.action) params.set("action", dto.action);
        if (dto.source) params.set("source", dto.source);

        return {
          method: "GET",
          url: `web-ews-middle/worklog/${dto.businessId}`,
          params,
        };
      },
      providesTags: (_, __, arg) => [{ type: "Worklog", id: arg.businessId }],
    }),
  }),
});

export const { useGetWorklogQuery, useLazyGetWorklogQuery } = worklogApi;
