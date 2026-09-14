import { baseApi } from "@shared/api";
import type {
  VipUserInfoCheckDto,
  ChangeTagsDTO,
  TakeInWorkDTO,
  UserInfoResponse,
  EmployeeArmsInfo,
  UserAccessDto,
  TicketsResponse,
  WithUserTN,
} from "../types";
import { getStorageProvider, STORE_NAMES } from "@shared/cache";
import { CACHE_KEY, triageApi } from "@modules/triage/api";
import { CACHE_TTL_TRIAGE_MS } from "@shared/constants/cache";
import type { CacheEntry } from "@shared/types/cache";
import { current } from "immer";
import type { RequestDTO } from "@shared/request";

export type EmployeePhotoResponse = {
  photoData: string;
};

export type EmployeeArmsDto = {
  arms: EmployeeArmsInfo[];
};

const requestCardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    vipVerify: builder.query<VipUserInfoCheckDto, string>({
      query: (employeeNumber: string) => ({
        url: `web-ews-middle/employee/vip-verify/${employeeNumber}`,
        method: "GET",
      }),
    }),
    getEmployeeByNumber: builder.query<UserInfoResponse, string>({
      query: (employeeNumber: string) => ({
        url: `web-ews-middle/employee/users/${employeeNumber}`,
        method: "GET",
      }),
    }),
    employeeArms: builder.query<EmployeeArmsInfo, string>({
      query: (employeeNumber: string) => ({
        url: `web-ews-middle/employee/arms/${employeeNumber}`,
        method: "GET",
      }),
    }),
    employeePhoto: builder.query<EmployeePhotoResponse, string>({
      query: (employeeNumber: string) => ({
        url: `web-ews-middle/employee/userPhoto/${employeeNumber}`,
        method: "GET",
      }),
    }),
    accessInfo: builder.query<UserAccessDto[], string>({
      query: (employeeNumber: string) => ({
        url: `web-ews-middle/employee/access/${employeeNumber}`,
        method: "GET",
      }),
    }),
    lastTickets: builder.query<TicketsResponse, string>({
      query: (userTabNum: string) => ({
        url: `web-ews-middle/esm-datasource/last-tickets/${userTabNum.replace(/^0+/, "")}`,
        method: "GET",
      }),
    }),
    changeTags: builder.mutation<void, WithUserTN<ChangeTagsDTO>>({
      query: ({ employeeNumber, ...dto }) => ({
        url: `web-ews-middle/esm-actions/setTags`,
        method: "POST",
        body: dto,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { employeeNumber, businessId, tags } = arg;

        let oldDraft: RequestDTO[] = [];

        const patchResult = dispatch(
          triageApi.util.updateQueryData(
            "getTriageRequests",
            employeeNumber,
            (draft) => {
              oldDraft = current(draft);
              const requestIndex = draft.findIndex(
                (r) => r.businessId === businessId,
              );

              if (requestIndex === -1) return;
              const request = draft[requestIndex];

              draft.splice(requestIndex, 1, { ...request, tags: tags });

              const newDraft = current(draft);

              const p = getStorageProvider();
              p.setRecord(STORE_NAMES.TRIAGE, CACHE_KEY, {
                value: newDraft,
                cachedAt: Date.now(),
                ttlMs: CACHE_TTL_TRIAGE_MS,
              } satisfies CacheEntry<RequestDTO[]>)
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          const p = getStorageProvider();
          await p
            .setRecord(STORE_NAMES.TRIAGE, CACHE_KEY, {
              value: oldDraft,
              cachedAt: Date.now(),
              ttlMs: CACHE_TTL_TRIAGE_MS,
            } satisfies CacheEntry<RequestDTO[]>)
        }
      },
    }),
    takeInWork: builder.mutation<void, WithUserTN<TakeInWorkDTO>>({
      query: ({ employeeNumber, ...dto }) => ({
        url: `web-ews-middle/esm-actions/takeInWork`,
        method: "POST",
        body: dto,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { employeeNumber, businessId } = arg;

        let oldDraft: RequestDTO[] = [];

        const patchResult = dispatch(
          triageApi.util.updateQueryData(
            "getTriageRequests",
            employeeNumber,
            (draft) => {
              oldDraft = current(draft);
              const requestIndex = draft.findIndex(
                (r) => r.businessId === businessId,
              );

              if (requestIndex === -1) return;
              const request = draft[requestIndex];

              draft.splice(requestIndex, 1, {
                ...request,
                stateCode: "IN_WORK",
              });

              const newDraft = current(draft);

              const p = getStorageProvider();
              p.setRecord(STORE_NAMES.TRIAGE, CACHE_KEY, {
                value: newDraft,
                cachedAt: Date.now(),
                ttlMs: CACHE_TTL_TRIAGE_MS,
              } satisfies CacheEntry<RequestDTO[]>)
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          const p = getStorageProvider();
          await p
            .setRecord(STORE_NAMES.TRIAGE, CACHE_KEY, {
              value: oldDraft,
              cachedAt: Date.now(),
              ttlMs: CACHE_TTL_TRIAGE_MS,
            } satisfies CacheEntry<RequestDTO[]>)
        }
      },
    }),
  }),
});

export const {
  useVipVerifyQuery,
  useLazyVipVerifyQuery,
  useChangeTagsMutation,
  useTakeInWorkMutation,
  useGetEmployeeByNumberQuery,
  useLazyGetEmployeeByNumberQuery,
  useEmployeePhotoQuery,
  useLazyEmployeePhotoQuery,
  useEmployeeArmsQuery,
  useLazyEmployeeArmsQuery,
  useAccessInfoQuery,
  useLazyAccessInfoQuery,
  useLastTicketsQuery,
  useLazyLastTicketsQuery,
} = requestCardApi;

export { requestCardApi };
