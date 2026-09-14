export interface StaticInfoItemDto {
  value: string;
  label: string;
}

export interface CloseCodesResponseDto {
  items: StaticInfoItemDto[];
}

export interface IncReasonResponseDto {
  items: StaticInfoItemDto[];
}

export interface LateReasonResponseDto {
  items: StaticInfoItemDto[];
}
