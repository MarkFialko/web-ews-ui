import type { ClientProfile } from "@modules/client-card";
import type { EngineerRequest } from "@modules/engineer-requests";
import type { EngineerRequestStatus } from "@modules/engineer-requests/types/EngineerRequest";

export type WorkspacePaletteClientContext = {
  request: EngineerRequest;
  client: ClientProfile;
};

export type WorkspacePaletteSearchDataset = {
  workingRequests: readonly EngineerRequest[];
  clientContexts: readonly WorkspacePaletteClientContext[];
  getRequestSearchValues: (request: EngineerRequest) => readonly string[];
};

export const CLOSED_REQUEST_STATUSES = new Set<EngineerRequestStatus>([
  "Закрыт",
  "Выполнен",
]);

export const getWorkspacePaletteWorkingRequests = ({
  requests,
  openRequestIds,
  currentEngineerName,
}: {
  requests: readonly EngineerRequest[];
  openRequestIds: readonly string[];
  currentEngineerName: string;
}) =>
  requests.filter(
    (request) =>
      openRequestIds.includes(request.id) ||
      (request.assignee === currentEngineerName &&
        !CLOSED_REQUEST_STATUSES.has(request.status)),
  );

export const buildWorkspacePaletteClientContexts = <
  TRequest extends EngineerRequest,
>({
  openRequests,
  resolveClientProfile,
}: {
  openRequests: readonly TRequest[];
  resolveClientProfile: (request: TRequest) => ClientProfile;
}): WorkspacePaletteClientContext[] =>
  openRequests.map((request) => ({
    request,
    client: resolveClientProfile(request),
  }));

export const getWorkspacePaletteRequestSearchValues = ({
  request,
  getRequestConfigurationItemLabel,
}: {
  request: EngineerRequest;
  getRequestConfigurationItemLabel: (request: EngineerRequest) => string;
}) => [
  request.id,
  request.title,
  request.clientName,
  request.clientPersonnelId,
  request.contextLabel,
  request.service,
  getRequestConfigurationItemLabel(request),
  ...request.childRequests.items.flatMap((childRequest) => [
    childRequest.id,
    childRequest.subject,
  ]),
];

export const buildWorkspacePaletteSearchDataset = ({
  getRequestConfigurationItemLabel,
}: {
  getRequestConfigurationItemLabel: (request: EngineerRequest) => string;
}): WorkspacePaletteSearchDataset => ({
  workingRequests: [],
  clientContexts: [],
  getRequestSearchValues: (request) =>
    getWorkspacePaletteRequestSearchValues({
      request,
      getRequestConfigurationItemLabel,
    }),
});
