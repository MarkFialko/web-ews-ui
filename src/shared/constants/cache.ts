export const CACHE_TTL_HOURS = Number(
  import.meta.env.VITE_CACHE_TTL_HOURS ?? 1,
);
export const CACHE_TTL_TRIAGE_MS = Number(
  import.meta.env.VITE_CACHE_TTL_TRIAGE_MS ?? 60 * 60 * 1_000,
);
export const POLL_INTERVAL_MS = Number(
  import.meta.env.VITE_POLL_INTERVAL_MS ?? 2_000,
);
export const POLL_MAX_ATTEMPTS = Number(
  import.meta.env.VITE_POLL_MAX_ATTEMPTS ?? 15,
);
