import dayjs from "dayjs";

export type SlaState = "overdue" | "risk" | "normal";

const HOUR = 1000 * 60 * 60;
const MINUTE = 1000 * 60;

export const getEngineerRequestSlaState = (
  targetDate: string | Date | null | undefined,
  now?: dayjs.Dayjs,
): SlaState => {
  if (!targetDate) return "normal";
  const nowDate = now ?? dayjs();
  const target = dayjs(targetDate);
  if (!target.isValid()) return "normal";
  const diffMs = target.valueOf() - nowDate.valueOf();
  if (diffMs < 0) return "overdue";
  if (diffMs < HOUR * 4) return "risk";
  return "normal";
};

function formatDurationString(durationMs: number): string {
  const negative = durationMs < 0;
  const absMs = Math.abs(durationMs);

  if (absMs < MINUTE) {
    const minutes = Math.max(1, Math.floor(absMs / MINUTE));
    return `${negative ? "−" : ""}${minutes}м`;
  }

  if (absMs < HOUR) {
    const hours = Math.floor(absMs / HOUR);
    const minutes = Math.floor((absMs % HOUR) / MINUTE);
    return `${negative ? "−" : ""}${hours}ч ${minutes}м`;
  }

  const days = Math.floor(absMs / (HOUR * 24));
  const hours = Math.floor((absMs % (HOUR * 24)) / HOUR);
  return `${negative ? "−" : ""}${days}д ${hours}ч`;
}

function formatWorkDurationString(elapsedMs: number): string {
  if (elapsedMs < MINUTE) {
    const minutes = Math.max(1, Math.floor(elapsedMs / MINUTE));
    return `${minutes}м`;
  }

  if (elapsedMs < HOUR) {
    const hours = Math.floor(elapsedMs / HOUR);
    const minutes = Math.floor((elapsedMs % HOUR) / MINUTE);
    return `${hours}ч ${minutes}м`;
  }

  const days = Math.floor(elapsedMs / (HOUR * 24));
  const hours = Math.floor((elapsedMs % (HOUR * 24)) / HOUR);
  return `${days}д ${hours}ч`;
}

export const formatSlaDuration = (
  targetDate: string | null | undefined,
  now: dayjs.Dayjs,
): string => {
  if (!targetDate) return "SLA —";
  const due = dayjs(targetDate);
  if (!due.isValid()) return "SLA —";
  return formatDurationString(due.valueOf() - now.valueOf());
};

export const formatWorkElapsed = (
  createdAt: string | null | undefined,
  now: dayjs.Dayjs,
): string => {
  if (!createdAt) return "—";
  const created = dayjs(createdAt);
  if (!created.isValid()) return "—";
  return formatWorkDurationString(
    Math.max(0, now.valueOf() - created.valueOf()),
  );
};
