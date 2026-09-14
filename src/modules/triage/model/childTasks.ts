import type { ChildTaskDto } from "@services/esmDatasourceApi";

export const CHILD_TASK_COMPLETED_STATES = new Set(["COMPLETED", "CLOSED"]);

/**
 * Агрегирует массив дочерних обращений: вычисляет N (всего) и M (выполнено).
 * Возвращает null, если данных нет.
 */
export const aggregateChildTasks = (
  tasks: ChildTaskDto[] | undefined,
): { n: number; m: number } | null => {
  if (!tasks || tasks.length === 0) return null;
  const n = tasks.length;
  const m = tasks.filter((t) =>
    CHILD_TASK_COMPLETED_STATES.has(t.stateCode),
  ).length;
  return { n, m };
};

/**
 * Цвет кнопки ЗПИ/ЗНР:
 * - все выполнены зелёный #4caf50
 * - есть незакрытые жёлтый #fbc02d
 */
export const getChildTasksColor = (
  agg: { n: number; m: number } | null,
): string | null => {
  if (!agg) return null;
  return agg.m === agg.n ? "#4caf50" : "#fbc02d";
};
