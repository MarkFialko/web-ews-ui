import dayjs from "dayjs";
import "dayjs/locale/ru";

import { declension } from "@shared/utils/declension";

dayjs.locale("ru");

const MINUTE = 1000 * 60;
const HOUR = 1000 * 60 * 60;

export const formatDateTime = (
  value: string | Date | null | undefined,
): string => {
  if (!value) return "";
  return dayjs(value).format("DD.MM.YYYY HH:mm");
};

export const formatCompactDateTime = (
  value: string | Date | null | undefined,
): string => {
  if (!value) return "";
  return dayjs(value).format("DD.MM HH:mm");
};

export const formatRelativeAge = (
  value: string | Date | null | undefined,
): string => {
  if (!value) return "";
  const now = dayjs();
  const date = dayjs(value);
  const diffMinutes = now.diff(date, "minute");
  if (diffMinutes < 60) return `${diffMinutes}м`;
  const diffHours = now.diff(date, "hour");
  if (diffHours < 24) return `${diffHours}ч`;
  const diffDays = now.diff(date, "day");
  return `${diffDays}д`;
};

export const formatSlaCountdown = (
  dueAt: string | null,
  now: dayjs.Dayjs,
): string => {
  if (!dueAt) return "Срок не задан";
  const due = dayjs(dueAt);
  const diff = due.valueOf() - now.valueOf();
  const absMs = Math.abs(diff);
  const hours = Math.floor(absMs / HOUR);
  const minutes = Math.floor((absMs % HOUR) / MINUTE);
  const human = `${hours}ч ${minutes.toString().padStart(2, "0")}м`;
  if (diff < 0) return `Просрочено на ${human}`;
  return `До SLA ${human}`;
};

export const getEngineerRequestKsResidualMinutes = (
  createdAt: string | null,
  dueAt: string | null,
  now: dayjs.Dayjs,
): number | null => {
  if (!createdAt || !dueAt) return null;
  const created = dayjs(createdAt);
  const due = dayjs(dueAt);
  if (due.isBefore(created) || due.isSame(created)) return null;
  return Math.floor((due.valueOf() - now.valueOf()) / MINUTE);
};

/**
 * Human-readable duration from minutes, full words in Russian.
 *
 * Examples:
 *   formatDurationMinutes(5)    → "5 минут"
 *   formatDurationMinutes(60)   → "1 час"
 *   formatDurationMinutes(100)  → "1 час 40 минут"
 *   formatDurationMinutes(1500) → "1 день 2 часа"
 */
export function formatDurationMinutes(minutes: number): string {
  const abs = Math.abs(minutes);

  const days = Math.floor(abs / (HOUR * 24));
  const hours = Math.floor((abs % (HOUR * 24)) / HOUR);
  const mins = abs % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(declension(days, ["день", "дня", "дней"]));
  if (hours > 0) parts.push(declension(hours, ["час", "часа", "часов"]));
  if (mins > 0) parts.push(declension(mins, ["минута", "минуты", "минут"]));

  return parts.join(" ") || "0 минут";
}
