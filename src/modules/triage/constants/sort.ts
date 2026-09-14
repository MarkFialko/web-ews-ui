import type { TriageSortKey } from "../types/sortOption";

export const SORT_OPTIONS: Array<{ value: TriageSortKey; label: string }> = [
  { value: "targetDate", label: "По контрольному сроку" },
  { value: "createdAt", label: "По дате создания" },
  { value: "backlog", label: "По остатку времени до БЛ" },
] as const;
