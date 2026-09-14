import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type FilterState = {
  search: string;
  serviceFilter: string;
  workgroupFilter: string;
  sortKey: "targetDate" | "createdAt" | "backlog";
  sortDirection: "asc" | "desc";
};

const STORAGE_KEYS = {
  search: "triage_search",
  serviceFilter: "triage_service_filter",
  workgroupFilter: "triage_workgroup_filter",
  sortKey: "triage_sort_key",
  sortDirection: "triage_sort_direction",
} as const;

const DEFAULTS: FilterState = {
  search: "",
  serviceFilter: "all",
  workgroupFilter: "all",
  sortKey: "targetDate",
  sortDirection: "asc",
};

function readStorage<T extends keyof FilterState>(
  key: string,
  fallback: FilterState[T],
): FilterState[T] {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as FilterState[T]) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T extends keyof FilterState>(
  key: string,
  value: FilterState[T],
): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Игнорируем ошибки записи
  }
}

const initSearch = readStorage(STORAGE_KEYS.search, DEFAULTS.search);
const initServiceFilter = readStorage(
  STORAGE_KEYS.serviceFilter,
  DEFAULTS.serviceFilter,
);
const initWorkgroupFilter = readStorage(
  STORAGE_KEYS.workgroupFilter,
  DEFAULTS.workgroupFilter,
);
const initSortKey = readStorage(STORAGE_KEYS.sortKey, DEFAULTS.sortKey);
const initSortDirection = readStorage(
  STORAGE_KEYS.sortDirection,
  DEFAULTS.sortDirection,
);

type FilterStore = {
  state: FilterState;
  version: number;
};

const store: FilterStore = {
  state: {
    search: initSearch,
    serviceFilter: initServiceFilter,
    workgroupFilter: initWorkgroupFilter,
    sortKey: initSortKey,
    sortDirection: initSortDirection,
  },
  version: 0,
};

const listeners: Set<() => void> = new Set();

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
};

const notify = () => {
  store.version++;
  for (const listener of listeners) {
    listener();
  }
};

const setSearch = (value: string) => {
  store.state.search = value;
  writeStorage(STORAGE_KEYS.search, value);
  notify();
};

const setServiceFilter = (value: string) => {
  store.state.serviceFilter = value;
  writeStorage(STORAGE_KEYS.serviceFilter, value);
  notify();
};

const setWorkgroupFilter = (value: string) => {
  store.state.workgroupFilter = value;
  writeStorage(STORAGE_KEYS.workgroupFilter, value);
  notify();
};

const setSortKey = (value: "targetDate" | "createdAt" | "backlog") => {
  store.state.sortKey = value;
  writeStorage(STORAGE_KEYS.sortKey, value);
  notify();
};

const setSortDirection = (value: "asc" | "desc") => {
  store.state.sortDirection = value;
  writeStorage(STORAGE_KEYS.sortDirection, value);
  notify();
};

const resetState = () => {
  for (const key of Object.values(STORAGE_KEYS)) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* noop */
    }
  }
  store.state = { ...DEFAULTS };
  notify();
};

export function useTriageFilterState() {
  useSyncExternalStore(
    subscribe,
    () => store.version,
    () => 0,
  );

  const isTransitioningRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isTransitioningRef.current) return;
    isTransitioningRef.current = false;
    setIsTransitioning(false);
  });

  const hasNonDefaultFilters =
    store.state.search !== "" ||
    store.state.serviceFilter !== "all" ||
    store.state.workgroupFilter !== "all";

  return {
    search: store.state.search,
    setSearch: (value: string) => {
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setSearch(value);
    },
    serviceFilter: store.state.serviceFilter,
    setServiceFilter: (value: string) => {
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setServiceFilter(value);
    },
    workgroupFilter: store.state.workgroupFilter,
    setWorkgroupFilter: (value: string) => {
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setWorkgroupFilter(value);
    },
    sortKey: store.state.sortKey,
    setSortKey: (value: "targetDate" | "createdAt" | "backlog") => {
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setSortKey(value);
    },
    sortDirection: store.state.sortDirection,
    setSortDirection: (value: "asc" | "desc") => {
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setSortDirection(value);
    },
    resetState: () => {
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      resetState();
    },
    hasNonDefaultFilters,
    isTransitioning,
  };
}

export { store };
