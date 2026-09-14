import type { SberEsmKeyResponse } from "@modules/local-support/types/sberEsmKeyResponse";
import type { SberEsmSbsResponse } from "@modules/local-support/types/sberEsmSbsResponse";

export const sberEsmSbsResponseMock: SberEsmSbsResponse = {
  vsp: true,
  address: "г. Москва, ул. Вавилова, д. 19",
  territorialBank: "Московский банк",
  serviceId: "8f14e45f-ceea-4a5b-8c1d-1f2e3a4b5c6d",
  pcName: "WS-MSK-01234",
  telephone: "+74957654321",
};

export const sberEsmKeyResponseMock: SberEsmKeyResponse = {
  taskId: "task-0001030593",
  childTaskId: "child-task-0001030593",
};
