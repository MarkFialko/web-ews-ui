import { baseApi } from "@shared/api";
import { getStorageProvider, STORE_NAMES } from "@shared/cache";
import { CACHE_TTL_TRIAGE_MS } from "@shared/constants/cache";
import type { CacheEntry } from "@shared/types/cache";
import type { RequestDTO } from "@shared/request";
import { filterRequestsForEngineer } from "@shared/utils/helpers";

export const CACHE_KEY = "triage";

export const triageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTriageRequests: builder.query<RequestDTO[], string>({
      query: (engeneerName: string) => ({
        url: `web-ews-middle/esm-datasource/taskList/${engeneerName}`,
        method: "GET",
      }),
      transformResponse: (response: RequestDTO[], _meta, arg: string) =>
        filterRequestsForEngineer(response ?? [], arg),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const p = getStorageProvider();
          await p.setRecord(STORE_NAMES.TRIAGE, CACHE_KEY, {
            value: data ?? [],
            cachedAt: Date.now(),
            ttlMs: CACHE_TTL_TRIAGE_MS,
          } satisfies CacheEntry<RequestDTO[]>);
        } catch {
          /* запрос отклонён — не пишем в кеш */
        }
      },
    }),
  }),
});

export const { useGetTriageRequestsQuery } = triageApi;
