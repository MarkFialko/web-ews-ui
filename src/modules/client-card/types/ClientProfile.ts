import type { ClientAccess } from "./ClientAccess";
import type { ClientIncident } from "./ClientIncident";
import type { ClientPhone } from "./ClientPhone";
import type { ClientWorkstation } from "./ClientWorkstation";

/**
 * Client profile DTO for the Client Card module.
 */
export type ClientProfile = {
  id: string;
  fullName: string;
  personnelId: string;
  avatarUrl?: string;
  role: string;
  department: string;
  localTime: string;
  segment?: string;
  workModeLabel?: string;
  scheduleLabel?: string;
  workLocationLabel?: string;
  udProfile?: string;
  externalOrgId?: string;
  externalOrgName?: string;
  tbCa?: string;
  vsp?: string;
  tags: string[];
  phones: ClientPhone[];
  emails: { label: string; value: string }[];
  address: string;
  accesses?: ClientAccess[];
  workstations?: ClientWorkstation[];
  incidents?: ClientIncident[];
};
