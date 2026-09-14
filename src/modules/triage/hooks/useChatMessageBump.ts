import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGetUnreadChatNotificationsQuery } from "../api/notification";
import { useTriageBumpProvider } from "./useTriageBump";
import { useAppNotifications } from "@shared/notifications";
import type { WebEwsUnreadNotification } from "../types";
import type { RequestDTO } from "@shared/request";
import { isRequestVisibleForEngineer } from "@shared/utils/helpers";

const POLLING_INTERVAL_MS = 10_000;
const FIRST_POLL_DELAY_MS = 5_000;

/** Включить для локального теста конверта без живого бэка. */
const USE_CHAT_BUMP_MOCK = false;

export function useChatMessageBump({
  triageRequests = [],
  employeeNumber,
}: {
  triageRequests?: RequestDTO[];
  employeeNumber?: string | null;
} = {}) {
  const { bumpToTop, clearBump, bumpIds } = useTriageBumpProvider();
  const { notifyInfo } = useAppNotifications();
  const prevIds = useRef<Set<string>>(new Set());
  const idMapRef = useRef<Map<string, number>>(new Map());
  const notifiedMessageIds = useRef<Set<number>>(new Set());

  const dismissedMessageIds = useRef<Set<number>>(new Set());
  const [dismissedVersion, setDismissedVersion] = useState(0);

  const [firstFetchDelayed, setFirstFetchDelayed] = useState(true);

  const visibleRequestsIndex = useMemo(() => {
    const map = new Map<string, RequestDTO>();
    if (employeeNumber) {
      for (const request of triageRequests) {
        if (isRequestVisibleForEngineer(request, employeeNumber)) {
          map.set(request.businessId, request);
        }
      }
    }
    return map;
  }, [triageRequests, employeeNumber]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFirstFetchDelayed(false);
    }, FIRST_POLL_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const { data } = useGetUnreadChatNotificationsQuery(undefined, {
    pollingInterval: POLLING_INTERVAL_MS,
    skip: firstFetchDelayed,
  });

  const mockNotifications = useMemo<WebEwsUnreadNotification[]>(() => {
    if (!USE_CHAT_BUMP_MOCK) return [];
    return [
      {
        id: 1,
        title: "INC0000573947",
        type: "chat",
        bodyHtml: "",
        displayType: "WebEws",
        createTimestamp: Date.now(),
        authorSmId: "test-author",
        showTimeSec: 60,
        lifetimeSec: 300,
      },
    ];
  }, []);

  const notifications = useMemo(
    () => (USE_CHAT_BUMP_MOCK ? mockNotifications : (data ?? [])),
    [data, mockNotifications],
  );

  const businessIdToMessageId = useMemo(() => {
    const map = new Map<string, number>();
    for (const n of notifications) {
      map.set(n.title, n.id);
    }
    return map;
  }, [notifications]);

  useEffect(() => {
    const currentIds = new Set<string>();

    for (const n of notifications) {
      const businessId = n.title;
      currentIds.add(businessId);

      if (employeeNumber && !visibleRequestsIndex.has(businessId)) {
        continue;
      }

      if (!dismissedMessageIds.current.has(n.id)) {
        bumpToTop([businessId]);
      }
      idMapRef.current.set(businessId, n.id);

      if (!notifiedMessageIds.current.has(n.id)) {
        notifiedMessageIds.current.add(n.id);
        notifyInfo(`Новые сообщения от пользователя по заявке ${businessId}`);
      }
    }

    for (const prevId of prevIds.current) {
      if (!currentIds.has(prevId)) {
        clearBump([prevId]);
        idMapRef.current.delete(prevId);
      }
    }

    prevIds.current = currentIds;
  }, [
    notifications,
    bumpToTop,
    clearBump,
    notifyInfo,
    visibleRequestsIndex,
    employeeNumber,
  ]);

  const activeBusinessIds = useMemo(
    () => {
      const result = new Set<string>();
      for (const businessId of bumpIds) {
        const messageId = businessIdToMessageId.get(businessId);
        if (messageId == null || !dismissedMessageIds.current.has(messageId)) {
          result.add(businessId);
        }
      }
      return result as ReadonlySet<string>;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bumpIds, dismissedVersion],
  );

  const resolveMessageId = useCallback(
    (businessId: string): number | undefined => {
      return idMapRef.current.get(businessId);
    },
    [],
  );

  const removeBusinessId = useCallback((businessId: string) => {
    idMapRef.current.delete(businessId);
  }, []);

  const dismissMessage = useCallback((messageId: number) => {
    dismissedMessageIds.current.add(messageId);
    setDismissedVersion((v) => v + 1);
  }, []);

  return {
    activeBusinessIds,
    resolveMessageId,
    removeBusinessId,
    clearBump: clearBump,
    dismissMessage,
  };
}
