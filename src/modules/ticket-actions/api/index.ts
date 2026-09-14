import { baseApi } from "@shared/api";
import { triageApi } from "@modules/triage/api";
import type {
  WorkgroupCategoryDto,
  WorkgroupMemberDto,
  WorkgroupDto,
  ItServiceDto,
  CloseCodesResponseDto,
  LateReasonResponseDto,
  IncReasonResponseDto,
  CloseTaskRequest,
} from "../types";
import type { UserInfoDTO } from "@shared/user";

export type GetWorkgroupsRequestDTO = {
  unit: string;
  direction: string;
};

export const ticketActionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkgroups: builder.query<
      WorkgroupCategoryDto[],
      GetWorkgroupsRequestDTO
    >({
      query: ({ unit, direction }) => ({
        url: "web-ews-middle/workgroup/list",
        method: "GET",
        params: { unit, direction },
      }),
    }),
    getWorkgroupMembers: builder.query<WorkgroupMemberDto[], string>({
      query: (workgroupId) => ({
        url: "web-ews-middle/workgroup/members",
        method: "GET",
        params: { workgroupId: workgroupId },
      }),
      transformResponse: (response: WorkgroupMemberDto[] | undefined) =>
        response ?? [],
    }),
    getWorkgroupByLabel: builder.query<WorkgroupDto, string>({
      query: (workgroupLabel) => ({
        url: `web-ews-middle/workgroup/${encodeURIComponent(workgroupLabel)}`,
        method: "GET",
      }),
    }),
    getServiceByCodeId: builder.query<ItServiceDto, string>({
      query: (serviceCodeId) => ({
        url: `web-ews-middle/workgroup/service/${encodeURIComponent(serviceCodeId)}`,
        method: "GET",
      }),
    }),
    getCloseCodes: builder.query<CloseCodesResponseDto, void>({
      query: () => ({
        url: "web-ews-middle/static-info/close-codes",
        method: "GET",
      }),
    }),
    getLateReason: builder.query<LateReasonResponseDto, void>({
      query: () => ({
        url: "web-ews-middle/static-info/late-reasons",
        method: "GET",
      }),
    }),
    getIncReason: builder.query<IncReasonResponseDto, void>({
      query: () => ({
        url: "web-ews-middle/static-info/inc/inc-reason",
        method: "GET",
      }),
    }),
    closeTask: builder.mutation<
      void,
      { taskNumber: string; body: CloseTaskRequest; engineerName?: string }
    >({
      query: ({ taskNumber, body }) => ({
        url: `web-ews-middle/esm-actions/close-task/${encodeURIComponent(taskNumber)}`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(
        { taskNumber, engineerName },
        { dispatch, queryFulfilled },
      ) {
        try {
          await queryFulfilled;
          if (engineerName) {
            dispatch(
              triageApi.util.updateQueryData(
                "getTriageRequests",
                engineerName,
                (draft) => {
                  const indexOfRequest = draft.findIndex(
                    (r) => r.businessId === taskNumber,
                  );
                  if (indexOfRequest !== -1) draft.splice(indexOfRequest, 1);
                },
              ),
            );
          }
        } catch {
          /* ignore */
        }
      },
    }),
  }),
});

export const {
  useGetWorkgroupsQuery,
  useGetWorkgroupMembersQuery,
  useGetWorkgroupByLabelQuery,
  useGetServiceByCodeIdQuery,
  useGetCloseCodesQuery,
  useGetLateReasonQuery,
  useGetIncReasonQuery,
  useCloseTaskMutation,
} = ticketActionsApi;

export const selectWorkgroupsByUnitDirection = (state: {
  unit: string;
  direction: string;
}) => ({
  query: { unit: state.unit, direction: state.direction },
});

export const selectWorkgroupsData = (state: Record<string, unknown>) => {
  const userEngeneerInfo = state as unknown as UserInfoDTO;
  return selectWorkgroupsByUnitDirection({
    unit: userEngeneerInfo.unit ?? "",
    direction: userEngeneerInfo.department ?? "",
  });
};
