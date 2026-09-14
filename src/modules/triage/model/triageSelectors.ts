import {
  getEngineerRequestSlaState,
  formatSlaDuration,
  formatWorkElapsed,
} from "@shared/utils";
import { getBacklogInfo } from "@shared/utils";
import type { SlaState } from "@shared/utils";
import { getEngeneerName } from "../utils";
import type { RequestDTO } from "@shared/request";
import { getTerrbankFullName, getTerrbankShortName } from "@shared/utils";
import type dayjs from "dayjs";

export type TriageFocusFilter = "all" | "overdue" | "risk" | "new";

export type TriageLaneKey =
  | "userFeedback"
  | "overdue"
  | "risk"
  | "new"
  | "rest";

export const TRIAGE_LANE_ORDER: TriageLaneKey[] = [
  "userFeedback",
  "overdue",
  "risk",
  "new",
  "rest",
];

export const TRIAGE_LANE_META: Record<
  TriageLaneKey,
  { title: string; subtitle: string }
> = {
  userFeedback: {
    title: "Новая информация от пользователя",
    subtitle: "Заявки, по которым появилась новая информация от пользователя",
  },
  overdue: {
    title: "Просроченные",
    subtitle: "Контрольный срок уже нарушен",
  },
  risk: {
    title: "SLA риск",
    subtitle: "До контрольного срока осталось 4 часа или меньше",
  },
  new: {
    title: "Новые",
    subtitle: "Свежий поток заявок для первичного разбора",
  },
  rest: {
    title: "Остальные",
    subtitle: "Очередь без срочного SLA-сигнала",
  },
};

export const getTriageSlaLabel = (state: SlaState) => {
  if (state === "overdue") return "Проср.";
  if (state === "risk") return "Риск";
  return "В SLA";
};

export const getTriageSlaColor = (state: SlaState) => {
  if (state === "overdue") return "error";
  if (state === "risk") return "warning";
  return "success";
};

export const isTriageRequestNew = (request: RequestDTO) =>
  request.stateCode === "REGISTERED" ||
  request.stateCode === "INWORKGROUP_ASSIGNED";

export const getTriageRequestLane = (
  request: RequestDTO,
  nowDate: dayjs.Dayjs,
): TriageLaneKey => {
  const slaState = getEngineerRequestSlaState(request.targetDate, nowDate);

  if (slaState === "overdue") return "overdue";
  if (slaState === "risk") return "risk";
  if (isTriageRequestNew(request)) return "new";
  return "rest";
};

export const getTriageAttentionScore = (
  request: RequestDTO,
  nowDate: dayjs.Dayjs,
) => {
  const slaState = getEngineerRequestSlaState(request.targetDate, nowDate);
  const isNew = isTriageRequestNew(request);

  let score = 0;
  if (slaState === "overdue") score += 120;
  if (slaState === "risk") score += 90;
  if (request.priorityCode === "HIGH") score += 40;
  if (isNew) score += 25;
  return score;
};

export const requiresAttentionNow = (
  request: RequestDTO,
  nowDate: dayjs.Dayjs,
) => getTriageAttentionScore(request, nowDate) > 0;

export const getTriageFocusFilterLabel = (value: TriageFocusFilter) => {
  if (value === "overdue") return "Просроченные";
  if (value === "risk") return "SLA риск";
  if (value === "new") return "Новые";
  return "Вся очередь";
};

export type TriageLane = ReturnType<typeof getTriageRequestLane>;

export interface TriageRow {
  businessId: string;
  request: RequestDTO;
  baseLane: TriageLaneKey;
  lane: TriageLaneKey;
  isBumped: boolean;
  slaState: SlaState;
  compactSlaLabel: string;
  compactAgeValue: string;
  compactSlaColor: string;
  compactSlaFontWeight: number;
  workDurationText: string;
  targetDateMs: number;
  createdAtMs: number;
  backlogMs: number | null;
  backlogLabel: { name: string; color: string; tooltip: string } | null;
}

export interface TriageCounts {
  total: number;
  userFeedback: number;
  overdue: number;
  risk: number;
  new: number;
  rest: number;
}

export const applyTriageSearchFilters = ({
  requests,
  search,
  serviceFilter,
  workgroupFilter,
}: {
  requests: RequestDTO[];
  search: string;
  serviceFilter: string;
  workgroupFilter: string;
}): RequestDTO[] => {
  const normalizedSearch = search.trim().toLowerCase();

  return requests.filter((request) => {
    if (serviceFilter !== "all" && request.itService.id !== serviceFilter)
      return false;
    if (workgroupFilter !== "all" && request.workGroup.id !== workgroupFilter)
      return false;

    if (!normalizedSearch) return true;

    const haystack = [
      request.businessId,
      request.title,
      request.itService.name,
      request.configurationElement,
      getEngeneerName(request.initiator),
      getTerrbankFullName(request?.initiator?.subdivision?.terbank),
      getTerrbankShortName(request?.initiator?.subdivision?.terbank),
      request.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedSearch);
  });
};

export const buildTriageSummary = (
  requests: RequestDTO[],
  nowDate: dayjs.Dayjs,
) => {
  const buckets = buildLaneBuckets(requests, nowDate);

  return {
    overdue: buckets.overdue.length,
    risk: buckets.risk.length,
    fresh: buckets.new.length,
    rest: buckets.rest.length,
    high: requests.filter((request) => request.priorityCode === "HIGH").length,
    attention: requests.filter((request) =>
      requiresAttentionNow(request, nowDate),
    ).length,
  };
};

export const buildFilteredLaneBuckets = (
  rows: TriageRow[],
): Record<TriageLaneKey, TriageRow[]> => {
  const buckets: Record<TriageLaneKey, TriageRow[]> = {
    userFeedback: [],
    overdue: [],
    risk: [],
    new: [],
    rest: [],
  };

  for (const row of rows) {
    buckets[row.baseLane].push(row);
  }

  return buckets;
};

export const buildLaneBuckets = (
  requests: RequestDTO[],
  nowDate: dayjs.Dayjs,
): Record<TriageLaneKey, RequestDTO[]> => {
  const buckets: Record<TriageLaneKey, RequestDTO[]> = {
    userFeedback: [],
    overdue: [],
    risk: [],
    new: [],
    rest: [],
  };

  requests.forEach((request) => {
    buckets[getTriageRequestLane(request, nowDate)].push(request);
  });

  return buckets;
};

export function buildTriageRows(
  requests: RequestDTO[],
  nowDate: dayjs.Dayjs,
  bumpedIds: ReadonlySet<string>,
): {
  rows: TriageRow[];
  byLane: Record<TriageLaneKey, TriageRow[]>;
  counts: TriageCounts;
} {
  const byLane: Record<TriageLaneKey, TriageRow[]> = {
    userFeedback: [],
    overdue: [],
    risk: [],
    new: [],
    rest: [],
  };

  const counts: TriageCounts = {
    total: 0,
    userFeedback: 0,
    overdue: 0,
    risk: 0,
    new: 0,
    rest: 0,
  };

  const rows: TriageRow[] = new Array(requests.length);

  for (let i = 0; i < requests.length; i++) {
    const request = requests[i]!;
    const isBumped = bumpedIds.has(request.businessId);
    const baseLane = getTriageRequestLane(request, nowDate);
    const lane = isBumped ? "userFeedback" : baseLane;
    const slaState = getTriageRequestSlaState(request, nowDate);

    const compactSlaLabel = formatSlaDuration(request.targetDate, nowDate);
    const compactAgeValue = formatWorkElapsed(request.createdAt, nowDate);
    const workDurationText = formatWorkElapsed(request.createdAt, nowDate);

    const compactSlaColor =
      slaState === "overdue"
        ? "error.main"
        : slaState === "risk"
          ? "warning.main"
          : "text.secondary";
    const compactSlaFontWeight = slaState === "normal" ? 400 : 500;

    const backlogResult = getBacklogInfo(request.createdAt);
    const backlogMs = backlogResult ? backlogResult.backlogMs : null;
    const backlogLabel = backlogResult?.labelInfo ?? null;

    const row: TriageRow = {
      businessId: request.businessId,
      request,
      baseLane,
      lane,
      isBumped,
      slaState,
      compactSlaLabel,
      compactAgeValue,
      compactSlaColor,
      compactSlaFontWeight,
      workDurationText,
      targetDateMs: request.targetDate
        ? new Date(request.targetDate).getTime()
        : NaN,
      createdAtMs: request.createdAt
        ? new Date(request.createdAt).getTime()
        : NaN,
      backlogMs,
      backlogLabel,
    };

    rows[i] = row;
    byLane[baseLane].push(row);
    counts.total++;
    counts[baseLane]++;
  }

  return { rows, byLane, counts };
}

type RowSortComparator = (left: TriageRow, right: TriageRow) => number;

export function sortRows(
  rows: TriageRow[],
  bumpedIds: ReadonlySet<string>,
  customComparators: RowSortComparator[],
): TriageRow[] {
  const bumped: TriageRow[] = [];
  const rest: TriageRow[] = [];

  for (const row of rows) {
    if (bumpedIds.has(row.businessId)) {
      bumped.push(row);
    } else {
      rest.push(row);
    }
  }

  const bumpIndex = new Map<string, number>();
  bumpedIds.forEach((id, idx) => bumpIndex.set(id, idx));

  bumped.sort((a, b) => {
    const ia = bumpIndex.get(a.businessId) ?? 0;
    const ib = bumpIndex.get(b.businessId) ?? 0;
    return ib - ia;
  });

  const laneWeight = new Map<TriageLaneKey, number>();
  TRIAGE_LANE_ORDER.forEach((lane, idx) => laneWeight.set(lane, idx));

  rest.sort((left, right) => {
    const lw = laneWeight.get(left.lane) ?? 99;
    const rw = laneWeight.get(right.lane) ?? 99;
    if (lw !== rw) return lw - rw;

    for (const comp of customComparators) {
      const r = comp(left, right);
      if (r !== 0) return r;
    }

    return 0;
  });

  return [...bumped, ...rest];
}

function getTriageRequestSlaState(
  request: RequestDTO,
  nowDate: dayjs.Dayjs,
): SlaState {
  return getEngineerRequestSlaState(request.targetDate, nowDate);
}
