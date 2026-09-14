import { triageApi } from "@modules/triage/api";
import { baseApi } from "@shared/api";

export interface ReassignDTO {
  businessId: string;
  taskId: string;
  workGroup: string;
  assignee?: string;
  itService: string;
  reasonReassignment: string;
}

export const reassignApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    reassignTicket: builder.mutation<
      { taskId: string },
      ReassignDTO & { engineerName: string }
    >({
      query: ({
        engineerName: _,
        ...dto
      }: ReassignDTO & { engineerName: string }) => ({
        url: `web-ews-middle/esm-actions/reassign/${dto.businessId}`,
        method: "PUT",
        body: dto,
      }),
      async onQueryStarted(
        { businessId, engineerName },
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
                    (r) => r.businessId === businessId,
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

export const { useReassignTicketMutation } = reassignApi;
