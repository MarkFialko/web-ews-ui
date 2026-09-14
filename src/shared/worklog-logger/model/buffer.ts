import type { BufferedWorklogEvent } from "../types/BufferedWorklogEvent";
import { getStorageProvider } from "@shared/cache";
import {
  WORKLOG_STORE_NAME,
  WORKLOG_MAX_BUFFER_SIZE,
  WORKLOG_MAX_BATCH_SIZE,
} from "../constants/limits";
import { getWorklogSender } from "./worklogSender";

let isSending = false;

/**
 * Поместить событие в буфер IndexedDB. Fire-and-forget, ошибки не пробрасываем.
 * Обрезка до WORKLOG_MAX_BUFFER_SIZE выполняется только при записи нового
 * события и удаляет самые старые записи.
 */
export async function enqueue(
  event: Omit<BufferedWorklogEvent, "key">,
): Promise<void> {
  const provider = getStorageProvider();
  const key = String(Date.now() + Math.random());
  const record: BufferedWorklogEvent = {
    ...event,
    key,
  };

  const all =
    await provider.getAllRecords<BufferedWorklogEvent>(WORKLOG_STORE_NAME);
  if (all.length >= WORKLOG_MAX_BUFFER_SIZE) {
    const sorted = [...all].sort(
      (a, b) => parseInt(a.key, 10) - parseInt(b.key, 10),
    );
    const toDelete = sorted.slice(0, sorted.length - WORKLOG_MAX_BUFFER_SIZE);
    await Promise.all(
      toDelete.map((r) => provider.deleteRecord(WORKLOG_STORE_NAME, r.key)),
    );
  }

  await provider.setRecord(WORKLOG_STORE_NAME, key, record);

  if (all.length + 1 >= WORKLOG_MAX_BATCH_SIZE) {
    flush().catch(() => undefined);
  }
}

/**
 * Изъять до limit самых старых записей из буфера (claim).
 * Пачка изымается из хранилища до отправки: бэкенд не дедуплицирует, вкладок
 * может быть несколько, флаг isSending живёт в памяти одной вкладки.
 *
 * Если исход drop — пачка не возвращается: повтор невалидной пачки заблокирует
 * буфер навсегда.
 */
export async function claimBatch(
  limit: number,
): Promise<BufferedWorklogEvent[]> {
  const provider = getStorageProvider();
  const all =
    await provider.getAllRecords<BufferedWorklogEvent>(WORKLOG_STORE_NAME);

  const events: BufferedWorklogEvent[] = all.map((r) => r.value);
  const toClaim = events.slice(0, limit);
  const toKeep = events.slice(limit);

  await Promise.all(
    toClaim.map((e) => provider.deleteRecord(WORKLOG_STORE_NAME, e.key)),
  );
  await Promise.all(
    toKeep.map((e) => provider.setRecord(WORKLOG_STORE_NAME, e.key, e)),
  );

  return toClaim;
}

/** Вернуть пачку в буфер, сохранив исходный порядок (старые первыми). */
export async function returnToStore(
  events: BufferedWorklogEvent[],
): Promise<void> {
  if (events.length === 0) return;

  const provider = getStorageProvider();
  for (const event of events) {
    await provider.setRecord(WORKLOG_STORE_NAME, event.key, event);
  }
}

/**
 * Отправить одну пачку событий. Ошибки наружу не пробрасываются.
 */
export async function flush(options?: { keepalive?: boolean }): Promise<void> {
  const sender = getWorklogSender();
  if (isSending || !sender) return;

  isSending = true;

  let claimed: BufferedWorklogEvent[] = [];

  try {
    claimed = await claimBatch(WORKLOG_MAX_BATCH_SIZE);

    if (claimed.length === 0) {
      return;
    }

    const outcome = await sender(
      // Все поля обязательны по контракту и проставлены в useWorklogLogger:
      // подставлять значения за буфером больше не нужно.
      claimed.map((item) => ({
        createdAt: item.createdAt,
        task: item.task,
        engineer: item.engineer,
        engineerName: item.engineerName,
        department: item.department,
        comment: item.comment,
        action: item.action,
        source: item.source,
      })),
      { keepalive: options?.keepalive },
    );

    if (outcome === "retry") {
      await returnToStore(claimed);
      return;
    }
  } catch {
    if (claimed.length > 0) {
      await returnToStore(claimed).catch(() => undefined);
    }
  } finally {
    isSending = false;
  }
}
