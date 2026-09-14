import { useCallback, useEffect, useRef, useState } from "react";

import { getStorageProvider } from "@shared/cache/storage";
import { STORE_NAMES } from "@shared/cache/storeNames";
import type { InteractionDirection } from "@sber-scpl/core/jssdk";

/** Тип звонка */
export type CallType = InteractionDirection | "missed";

/** Запись в историю звонков */
export interface CallRecord {
  id: string;
  timestamp: number;
  callType: CallType;
  phoneNumber: string;
}

const MAX_RECORDS = 20;
const STORE_NAME = STORE_NAMES.CALL_HISTORY;
const CALLS_KEY = "_all_calls_";
const CHANNEL_NAME = "call_history_sync";

/** Получить массив записей из IDB */
async function getCalls(): Promise<CallRecord[]> {
  try {
    const provider = getStorageProvider();
    const all = await provider.getRecord<CallRecord[]>(STORE_NAME, CALLS_KEY);
    return all ?? [];
  } catch {
    return [];
  }
}

/** Сохранить массив записей в IDB */
async function setCalls(all: CallRecord[]): Promise<void> {
  try {
    const provider = getStorageProvider();
    await provider.setRecord(STORE_NAME, CALLS_KEY, all);
  } catch {
    // игнорируем ошибки
  }
}

/** Сгенерировать уникальный ID */
function generateCallId(): string {
  return `call_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Хук для работы с историей звонков в IndexedDB.
 *
 * @returns `[records, addCall]` — список записей и функция для добавления.
 *
 * @example
 * ```tsx
 * function CallHistory() {
 *   const [records, addCall] = useCallHistory();
 *
 *   const handleCall = () => {
 *     addCall("outbound", "+79164821504");
 *   };
 *
 *   return (
 *     <CTIList
 *       title="История вызовов"
 *       rows={records.map((r) => [
 *         r.phoneNumber,
 *         formatTimestamp(r.timestamp),
 *         r.phoneNumber,
 *         r.callType,
 *       ])}
 *       onSelect={(value) => console.log(value)}
 *       showDirection
 *     />
 *   );
 * }
 * ```
 */
export function useCallHistory(): [
  CallRecord[],
  (callType: CallType, phoneNumber: string) => void,
] {
  const [records, setRecords] = useState<CallRecord[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);

  /** Загрузка записей из IDB */
  const loadCalls = useCallback(async () => {
    const calls = await getCalls();
    setRecords(calls);
  }, []);

  // Загружаем при монтировании
  useEffect(() => {
    void loadCalls();
  }, [loadCalls]);

  // Настройка BroadcastChannel для синхронизации между экземплярами
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = () => {
      void loadCalls();
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [loadCalls]);

  /** Добавить запись в историю */
  const addCall = useCallback((callType: CallType, phoneNumber: string) => {
    const record: CallRecord = {
      id: generateCallId(),
      timestamp: Date.now(),
      callType,
      phoneNumber,
    };

    void (async () => {
      const all = await getCalls();
      all.unshift(record);
      if (all.length > MAX_RECORDS) {
        all.length = MAX_RECORDS;
      }
      await setCalls(all);
      setRecords(all);

      // Уведомляем другие экземпляры об изменении
      channelRef.current?.postMessage("updated");
    })();
  }, []);

  return [records, addCall];
}
