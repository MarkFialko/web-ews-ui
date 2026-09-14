export const STATE_CODES = {
  CLOSED: "CLOSED",
  OPENED: "OPENED",
} as const;

export const SLA_TONE = {
  DEFAULT: "default",
  WARNING: "warning",
  ERROR: "error",
} as const;

export const CLOCK_MINUTES = {
  HOUR: 60,
  DAY: 24 * 60,
  SLA_WARNING_THRESHOLD: 4 * 60,
} as const;

export const WORK_TIME_TONE = {
  WORKING: "working",
  OFF: "off",
} as const;

export const WORK_MODE_STATUS = {
  REMOTE: "Удаленно",
  ABSENT: "Отсутствие",
  OFFICE: "В офисе",
} as const;
