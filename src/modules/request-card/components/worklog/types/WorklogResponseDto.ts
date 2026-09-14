import type { WorklogDto } from "./WorkglogDto";

export interface PagingData {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface WorklogResponseDto {
  actions: WorklogDto[];
  pagination: PagingData;
}
