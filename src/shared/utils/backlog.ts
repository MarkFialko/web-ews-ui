import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

export type BacklogThresholds = Record<string, number>;

dayjs.extend(duration);

/**
 * Пороги для определения номера ближайшего бэклога (в днях от создания заявки).
 * Ключ — номер бэклога, значение — минимальное количество дней,
 * при котором используется данный номер.
 */
const BACKLOG_THRESHOLDS: BacklogThresholds = {
  "1": 0, // менее 1 дня
  "2": 1, // 1–2 дня
  "5": 2, // 2–5 дней
  "6": 5, // 5–6 дней
};

const DAY_MS = 1000 * 60 * 60 * 24;
const HOUR_MS = 1000 * 60 * 60;
const MINUTE_MS = 1000 * 60;

export interface BacklogLabelInfo {
  name: string;
  color: string;
  tooltip: string;
}

export interface BacklogInfoResult {
  labelInfo: BacklogLabelInfo | null;
  backlogMs: number | null;
}

/**
 * Определяет номер бэклога на основе прошедших дней с момента создания заявки.
 * @param createdDateMs — время создания заявки в миллисекундах (Date.getTime())
 * @param nowMs — текущее время в миллисекундах (Date.getTime())
 * @returns номер бэклога (0 если не определён)
 */
function getBacklogNumber(createdDateMs: number, nowMs: number): number {
  const elapsedDays = (nowMs - createdDateMs) / DAY_MS;

  // Если заявка старше 6 дней — ближайшего бэклога нет
  if (elapsedDays >= BACKLOG_THRESHOLDS["6"] + 1) return 0;

  // Ищем максимальный номер, для которого порог выполнен
  const entries = Object.entries(BACKLOG_THRESHOLDS).sort(
    ([, a], [, b]) => Number(b) - Number(a),
  );

  for (const [number, thresholdDays] of entries) {
    if (elapsedDays >= thresholdDays) {
      return Number(number);
    }
  }

  return 0;
}

/**
 * Вычисляет время до ближайшего бэклога и информацию для отображения метки.
 * @param createdAt — ISO-строка или Date создания заявки
 * @param now — текущее время (dayjs или number)
 * @returns объект { labelInfo, backlogMs } или null при номере бэклога 0
 */
export function getBacklogInfo(
  createdAt: string | Date | null | undefined,
): { labelInfo: BacklogLabelInfo | null; backlogMs: number | null } | null {
  if (!createdAt) return null;

  const nowDate = dayjs().startOf("minute");
  const nowMs =
    nowDate instanceof dayjs ? nowDate.valueOf() : (nowDate as number);
  const createdMs =
    createdAt instanceof Date
      ? createdAt.getTime()
      : new Date(createdAt).getTime();

  if (!createdMs || Number.isNaN(createdMs)) return null;

  const backlogNumber = getBacklogNumber(createdMs, nowMs);

  if (backlogNumber === BACKLOG_THRESHOLDS["1"]) return null;

  // Время наступления ближайшего бэклога
  const backlogTargetMs = createdMs + DAY_MS * backlogNumber;

  // Оставшееся время
  const backlogMs = backlogTargetMs - nowMs;

  // Название метки: "БЛ<номер>" + отформатированное время
  const myDuration = dayjs.duration(Math.max(0, backlogMs));
  const days = myDuration.days();
  const hours = myDuration.hours();
  const minutes = myDuration.minutes();
  const formattedDuration =
    days > 0
      ? `${days}д ${hours}ч`
      : hours > 0
        ? `${hours}ч ${minutes}м`
        : `${minutes}м`;
  const name = `БЛ${backlogNumber} ${formattedDuration}`;

  // Цвет фона: >4ч — чёрный, <=4ч — оранжевый
  const color = backlogMs > HOUR_MS * 4 ? "textPrimary" : "orange";

  return {
    labelInfo: {
      name,
      color,
      tooltip: "Остаток времени до ближайшего бэклога",
    },
    backlogMs,
  };
}
