import type { TicketActionEntityType } from "@shared/request";

export type StaticInfoItemDto = {
  taskType: TicketActionEntityType;
  code: string;
  label: string;
};

export type CloseCodesResponseDto = {
  items: StaticInfoItemDto[];
};

export type LateReasonResponseDto = {
  items: StaticInfoItemDto[];
};

export type IncReasonResponseDto = {
  items: StaticInfoItemDto[];
};
