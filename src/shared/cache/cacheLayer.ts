import { getStorageProvider } from "./storage";
import { CACHE_TTL_HOURS } from "@shared/constants/cache";
import type { CacheEntry } from "@shared/types/cache";

const MS_IN_HOUR = CACHE_TTL_HOURS * 3_600_000;

export function isCacheFresh<T>(
  entry: CacheEntry<T> | undefined,
): entry is CacheEntry<T> {
  if (!entry) return false;
  return Date.now() - entry.cachedAt < entry.ttlMs;
}

export async function getCached<T>(
  store: string,
  key: string,
): Promise<CacheEntry<T> | undefined> {
  const p = getStorageProvider();
  const raw = await p.getRecord<CacheEntry<T>>(store, key);
  return raw;
}

export async function setCached<T>(
  store: string,
  key: string,
  value: T,
  ttlMs = MS_IN_HOUR,
): Promise<void> {
  const p = getStorageProvider();
  await p.setRecord(store, key, {
    value,
    cachedAt: Date.now(),
    ttlMs,
  } satisfies CacheEntry<T>);
}

export async function setCachedPartial<T extends Record<string, unknown>>(
  store: string,
  key: string,
  partial: Partial<T>,
): Promise<void> {
  const p = getStorageProvider();
  await p.patchRecord<T>(store, key, partial);
}
