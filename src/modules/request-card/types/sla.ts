import type { STATE_CODES, SLA_TONE, WORK_TIME_TONE } from "../constants/sla";

export type StateCode = (typeof STATE_CODES)[keyof typeof STATE_CODES];
export type SlaTone = (typeof SLA_TONE)[keyof typeof SLA_TONE];
export type WorkTimeTone = (typeof WORK_TIME_TONE)[keyof typeof WORK_TIME_TONE];

export interface SlaInfo {
  label: string;
  clockLabel: string;
  tone: SlaTone;
  kosMinutes?: number;
  kosAuthor?: string;
}
