import { useGetTriageRequestsQuery } from "../api";
import type { RequestDTO } from "@shared/request";

import { useUser } from "@shared/user";

export const useTriageRequests = () => {
  const { user } = useUser();

  const employeeNumber = user?.employeeNumber ?? null;

  const queryResult = useGetTriageRequestsQuery(employeeNumber!, {
    skip: !employeeNumber,
    pollingInterval: 60_000,
  });

  const triageRequests = (queryResult.data ?? []) as RequestDTO[];

  return {
    triageRequests,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    hasServerError: queryResult.isError,
  } as const;
};
