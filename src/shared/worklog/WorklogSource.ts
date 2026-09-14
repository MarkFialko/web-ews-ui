/**
 * Источник события в ленте «История действий».
 * - `webEws_worklog` — изменение заявки, показывается в ленте;
 * - `webEws` — служебное событие, в ленте не показывается.
 *
 * Читающая сторона фильтрует чёрным списком: скрывается только `webEws`,
 * всё остальное (в том числе значения десктопного приложения) попадает в ленту.
 */
export const WORKLOG_SOURCE = {
  WORKLOG: "webEws_worklog",
  SERVICE: "webEws",
  CTI: "cti",
} as const;

export type WorklogSource =
  (typeof WORKLOG_SOURCE)[keyof typeof WORKLOG_SOURCE];
