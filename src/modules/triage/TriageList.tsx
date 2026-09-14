import { useCallback, useMemo, useRef, useState } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import type {
  TriageFocusFilter,
  TriageLaneKey,
  TriageRow,
} from "./model/triageSelectors";
import type { TriageSortKey } from "./types";
import type { RequestDTO } from "@shared/request";

import { useTriageRows } from "./hooks";
import { useTriageFilterState } from "./hooks/useTriageFilterState";
import { useChatNotificationContext } from "./hooks/useChatNotificationContext";
import {
  EmptyState,
  ListControls,
  RequestRow,
  TriageFilters,
  TriageListSkeleton,
} from "./components";
import {
  ESM_BUSINESS_ID_PATTERN,
  ESTIMATED_COLLAPSED_CARD_HEIGHT,
} from "./constants";
import { useTriageListStatus } from "./types";
import { useVirtualizer } from "@tanstack/react-virtual";

export type TriageListProps = {
  activeRequestId?: string | null;
  knowledgeBaseRequestIds?: string[];
  viewedRequestIds?: string[];
  onOpenRequest?: (request: RequestDTO) => void;
  onChat?: (businessId: string) => void;
};

export default function TriageList({
  activeRequestId,
  knowledgeBaseRequestIds = [],
  onOpenRequest,
  onChat,
}: TriageListProps) {
  const { focusFilter, setFocusFilter, filterOptions } = useTriageListState();
  const chatNotification = useChatNotificationContext();

  const { rows, byLane, counts, isFetching, isLoading, hasServerError } =
    useTriageRows();

  const {
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    isTransitioning,
  } = filterOptions;

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const handleToggleExpand = useCallback((businessId: string) => {
    setExpandedId((prev) => (prev === businessId ? null : businessId));
  }, []);

  const focusedRows = useMemo(() => {
    if (focusFilter === "all") return rows;
    return byLane[focusFilter] as ReadonlyArray<TriageRow>;
  }, [focusFilter, rows, byLane]);

  const displayLaneCounts = useMemo(() => {
    const counts = new Map<TriageLaneKey, number>();
    for (const row of focusedRows) {
      const eff = focusFilter === "all" ? row.lane : row.baseLane;
      counts.set(eff, (counts.get(eff) ?? 0) + 1);
    }
    return counts;
  }, [focusedRows, focusFilter]);

  const enrichedCacheRef = useRef<Record<string, Row>>({});

  const enriched = useMemo(() => {
    const currentIds = new Set(focusedRows.map((r) => r.businessId));
    for (const id in enrichedCacheRef.current) {
      if (!currentIds.has(id)) {
        delete enrichedCacheRef.current[id];
      }
    }

    const seen = new Set<TriageLaneKey>();
    const result: Row[] = [];

    for (const row of focusedRows) {
      const displayLane = focusFilter === "all" ? row.lane : row.baseLane;
      const isFirst = !seen.has(displayLane);
      seen.add(displayLane);

      let enrichedRow = enrichedCacheRef.current[row.businessId];
      if (!enrichedRow) {
        enrichedRow = {
          ...row,
          isActive: false,
          isExpanded: false,
          isFirstInLane: isFirst,
          lane: displayLane,
        };
        enrichedCacheRef.current[row.businessId] = enrichedRow;
      }

      enrichedRow.isActive = activeRequestId === row.businessId;
      enrichedRow.isExpanded = expandedId === row.businessId;
      enrichedRow.isFirstInLane = isFirst;
      enrichedRow.lane = displayLane;
      enrichedRow.backlogLabel = row.backlogLabel;
      enrichedRow.backlogMs = row.backlogMs;

      result.push(enrichedRow);
    }

    return result;
  }, [focusedRows, activeRequestId, expandedId, focusFilter]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: enriched.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_COLLAPSED_CARD_HEIGHT,
    getItemKey: (index) => enriched[index]?.businessId ?? `stale-${index}`,
    overscan: 5,
  });

  const isEsmMatch =
    focusedRows.length === 0 &&
    ESM_BUSINESS_ID_PATTERN.test(filterOptions.search);

  const kbSet = useMemo(
    () => new Set(knowledgeBaseRequestIds),
    [knowledgeBaseRequestIds],
  );

  const hasDataRef = useRef(false);
  if (counts.total > 0 || enriched.length > 0 || isLoading === false) {
    hasDataRef.current = true;
  }

  const listStatus = useTriageListStatus({
    isFetching,
    isTransitioning,
    length: focusedRows.length,
    hasEverLoaded: hasDataRef.current,
    hasServerError,
  });

  const handleOpenRequest = useCallback(
    (businessId: string) => {
      const row = enriched.find((r) => r.businessId === businessId);
      if (row?.request) onOpenRequest?.(row.request);
    },
    [enriched, onOpenRequest],
  );

  const handleSetFocusFilter = useCallback(
    (filter: TriageFocusFilter) => setFocusFilter(filter),
    [setFocusFilter],
  );

  const handleToggleFocus = useCallback(
    (nextFilter: TriageFocusFilter) => {
      const next =
        focusFilter === nextFilter ? ("all" as TriageFocusFilter) : nextFilter;
      setFocusFilter(next);
    },
    [focusFilter, setFocusFilter],
  );

  const hasNonDefaultFilters = filterOptions.hasNonDefaultFilters;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.25, md: 1.5 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack
        spacing={1}
        sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6">Очередь</Typography>

        <TriageFilters
          filterOptions={filterOptions}
          showEsmButton={isEsmMatch}
        />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              overflow: "hidden",
            }}
          >
            <ListControls
              sortOptions={{
                sortKey: sortKey as TriageSortKey,
                setSortKey: setSortKey,
                sortDirection,
                setSortDirection: setSortDirection,
              }}
              focusFilter={focusFilter}
              summary={{ ...counts, fresh: counts.new, rest: counts.rest }}
              totalCount={counts.total}
              onSetFocusFilter={handleSetFocusFilter}
              onToggleFocus={handleToggleFocus}
              hasNonDefaultFilters={hasNonDefaultFilters}
              onResetFilters={filterOptions.resetState}
            />

            <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
              {listStatus.kind === "initial-loading" ||
              listStatus.kind === "pending" ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, bottom: 0,
                    overflow: "auto",
                  }}
                >
                  <Stack spacing={1} sx={{ p: 1 }}>
                    <TriageListSkeleton rowType="request" />
                  </Stack>
                </Box>
              ) : listStatus.kind === "empty" ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, bottom: 0,
                    overflow: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EmptyState isEsmMatch={isEsmMatch} />
                </Box>
              ) : (
                <Box
                  ref={scrollRef}
                  sx={{
                    overflowY: "auto",
                    height: "100%",
                    position: "absolute",
                    top: 0, left: 0, right: 0, bottom: 0,
                  }}
                >
                  <Box
                    sx={{
                      height: `${virtualizer.getTotalSize()}px`,
                      position: "relative",
                    }}
                  >
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                      const row = enriched[virtualItem.index];
                      if (!row) return null;

                      return (
                        <Box
                          key={row.businessId}
                          data-index={virtualItem.index}
                          ref={virtualizer.measureElement}
                          sx={{
                            position: "absolute",
                            top: 0, left: 0, width: "100%",
                            transform: `translateY(${virtualItem.start}px)`,
                            paddingBottom: "8px",
                            px: 1,
                          }}
                        >
                          <RequestRow
                            businessId={row.businessId}
                            title={row.request.title}
                            stateCode={row.request.stateCode}
                            slaState={row.slaState}
                            isHighlighted={row.isActive}
                            compactSlaLabel={row.compactSlaLabel}
                            compactAgeValue={row.compactAgeValue}
                            compactSlaColor={row.compactSlaColor}
                            compactSlaFontWeight={row.compactSlaFontWeight}
                            itServiceName={row.request.itService.name}
                            configurationElement={
                              row.request.configurationElement
                            }
                            initiator={row.request.initiator}
                            labels={row.request.labels}
                            tags={row.request.tags}
                            active={row.isActive}
                            isDraft={false}
                            hasKnowledgeBase={kbSet.has(row.businessId)}
                            expanded={row.isExpanded}
                            onToggle={handleToggleExpand}
                            onOpenRequest={handleOpenRequest}
                            isFirstInLane={row.isFirstInLane}
                            lane={row.lane}
                            laneCount={displayLaneCounts.get(row.lane) ?? 0}
                            request={row.request}
                            workDurationText={row.workDurationText}
                            onChat={onChat}
                            activeChatIds={chatNotification?.activeBusinessIds}
                            backlogLabel={row.backlogLabel}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Stack>
    </Paper>
  );
}

function useTriageListState() {
  const [focusFilter, setFocusFilter] = useState<TriageFocusFilter>("all");
  const filterState = useTriageFilterState();

  return {
    focusFilter,
    setFocusFilter,
    filterOptions: filterState,
  };
}

type Row = TriageRow & {
  isActive: boolean;
  isExpanded: boolean;
  isFirstInLane: boolean;
};
