import { useEffect } from "react";
import { getStorageProvider } from "@shared/cache/storage";
import { STORE_NAMES } from "@shared/cache/storeNames";
import { POLL_INTERVAL_MS, POLL_MAX_ATTEMPTS } from "@shared/constants/cache";

/**
 * При старте приложения сканирует pendingOps в IndexedDB
 * и запускает polling для незавершённых операций.
 */
export function useTaskCacheInit() {
  useEffect(() => {
    (async () => {
      try {
        const p = getStorageProvider();
        const polls = await p.getAllRecords<{ taskId: string; done: boolean }>(
          STORE_NAMES.PENDING_OPS,
        );

        for (const record of polls) {
          const taskId = record.value?.taskId;
          if (!taskId || record.value.done) continue;

          let attempts = 0;
          const iv = setInterval(async () => {
            attempts++;
            try {
              const entry = await p.getRecord<{ done: boolean }>(
                STORE_NAMES.PENDING_OPS,
                `poll-${taskId}`,
              );
              if (entry?.done || attempts >= POLL_MAX_ATTEMPTS) {
                clearInterval(iv);
                await p.deleteRecord(STORE_NAMES.PENDING_OPS, `poll-${taskId}`);
              }
            } catch {
              /** ignore */
            }
          }, POLL_INTERVAL_MS);
        }
      } catch {
        /** IndexedDB недоступен */
      }
    })();
  }, []);
}
