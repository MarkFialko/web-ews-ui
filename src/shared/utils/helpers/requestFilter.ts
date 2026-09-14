import type { RequestDTO } from "@shared/request";

export const isRequestVisibleForEngineer = (
  request: RequestDTO,
  employeeNumber: string,
): boolean =>
  !(
    request.stateCode === "COMPLETED" &&
    request.assignee?.personalNumber === employeeNumber
  );

export const filterRequestsForEngineer = (
  requests: RequestDTO[],
  employeeNumber: string,
): RequestDTO[] =>
  requests.filter((r) => isRequestVisibleForEngineer(r, employeeNumber));
