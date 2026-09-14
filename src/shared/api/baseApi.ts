import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  // TODO: Добавить стенд при продакшене
  baseUrl: window.location.hostname.includes("localhost")
    ? "/api"
    : `${document.location.origin}`,
});

type ReauthOptions = {
  skipReauth?: boolean;
};

/**
 * Base query with refresh-token handling. When a request gets 401,
 * we try to refresh and repeat the original request once.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ReauthOptions
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  // TODO: Отправить запрос на рефреш
  return result;
};

/**
 * Shared RTK Query API instance. All service slices should inject endpoints here.
 * Keep reducerPath stable to avoid store rewiring across modules.
 */
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: ["TaskInfo", "ChildTasks", "Worklog"],
});
