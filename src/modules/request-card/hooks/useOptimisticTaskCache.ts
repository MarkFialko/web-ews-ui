import { useEffect, useMemo, useState } from "react";
import {
  useLazyGetEmployeeByNumberQuery,
  useLazyEmployeePhotoQuery,
  useLazyEmployeeArmsQuery,
  useLazyAccessInfoQuery,
  useLazyLastTicketsQuery,
} from "../api";
import { getStorageProvider } from "@shared/cache/storage";
import { STORE_NAMES, type StoreName } from "@shared/cache/storeNames";
import { CACHE_TTL_HOURS } from "@shared/constants/cache";
import type { CacheEntry } from "@shared/types/cache";
import type {
  UserInfoResponse,
  EmployeeArmsInfo,
  UserAccessDto,
  TicketsResponse,
} from "../types";
import { useTriageRequests } from "@modules/triage/model";

const HOUR = CACHE_TTL_HOURS * 3_600_000;

type CachedData = {
  employee: UserInfoResponse | null;
  photo: string | null;
  arms: EmployeeArmsInfo | null;
  access: UserAccessDto[] | null;
  tickets: TicketsResponse | null;
};

const setRequestDataToStore = async (
  storeName: StoreName,
  taskId: string,
  data: CachedData[keyof CachedData],
) => {
  const p = getStorageProvider();

  p.setRecord(storeName, taskId, {
    value: data,
    cachedAt: Date.now(),
    ttlMs: HOUR,
  } satisfies CacheEntry<CachedData[keyof CachedData]>);
};

const isFresh = (entry: CacheEntry<CachedData[keyof CachedData]>) =>
  entry && Date.now() - entry.cachedAt < entry.ttlMs;

export function useOptimisticTaskCache(taskId: string) {
  const [checked, setChecked] = useState(false);

  const [cachedEmployee, setCachedEmployee] = useState<
    CachedData["employee"] | null
  >(null);
  const [cachedPhoto, setCachedPhoto] = useState<CachedData["photo"] | null>(
    null,
  );
  const [arms, setArms] = useState<CachedData["arms"] | null>(null);
  const [access, setAccess] = useState<CachedData["access"] | null>(null);
  const [tickets, setTickets] = useState<CachedData["tickets"] | null>(null);

  useEffect(() => {
    if (!taskId) return;

    (async () => {
      const p = getStorageProvider();
      const employeeEntry = await p.getRecord<
        CacheEntry<CachedData["employee"]>
      >(STORE_NAMES.REQUEST_EMPLOYEE, taskId);
      const photoEntry = await p.getRecord<CacheEntry<CachedData["photo"]>>(
        STORE_NAMES.REQUEST_PHOTO,
        taskId,
      );
      const armsEntry = await p.getRecord<CacheEntry<CachedData["arms"]>>(
        STORE_NAMES.REQUEST_ARMS,
        taskId,
      );
      const accessEntry = await p.getRecord<CacheEntry<CachedData["access"]>>(
        STORE_NAMES.REQUEST_ACCESS,
        taskId,
      );
      const ticketsEntry = await p.getRecord<CacheEntry<CachedData["tickets"]>>(
        STORE_NAMES.REQUEST_TICKETS,
        taskId,
      );

      const employeeData =
        employeeEntry && isFresh(employeeEntry) ? employeeEntry.value : null;
      setCachedEmployee(employeeData);

      const photoData =
        photoEntry && isFresh(photoEntry) ? photoEntry.value : null;
      setCachedPhoto(photoData);

      const armsData = armsEntry && isFresh(armsEntry) ? armsEntry.value : null;
      setArms(armsData);

      const accessData =
        accessEntry && isFresh(accessEntry) ? accessEntry.value : null;
      setAccess(accessData);

      const ticketsData =
        ticketsEntry && isFresh(ticketsEntry) ? ticketsEntry.value : null;
      setTickets(ticketsData);

      setChecked(true);
    })();
  }, [taskId]);

  const { triageRequests, refetch, isLoading } = useTriageRequests();

  const task = useMemo(
    () => triageRequests.find((r) => r.businessId === taskId) ?? null,
    [triageRequests, taskId],
  );

  const personalNumber = task?.initiator?.personalNumber ?? "";

  const [getEmployeeByNumber] = useLazyGetEmployeeByNumberQuery();
  const [getEmployeePhoto] = useLazyEmployeePhotoQuery();
  const [getEmployeeArms] = useLazyEmployeeArmsQuery();
  const [getEmployeeAccess] = useLazyAccessInfoQuery();
  const [getEmployeeTickets] = useLazyLastTicketsQuery();

  useEffect(() => {
    if (personalNumber && checked) {
      !cachedEmployee &&
        getEmployeeByNumber(personalNumber)
          .unwrap()
          .then((data) => {
            setRequestDataToStore(STORE_NAMES.REQUEST_EMPLOYEE, taskId, data);
            setCachedEmployee(data);
          });

      !cachedPhoto &&
        getEmployeePhoto(personalNumber)
          .unwrap()
          .then((data) => {
            setRequestDataToStore(
              STORE_NAMES.REQUEST_PHOTO,
              taskId,
              data.photoData,
            );
            setCachedPhoto(data.photoData);
          });

      !arms &&
        getEmployeeArms(personalNumber)
          .unwrap()
          .then((data) => {
            setRequestDataToStore(STORE_NAMES.REQUEST_ARMS, taskId, data);
            setArms(data);
          });

      !access &&
        getEmployeeAccess(personalNumber)
          .unwrap()
          .then((data) => {
            setRequestDataToStore(STORE_NAMES.REQUEST_ACCESS, taskId, data);
            setAccess(data);
          });

      !tickets &&
        getEmployeeTickets(personalNumber)
          .unwrap()
          .then((data) => {
            setRequestDataToStore(STORE_NAMES.REQUEST_TICKETS, taskId, data);
            setTickets(data);
          });
    }
  }, [personalNumber, checked, cachedEmployee]);

  return {
    taskData: task,
    employeeInfo: cachedEmployee ?? null,
    employeePhoto: cachedPhoto ?? null,
    employeeArms: arms ?? null,
    accessInfo: access ?? null,
    lastTickets: tickets ?? null,
    isCached: true,
    isLoading: !checked || isLoading,
    refetch: refetch,
  };
}
