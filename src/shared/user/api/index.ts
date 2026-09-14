import { baseApi } from "../../api";

import type { UserCommonDTO, UserInfoDTO, UserDirectionDTO } from "../types";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query<UserInfoDTO, void>({
      query: () => ({
        url: "web-ews-middle/user/info",
        method: "GET",
      }),
    }),
    getUserCommon: builder.query<UserCommonDTO, void>({
      query: () => ({
        url: "web-ews-middle/user/common",
        method: "GET",
      }),
    }),
    getUserDirection: builder.query<UserDirectionDTO, void>({
      query: () => ({
        url: "web-ews-middle/user/direction",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useGetUserCommonQuery,
  useGetUserDirectionQuery,
} = userApi;
