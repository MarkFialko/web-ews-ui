import { useRef, useLayoutEffect, useEffect } from "react";
import type { Virtualizer } from "@tanstack/react-virtual";
import { useChatNotificationContext } from "./useChatNotificationContext";

export function useTriageScroll(
  scrollRef: React.RefObject<HTMLDivElement | null>,
  rows: ReadonlyArray<{ businessId: string }>,
  virtualizer: Virtualizer<HTMLElement, Element>,
) {
  const chatNotification = useChatNotificationContext();
  const measureTargetRef = useRef<HTMLElement | null>(null);
  const dismissTargetRef = useRef<string | null>(null);

  const unregisterScroll = chatNotification?.registerScrollHandler?.(
    "compact-triage",
    (businessId: string) => {
      dismissTargetRef.current = businessId;
    },
  );

  useEffect(() => {
    return () => unregisterScroll?.();
  }, [unregisterScroll]);

  useLayoutEffect(() => {
    const target = dismissTargetRef.current;
    if (!target || !scrollRef.current) return;

    const idx = rows.findIndex((r) => r.businessId === target);
    if (idx < 0 || idx >= rows.length) {
      dismissTargetRef.current = null;
      return;
    }

    const el = measureTargetRef.current;
    if (el) {
      virtualizer.measureElement(el);
    }
    virtualizer.scrollToIndex(idx, { align: "start", behavior: "smooth" });
    dismissTargetRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, virtualizer]);

  return {
    measureTargetRef,
    scrollRef,
    isMeasureTarget: (businessId: string) =>
      dismissTargetRef.current === businessId,
    activeBusinessIds: chatNotification?.activeBusinessIds,
  };
}
