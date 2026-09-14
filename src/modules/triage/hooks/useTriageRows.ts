import { useMemo } from "react";
import type { TriageLaneKey, TriageRow } from "../model/triageSelectors";
import {
  buildTriageRows,
  buildFilteredLaneBuckets,
  sortRows,
  applyTriageSearchFilters,
} from "../model/triageSelectors";

import { useNowTick } from "./useNowTick";
import { useTriageRequests } from "../model";
import { useTriageBumpProvider } from "./useTriageBump";
import { store as filterStore } from "./useTriageFilterState";

export function useTriageRows() {
  const {
    triageRequests,
    isLoading,
    isFetching,
    isError: hasServerError,
  } = useTriageRequests();
  const nowDate = useNowTick();
  const bump = useTriageBumpProvider();

  const { search, serviceFilter, workgroupFilter } = filterStore.state;
  const { sortKey, sortDirection } = filterStore.state;

  const filteredRequests = useMemo(
    () =>
      applyTriageSearchFilters({
        requests: triageRequests,
        search,
        serviceFilter,
        workgroupFilter,
      }),
    [triageRequests, search, serviceFilter, workgroupFilter],
  );

  const { rows, counts } = useMemo(
    () => buildTriageRows(filteredRequests, nowDate, bump.bumpIds),
    [filteredRequests, nowDate, bump.bumpIds],
  );

  const sortedRows = useMemo(
    () =>
      sortRows(rows, bump.bumpIds, [
        (left, right) => {
          if (sortKey === "backlog") {
            const leftVal = left.backlogMs ?? Infinity;
            const rightVal = right.backlogMs ?? Infinity;
            if (leftVal < rightVal) return sortDirection === "asc" ? -1 : 1;
            if (leftVal > rightVal) return sortDirection === "asc" ? 1 : -1;
            return 0;
          }

          const leftVal =
            sortKey === "targetDate" ? left.targetDateMs : left.createdAtMs;
          const rightVal =
            sortKey === "targetDate" ? right.targetDateMs : right.createdAtMs;

          if (leftVal < rightVal) return sortDirection === "asc" ? -1 : 1;
          if (leftVal > rightVal) return sortDirection === "asc" ? 1 : -1;
          return 0;
        },
      ]),
    [rows, bump.bumpIds, sortKey, sortDirection],
  );

  const sortedByLane = useMemo(
    () => buildFilteredLaneBuckets(sortedRows),
    [sortedRows],
  );

  return {
    rows: sortedRows as ReadonlyArray<TriageRow>,
    byLane: sortedByLane,
    counts,
    isLoading,
    isFetching,
    bumpToTop: bump.bumpToTop,
    clearBump: bump.clearBump,
    hasServerError,
  } as const;
}

export function useTriageRowsByLane(
  lane: TriageLaneKey,
): ReadonlyArray<TriageRow> {
  const { byLane } = useTriageRows();
  return byLane[lane] as ReadonlyArray<TriageRow>;
}
