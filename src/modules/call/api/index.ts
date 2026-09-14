import { baseApi } from "@shared/api";
import type { MakeCallRequestDTO, EngeneerPhone } from "../types";

const callApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    makeCall: builder.mutation<string, MakeCallRequestDTO>({
      query: (dto: MakeCallRequestDTO) => ({
        url: "web-ews-middle/call/make",
        method: "POST",
        body: dto,
        responseHandler: "text",
      }),
    }),
    getEmployeePhones: builder.query<EngeneerPhone[], string>({
      query: (employeeNumber: string) => ({
        url: `web-ews-middle/employee/users/${employeeNumber}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        return response?.userMainInfo?.phones ?? [];
      },
    }),
  }),
});

export const { useMakeCallMutation, useGetEmployeePhonesQuery } = callApi;
