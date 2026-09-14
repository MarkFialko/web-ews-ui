import { STATE_CODES, PRIORITY_CODES } from "./constants";
import type { LabelDto } from "../label";

export type IncType =
  | "AVAILABILITY_INC"
  | "USER_INC"
  | "DATA_QUALITY_INC"
  | "AFTERMATH_DEAL_INC"
  | "PROD_STAND_INC"
  | "CONFIG_INC"
  | "VSP_INC"
  | "DATA_PASS_INC";

export interface RequestWorkgroupDTO {
  id: string;
  businessId: string;
  workGroupLabel: string;
}

export interface RequestItService {
  id: string;
  code: string;
  name: string;
  label: string | null;
}

export interface InitiatorSubdivisionDTO {
  id: string | null;
  name: string | null;
  terbank: string | null;
  subbranch: string | null;
}

export interface InitiatorPositionDTO {
  id: string | null;
  name: string | null;
  position?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface RequestInitiatorDTO {
  id: string;
  personalNumber: string;
  lastName: string | null;
  firstName: string | null;
  middleName: string | null;
  hired: string | null;
  fired: string | null;
  timeZone: number | null;
  subdivision: InitiatorSubdivisionDTO | null;
  position: InitiatorPositionDTO | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface RequestAssigneeDTO {
  personalNumber: string;
  lastName: string | null;
  firstName: string | null;
  middleName: string | null;
}

export type StateCode = keyof typeof STATE_CODES;

export type PriorityCode = keyof typeof PRIORITY_CODES;

interface RequestProperty {
  code: string;
  name: string;
  type: string;
  value: string;
  modifiers: [];
}

export interface RequestDTO {
  taskWaiting: string;
  taskId: string;
  businessId: string;
  title: string | null;
  stateCode: StateCode;
  priorityCode: PriorityCode | null;
  workGroup: RequestWorkgroupDTO;
  itService: RequestItService;
  configurationElement: string | null;
  initiator: RequestInitiatorDTO | null;
  tags: string | null;
  description: string;
  createdAt: string | null;
  targetDate: string | null;
  factFinishDate: string | null;
  assignee: RequestAssigneeDTO;
  properties: RequestProperty[];
  labels: LabelDto[];
  incType?: IncType;
}
