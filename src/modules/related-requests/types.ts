import {
  resolveTicketActionEntityType,
  type RequestDTO,
  type TicketActionEntityType,
} from "@shared/request";

export type RelatedRequestType =
  | "TRANSFER"
  | "CHANGE_ASSIGNEE"
  | "CREATE_ZPI_ZNR";

export interface ActionVisibility {
  showTransfer: boolean;
  showChangeAssignee: boolean;
  createZpiZnr: boolean;
}

/** Статусы "В работе" -- набор для проверки */
export const IN_WORK_STATES: ReadonlySet<RequestDTO["stateCode"]> = new Set([
  "IN_WORK",
  "IN_WORK_WORK",
]);

/** Типы, для которых доступно "Перевести на смежную РГ" (SR, INC) */
export const TRANSFERABLE_TYPES: ReadonlySet<TicketActionEntityType> = new Set([
  "SR",
  "INC",
]);

/** Типы, для которых доступно "Сменить исполнителя" (SR, INC, INCT, SRT) */
export const CHANGE_ASSIGNEE_TYPES: ReadonlySet<TicketActionEntityType> =
  new Set(["SR", "INC", "INCT", "SRT"]);

/** Типы, для которых доступно "Создать ЗПИ/ЗНР" (SR, INC, INCT, SRT) */
export const CHANGE_CREATE_ZPI_ZNR_TYPES: ReadonlySet<TicketActionEntityType> =
  new Set(["SR", "INC", "INCT", "SRT"]);

/** Определить видимость действий для текущего обращения */
export function getActionVisibility(
  request: Pick<RequestDTO, "businessId" | "stateCode">,
): ActionVisibility {
  const entityType = resolveTicketActionEntityType(request.businessId);
  const isInWork = IN_WORK_STATES.has(request.stateCode);

  return {
    showTransfer: isInWork && TRANSFERABLE_TYPES.has(entityType),
    showChangeAssignee: isInWork && CHANGE_ASSIGNEE_TYPES.has(entityType),
    createZpiZnr: isInWork && CHANGE_CREATE_ZPI_ZNR_TYPES.has(entityType),
  };
}

const MAP_VISIBILITY_TO_ACTION: Record<
  keyof ActionVisibility,
  RelatedRequestType
> = {
  showTransfer: "TRANSFER",
  createZpiZnr: "CREATE_ZPI_ZNR",
  showChangeAssignee: "CHANGE_ASSIGNEE",
};

export const resolveAction = (request: RequestDTO) => {
  const visibility = getActionVisibility(request);
  const key =
    Object.keys(visibility).find(
      (key) => visibility[key as keyof ActionVisibility],
    ) ?? null;

  if (!key) return null;

  return MAP_VISIBILITY_TO_ACTION[key as keyof ActionVisibility];
};
