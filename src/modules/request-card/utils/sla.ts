import type { RequestDTO } from "@shared/request";
import type { SlaInfo } from "../../types";
import { SLA_TONE, CLOCK_MINUTES, WORK_TIME_TONE } from "../constants/sla";

export const formatSlaLeft = (incident: RequestDTO): SlaInfo => {
  const targetDate = incident?.targetDate;

  if (!targetDate) {
    return {
      label: "нет данных",
      clockLabel: "КС --:--",
      tone: SLA_TONE.DEFAULT,
    };
  }

  const minutesLeft = getKsResidualMinutes(targetDate);
  const normalizedLabel = formatRequestHeaderSla(minutesLeft);

  return {
    label: normalizedLabel,
    clockLabel: `Контрольный срок: ${formatDateTime(targetDate)}`,
    tone:
      minutesLeft === null
        ? SLA_TONE.DEFAULT
        : minutesLeft < 0
          ? SLA_TONE.ERROR
          : minutesLeft < CLOCK_MINUTES.SLA_WARNING_THRESHOLD
            ? SLA_TONE.WARNING
            : SLA_TONE.DEFAULT,
  };
};

const formatRequestHeaderSla = (minutesLeft: number | null): string => {
  if (minutesLeft === null) return "SLA --";

  const negative = minutesLeft < 0;
  const absMinutes = Math.abs(minutesLeft);

  if (absMinutes < CLOCK_MINUTES.DAY) {
    const hours = Math.floor(absMinutes / CLOCK_MINUTES.HOUR);
    const minutes = absMinutes % CLOCK_MINUTES.HOUR;
    return `SLA ${negative ? "−" : ""}${hours}ч ${minutes}м`;
  }

  const days = Math.floor(absMinutes / CLOCK_MINUTES.DAY);
  const hours = Math.floor(
    (absMinutes % CLOCK_MINUTES.DAY) / CLOCK_MINUTES.HOUR,
  );
  return `SLA ${negative ? "−" : ""}${days}д ${hours}ч`;
};

export const parseClockToMinutes = (value: string): number | null => {
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  return hours * CLOCK_MINUTES.HOUR + minutes;
};

export const getWorkTimeChipTone = (
  scheduleLabel?: string,
  localTime?: string,
): import("../types/sla").WorkTimeTone | null => {
  if (!scheduleLabel || !localTime) return null;

  const [startRaw, endRaw] = scheduleLabel
    .split("-")
    .map((part) => part.trim());
  const startMinutes = parseClockToMinutes(startRaw);
  const endMinutes = parseClockToMinutes(endRaw);
  const currentMinutes = parseClockToMinutes(localTime);

  if (startMinutes === null || endMinutes === null || currentMinutes === null)
    return null;

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes
    ? WORK_TIME_TONE.WORKING
    : WORK_TIME_TONE.OFF;
};

export const getWorkModeStatusLabel = (workModeLabel?: string): string => {
  const normalizedMode = workModeLabel?.trim().toLowerCase() ?? "";

  if (normalizedMode.includes("удален")) return "Удаленно";
  if (normalizedMode.includes("отсутств")) return "Отсутствие";
  return "В офисе";
};

export const formatCompactSchedule = (
  scheduleLabel?: string,
): string | null => {
  if (!scheduleLabel) return null;

  const [startRaw, endRaw] = scheduleLabel
    .split("-")
    .map((part) => part.trim());
  if (!startRaw || !endRaw) return scheduleLabel;

  const normalizeHourLabel = (value: string) => value.replace(/:00\b/g, "");
  return `${normalizeHourLabel(startRaw)}–${normalizeHourLabel(endRaw)}`;
};

const getKsResidualMinutes = (targetDate: string): number | null => {
  const diff = new Date(targetDate).getTime() - Date.now();
  return Number.isNaN(diff) ? null : Math.floor(diff / 60000);
};

const formatDateTime = (date: string | undefined): string => {
  if (!date) return "--:--";
  return new Date(date).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
