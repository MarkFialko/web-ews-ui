export interface CacheEntry<T> {
  value: T;
  cachedAt: number;
  ttlMs: number;
}
