export type ItServiceDto = {
  guid: string;
  code: string;
  label: string;
  category: "AUTOMATED_SYSTEM" | "APPLICATION" | "INFRASTRUCTURE";
  owner: string;
  isActive: boolean;
};
