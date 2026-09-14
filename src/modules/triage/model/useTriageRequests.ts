import { useEffect, useState } from "react";
import { useGetTriageRequestsQuery } from "../api";
import { getStorageProvider, STORE_NAMES } from "@shared/cache";
import { isCacheFresh } from "@shared/cache/cacheLayer";
import type { CacheEntry } from "@shared/types/cache";
import type { RequestDTO } from "@shared/request";

import { useUser } from "@shared/user";

const CACHE_KEY = "triage";

export const useTriageRequests = () => {
  const [cachedData, setCachedData] = useState<RequestDTO[] | undefined>(
    undefined,
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const p = getStorageProvider();
      const entry = await p.getRecord<CacheEntry<RequestDTO[]>>(
        STORE_NAMES.TRIAGE,
        CACHE_KEY,
      );
      if (!cancelled && entry && isCacheFresh(entry)) {
        setCachedData(entry.value);
      } else if (!cancelled) {
        setCachedData(undefined);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { user } = useUser();

  const employeeNumber = user?.employeeNumber ?? null;

  const queryResult = useGetTriageRequestsQuery(employeeNumber!, {
    skip: !employeeNumber,
    pollingInterval: 60_000,
  });

  const serverData = (queryResult.data ?? []) as RequestDTO[];
  const hasServerData = queryResult.isSuccess && serverData.length > 0;
  const hasServerError = queryResult.isError;
  const isFetching = queryResult.isFetching;

  const isLoadingInitial = !hasServerData && !queryResult.isSuccess;

  let triageRequests: RequestDTO[];

  if (hasServerData) {
    triageRequests = serverData;
  } else if (isFetching) {
    triageRequests = isLoadingInitial ? [] : serverData;
  } else if (hasServerError && cachedData) {
    triageRequests = cachedData;
  } else {
    triageRequests = [];
  }

  return {
    triageRequests,
    isLoading: isLoadingInitial,
    isFetching,
    hasServerError,
  } as const;
};
