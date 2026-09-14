export type WorkgroupSettingsDto = {
  id: number;
  service: string;
  use_root_service: boolean;
  information: string;
  userParameter: string;
  isActive: boolean;
  createZpi: boolean;
  createZnr: boolean;
  route: boolean;
  ks_in_weekend: boolean;
  ks_in_agreement: number;
  ks_percent: number;
  stage_znr: number;
  time_breach: number;
  time_zone: boolean;
  checklistName: string;
};

export type WorkgroupItemDto = {
  id: number;
  title: string;
  bank: string;
  isActive: boolean;
  description: string;
  workgroupSettings: WorkgroupSettingsDto[];
};

export type WorkgroupCategoryDto = {
  title: string;
  isActive: boolean;
  workgroupItems: WorkgroupItemDto[];
};
