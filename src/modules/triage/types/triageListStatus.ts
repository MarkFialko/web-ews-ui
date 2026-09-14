export type TriageListStatus =
  | { kind: "initial-loading" }
  | { kind: "pending"; hasData: boolean }
  | { kind: "empty" }
  | { kind: "ready" };

interface UseTriageListStatusArgs {
  isFetching: boolean;
  isTransitioning: boolean;
  length: number;
  hasEverLoaded: boolean;
  hasServerError: boolean;
}

export function useTriageListStatus({
  isFetching,
  isTransitioning,
  length,
  hasEverLoaded,
  hasServerError,
}: UseTriageListStatusArgs): TriageListStatus {
  if (isTransitioning) return { kind: "pending", hasData: length > 0 };
  if (!hasEverLoaded && !hasServerError) return { kind: "initial-loading" };
  if (hasServerError && length === 0 && !hasEverLoaded) {
    return { kind: "empty" };
  }
  if (isFetching) return { kind: length > 0 ? "ready" : "empty" };
  if (length === 0) return { kind: "empty" };
  return { kind: "ready" };
}
