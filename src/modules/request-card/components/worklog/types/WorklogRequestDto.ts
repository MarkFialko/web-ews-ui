export interface WorklogRequestDto {
  businessId: string;
  startDate?: string | undefined;
  endDate?: string | undefined;
  authorPersonalNumber?: string | undefined;
  page: number;
  size: number;
  action?: string;
  source?: string;
}
