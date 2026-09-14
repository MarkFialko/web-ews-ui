import { useMemo, useRef, useEffect } from "react";
import { Box, Paper, IconButton, Tooltip, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { RequestDTO } from "@shared/request";

import { useTriageRows, useTriageScroll, useLastIncidents } from "./hooks";
import { useTriageFilterState } from "./hooks/useTriageFilterState";
import { CompactTriageRow, TriageListSkeleton, TriageSort } from "./components";

export type CompactTriageListProps = {
  requestId: string | null;
  viewedRequestIds?: string[];
  onSelectRequest: (request: RequestDTO) => void;
  /** Открыть чат для заявки по businessId (из метки "новое сообщение"). */
  onChat?: (businessId: string) => void;
};

const ROW_SIZE = 90;

export default function CompactTriageList({
  requestId,
  viewedRequestIds = [],
  onSelectRequest,
  onChat,
}: CompactTriageListProps) {
  const viewedRequestSet = useMemo(
    () => new Set(viewedRequestIds),
    [viewedRequestIds],
  );

  const filterState = useTriageFilterState();
  const { rows, isLoading } = useTriageRows();

  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_SIZE,
    getItemKey: (index) => rows[index]?.businessId ?? `stale-${index}`,
    overscan: 5,
  });

  const scroll = useTriageScroll(scrollRef, rows, virtualizer);

  const {
    sortKey,
    sortDirection,
    setSortKey,
    setSortDirection,
    resetState: handleClearFilters,
  } = filterState;

  const hasNonDefaultFilters = filterState.hasNonDefaultFilters;

  const { lastIncidentIds } = useLastIncidents();

  useEffect(() => {
    if (!requestId || !scrollRef.current) return;
    const idx = rows.findIndex((r) => r.businessId === requestId);
    if (idx >= 0) {
      virtualizer.scrollToIndex(idx, { align: "start", behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  return (
    <Paper
      variant="outlined"
      sx={{ height: "100%", display: "flex", flexDirection: "column", p: 0.75 }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={0.75}
        mb={0.5}
      >
        <TriageSort
          sortKey={sortKey}
          sortDirection={sortDirection}
          setSortKey={setSortKey}
          setSortDirection={setSortDirection}
        />
        {hasNonDefaultFilters && (
          <Tooltip title="Сбросить фильтры">
            <IconButton size="small" onClick={handleClearFilters}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        {isLoading ? (
          <TriageListSkeleton rowType="compact" />
        ) : (
          <Box
            ref={scrollRef}
            sx={{
              height: "100%",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <Box
              sx={{
                height: `${virtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const row = rows[virtualItem.index];
                if (!row) return null;

                const isActive = requestId === row.businessId;
                const isInHistory = lastIncidentIds.has(row.businessId);

                return (
                  <Box
                    key={row.businessId}
                    data-index={virtualItem.index}
                    ref={
                      scroll.isMeasureTarget(row.businessId)
                        ? scroll.measureTargetRef
                        : undefined
                    }
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualItem.start}px)`,
                      paddingBottom: "8px",
                      boxSizing: "border-box",
                    }}
                  >
                    <CompactTriageRow
                      businessId={row.businessId}
                      request={row.request}
                      isActive={isActive}
                      viewedRequestSet={viewedRequestSet}
                      onSelectRequest={onSelectRequest}
                      isInHistory={isInHistory}
                      slaColor={
                        row.slaState === "overdue"
                          ? "error"
                          : row.slaState === "risk"
                            ? "warning"
                            : "success"
                      }
                      compactSlaLabel={row.compactSlaLabel}
                      onChat={onChat}
                      activeChatIds={scroll.activeBusinessIds}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
