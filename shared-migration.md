# Миграция папки `src/shared/`

> Полная структура, названия файлов и код для миграции общей папки проекта WebEWS UI.

---

## Структура папок

```
src/shared/
├── api/
│   ├── baseApi.ts
│   ├── extractErrorMessage.ts
│   └── index.ts
├── browser/
│   ├── index.ts
│   └── knowledgeIntent.ts
├── cache/
│   ├── cacheLayer.ts
│   ├── index.ts
│   ├── storage.ts
│   └── storeNames.ts
├── components/
│   ├── AppHeader.tsx
│   └── index.ts
├── config/
│   ├── api.ts
│   ├── featureFlags.ts
│   └── index.ts
├── constants/
│   ├── cache.ts
│   ├── index.ts
│   └── ms.ts
├── dev/
│   ├── DevCrash.tsx
│   ├── devErrorSimulation.ts
│   ├── DevErrorSimulatorPanel.tsx
│   ├── index.ts
│   └── ModuleDevGate.tsx
├── errors/
│   ├── index.ts
│   ├── ModuleErrorBoundary.tsx
│   └── ModuleErrorState.tsx
├── hooks/
│   ├── index.ts
│   ├── useFeatureFlag.ts
│   ├── useKeyPress/
│   │   ├── index.ts
│   │   └── useKeyPress.ts
│   ├── useRefState/
│   │   └── useRefState.ts
│   └── useTaskCacheInit.ts
├── label/
│   └── index.ts
├── notifications/
│   ├── AppNotificationsProvider.tsx
│   ├── index.ts
│   ├── types.ts
│   └── useAppNotifications.ts
├── protocol/
│   ├── api.ts
│   ├── constants.ts
│   ├── hooks/
│   │   ├── index.ts
│   │   └── useProtocol.ts
│   ├── index.ts
│   └── types.ts
├── queries/
│   ├── dictionaryApi.ts
│   └── usePrefetchDictionaries.ts
├── request/
│   ├── constants.ts
│   ├── index.ts
│   ├── types.ts
│   └── utils.ts
├── routing/
│   ├── constants/
│   │   ├── communication.ts
│   │   ├── index.ts
│   │   └── routes.ts
│   ├── hooks/
│   │   ├── index.ts
│   │   └── useRequestsRouter.ts
│   ├── index.ts
│   └── utils/
│       ├── index.ts
│       └── requestsRouter.ts
├── types/
│   ├── cache.ts
│   └── dictionary/
│       └── index.ts
├── ui/
│   ├── ActionIconButton.tsx
│   ├── copy/
│   │   ├── CopyButton.tsx
│   │   ├── index.ts
│   │   └── useCopy.ts
│   ├── DataField.tsx
│   ├── dictionary/
│   │   ├── ClosureCodeSelect.tsx
│   │   ├── IncidentReasonSelect.tsx
│   │   ├── index.ts
│   │   └── LateReasonSelect.tsx
│   ├── esm/
│   │   └── OpenInESMButton.tsx
│   ├── index.ts
│   ├── rhf/
│   │   ├── FormInputAutocomplete.tsx
│   │   ├── FormInputDate.tsx
│   │   ├── FormInputDateTimePicker.tsx
│   │   ├── FormInputDropdown.tsx
│   │   ├── FormInputMultiCheckbox.tsx
│   │   ├── FormInputProps.ts
│   │   ├── FormInputRadio.tsx
│   │   ├── FormInputSlider.tsx
│   │   ├── FormInputSwitch.tsx
│   │   ├── FormInputText.tsx
│   │   ├── FormInputToggleGroup.tsx
│   │   ├── FormTabs.tsx
│   │   └── useFieldDraft.ts
│   ├── SectionHeader.tsx
│   └── ToolPanelHeader.tsx
├── user/
│   ├── api/
│   │   └── index.ts
│   ├── index.ts
│   ├── model/
│   │   ├── AuthGuard.tsx
│   │   ├── index.ts
│   │   └── useUser.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── UserCommon.dto.ts
│   │   ├── UserDirection.dto.ts
│   │   ├── UserInfo.dto.ts
│   │   └── UserRole.enum.ts
│   └── utils/
│       ├── index.ts
│       └── isBOUser.ts
└── utils/
    ├── backlog.ts
    ├── debounce.ts
    ├── declension.ts
    └── esm.ts
```

---

## Содержимое файлов

### src/shared/api/baseApi.ts

```ts
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  // TODO: Добавить стенд при продакшене
  baseUrl:
    window.location.hostname.includes("localhost")
      ? "/api"
      : `${document.location.origin}`,
});

type ReauthOptions = {
  skipReauth?: boolean;
};

/**
 * Base query with refresh-token handling. When a request gets 401,
 * we try to refresh and repeat the original request once.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ReauthOptions
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  // TODO: Отправить запрос на рефреш
  return result;
};

/**
 * Shared RTK Query API instance. All service slices should inject endpoints here.
 * Keep reducerPath stable to avoid store rewiring across modules.
 */
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: ["TaskInfo", "ChildTasks", "Worklog"],
});
```

### src/shared/api/extractErrorMessage.ts

```ts
export const extractErrorMessage = (error: unknown) => {
  if (typeof error === "string") {
    return error;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof error.error === "string"
  ) {
    return error.error;
  }

  return "";
};
```

### src/shared/api/index.ts

```ts
export { baseApi } from "./baseApi";
export { extractErrorMessage } from "./extractErrorMessage";
```

### src/shared/browser/index.ts

```ts
export * from "./knowledgeIntent";
```

### src/shared/browser/knowledgeIntent.ts

```ts
export type PendingKnowledgeIntent = {
  intentId: string;
  articleId: string;
  receivedAt: string;
  sourceUrl: string;
};

const KNOWLEDGE_ARTICLE_ID_PATTERN =
  /^SH-[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

const STORAGE_KEY = "ewsproto:pending-knowledge-intent";
const CHANNEL_NAME = "ewsproto:pending-knowledge-intent";

type KnowledgeIntentChannelEvent =
  | { type: "intent:set" }
  | { type: "intent:clear" };

const isBrowser = typeof window !== "undefined";

const normalizeStoredIntent = (
  value: unknown,
): PendingKnowledgeIntent | null => {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.intentId !== "string" ||
    typeof candidate.articleId !== "string" ||
    typeof candidate.receivedAt !== "string" ||
    typeof candidate.sourceUrl !== "string"
  ) {
    return null;
  }

  return {
    intentId: candidate.intentId,
    articleId: candidate.articleId,
    receivedAt: candidate.receivedAt,
    sourceUrl: candidate.sourceUrl,
  };
};

const readStorageValue = () => {
  if (!isBrowser) return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return normalizeStoredIntent(JSON.parse(raw));
  } catch {
    return null;
  }
};

const writeStorageValue = (intent: PendingKnowledgeIntent | null) => {
  if (!isBrowser) return;

  if (!intent) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(intent));
};

const postChannelMessage = (event: KnowledgeIntentChannelEvent) => {
  if (!isBrowser || typeof BroadcastChannel === "undefined") return;

  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.postMessage(event);
  channel.close();
};

export const normalizeKnowledgeArticleId = (value: string) => {
  const normalized = value
    .trim()
    .replace(/^#+/, "")
    .replace(/^sh-/i, "SH-")
    .toUpperCase();
  return normalized.startsWith("SH-") ? normalized : `SH-${normalized}`;
};

export const isValidKnowledgeArticleId = (value: string) =>
  KNOWLEDGE_ARTICLE_ID_PATTERN.test(
    value.trim().replace(/^#+/, "").toUpperCase(),
  );

export const readPendingKnowledgeIntent = () => readStorageValue();

export const publishPendingKnowledgeIntent = (
  intent: PendingKnowledgeIntent,
) => {
  writeStorageValue(intent);
  postChannelMessage({ type: "intent:set" });
};

export const consumePendingKnowledgeIntent = () => {
  writeStorageValue(null);
  postChannelMessage({ type: "intent:clear" });
};

export const subscribePendingKnowledgeIntent = (
  listener: (intent: PendingKnowledgeIntent | null) => void,
) => {
  if (!isBrowser) {
    listener(null);
    return () => undefined;
  }

  listener(readStorageValue());

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    listener(readStorageValue());
  };

  const channel =
    typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel(CHANNEL_NAME)
      : null;

  if (channel) {
    channel.onmessage = () => {
      listener(readStorageValue());
    };
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    channel?.close();
  };
};
```

### src/shared/cache/cacheLayer.ts

```ts
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
```

### src/shared/cache/index.ts

```ts
export {
  getStorageProvider,
  setStorageProvider,
  resetStorageProvider,
  IndexedDbProvider,
} from "./storage";
export type { StorageProvider, RecordEntry } from "./storage";

export { STORE_NAMES } from "./storeNames";
export type { StoreName } from "./storeNames";
```

### src/shared/cache/storage.ts

```ts
import { STORE_NAMES } from "./storeNames";

export interface RecordEntry<T = unknown> {
  key: string;
  value: T;
}

export interface StorageProvider {
  getRecord<T>(storeName: string, key: string): Promise<T | undefined>;
  setRecord<T>(storeName: string, key: string, value: T): Promise<void>;
  /** Частично обновить запись -- прочитать, смержить, записать. */
  patchRecord<T extends Record<string, unknown>>(
    storeName: string,
    key: string,
    partial: Partial<T>,
  ): Promise<void>;
  deleteRecord(storeName: string, key: string): Promise<void>;
  getAllRecords<T>(storeName: string): Promise<Array<RecordEntry<T>>>;
  clearStore(storeName: string): Promise<void>;
}

const DB_NAME = "web-ews-cache";

function semverToDbVersion(semver: string): number {
  const [major, minor, patch] = semver.split(".").map(Number);
  return major * 1_000_000 + minor * 1_000 + patch;
}

export class IndexedDbProvider implements StorageProvider {
  private db: IDBDatabase | null = null;
  private openPromise: Promise<IDBDatabase> | null = null;

  private async openDb(): Promise<IDBDatabase> {
    if (this.openPromise) return this.openPromise;

    const version = semverToDbVersion(APP_VERSION);

    this.openPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, version);

      req.onupgradeneeded = () => {
        const db = req.result;
        const stores = Object.values(STORE_NAMES);
        for (const storeName of stores) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        }
      };

      req.onsuccess = () => {
        this.db = req.result;
        resolve(req.result);
      };
      req.onerror = () => reject(req.error);
      req.onblocked = () =>
        reject(new Error("IndexedDB blocked -- закрой другие вкладки"));
    });

    return this.openPromise;
  }

  private async withStore<T>(
    storeName: string,
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    const db = await this.openDb();
    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const req = fn(store);

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error);
    });
  }

  async getRecord<T>(storeName: string, key: string): Promise<T | undefined> {
    if (key === undefined || key === null) return undefined;

    const result = await this.withStore<T | undefined>(
      storeName,
      "readonly",
      (store) => store.get(key),
    );
    return result ?? undefined;
  }

  async setRecord<T>(storeName: string, key: string, value: T): Promise<void> {
    if (key === undefined || key === null) return;

    await this.withStore(storeName, "readwrite", (store) =>
      store.put(value, key),
    );
  }

  async patchRecord<T extends Record<string, unknown>>(
    storeName: string,
    key: string,
    partial: Partial<T>,
  ): Promise<void> {
    if (key === undefined || key === null) return;

    const existing = await this.getRecord<Record<string, unknown>>(
      storeName,
      key,
    );
    const merged = existing
      ? { ...existing, ...partial }
      : (partial as Record<string, unknown>);
    await this.setRecord(storeName, key, merged);
  }

  async deleteRecord(storeName: string, key: string): Promise<void> {
    if (key === undefined || key === null) return;

    await this.withStore(storeName, "readwrite", (store) => store.delete(key));
  }

  async getAllRecords<T>(storeName: string): Promise<Array<RecordEntry<T>>> {
    const db = await this.openDb();
    return new Promise<Array<RecordEntry<T>>>((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.openCursor();
      const results: Array<RecordEntry<T>> = [];

      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          results.push({ key: String(cursor.key), value: cursor.value as T });
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  async clearStore(storeName: string): Promise<void> {
    await this.withStore(storeName, "readwrite", (store) => store.clear());
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.openPromise = null;
    }
  }

  async deleteDb(): Promise<void> {
    this.close();
    return new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

let _provider: IndexedDbProvider | null = null;

export function getStorageProvider(): IndexedDbProvider {
  if (!_provider) _provider = new IndexedDbProvider();
  return _provider;
}

export function setStorageProvider(provider: IndexedDbProvider): void {
  _provider = provider;
}

export function resetStorageProvider(): void {
  if (_provider) {
    _provider.close();
    _provider = null;
  }
}
```

### src/shared/cache/storeNames.ts

```ts
export const STORE_NAMES = {
  REQUESTS: "requests",
  PENDING_OPS: "pendingOps",
  TRIAGE: "triage",
  REQUEST_EMPLOYEE: "requestEmployee",
  REQUEST_PHOTO: "requestPhoto",
  REQUEST_ARMS: "requestArms",
  REQUEST_ACCESS: "requestAccess",
  REQUEST_TICKETS: "requestTickets",
  CLOSURE_DRAFTS: "closureDrafts",
  PROTOCOL_DRAFTS: "protocolDrafts",
  WORKLOG_EVENTS: "worklogEvents",
  RELATED_REQUEST_DRAFTS: "relatedRequestDrafts",
  CHAT_IMAGES: "chatImages",
  CALL_HISTORY: "callHistory",
} as const;

export type StoreName = (typeof STORE_NAMES)[keyof typeof STORE_NAMES];
```

### src/shared/components/AppHeader.tsx

```tsx
import { alpha, Box, Typography } from "@mui/material";

/** Единая шапка приложения: брендинг WebEWS и навигация по разделам. */
function AppHeader() {
  return (
    <Box
      sx={(theme) => ({
        height: 40,
        px: 1,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: "blur(10px)",
      })}
    >
      <Typography
        sx={{ fontSize: 11, letterSpacing: "0.12em", fontWeight: 700 }}
      >
        WebEWS
      </Typography>
    </Box>
  );
}

export default AppHeader;
```

### src/shared/components/index.ts

```ts
export { default as ModuleErrorBoundary } from "../errors/ModuleErrorBoundary";
export { default as ModuleErrorState } from "../errors/ModuleErrorState";
export { default as DevErrorSimulatorPanel } from "../dev/DevErrorSimulatorPanel";
export { default as DevCrash } from "../dev/DevCrash";
export { default as DataField } from "../ui/DataField";
export { default as SectionHeader } from "../ui/SectionHeader";
export { default as ToolPanelHeader } from "../ui/ToolPanelHeader";
export { default as AppHeader } from "./AppHeader";
```

### src/shared/config/api.ts

```ts
export interface AppConfig {
  SBER_ESM_URL: string;
  CTI_URL: string;
}

const CONFIG_PATH = "web-ews-ui/config.json";

export const getConfig = async (): Promise<AppConfig | null> => {
  try {
    const config = await (
      await fetch(`${document.location.origin}/${CONFIG_PATH}`)
    ).json();
    return config as AppConfig;
  } catch {
    return null;
  }
};
```

### src/shared/config/featureFlags.ts

```ts
/** Реестр фича-флагов приложения. Библиотеки читают флаг через
 * хук `useFeatureFlag`, а не напрямую из этого модуля.
 */

export type FeatureFlagName = "worklogLogging";

/**
 * Текущие значения флагов.
 *
 * Временно: значение задаётся здесь, пока не настроены переменные окружения.
 * Чтобы включить логирование локально, поменяй значение на true.
 */
export const FEATURE_FLAGS: Record<FeatureFlagName, boolean> = {
  worklogLogging: !import.meta.env.DEV,
};
```

### src/shared/config/index.ts

```ts
export { getConfig } from "./api";
```

### src/shared/constants/cache.ts

```ts
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
```

### src/shared/constants/index.ts

```ts
export { DAY_MS, HOUR_MS, MINUTE_MS } from "./ms";
```

### src/shared/constants/ms.ts

```ts
export const MINUTE_MS = 60 * 1000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;
```

### src/shared/dev/DevCrash.tsx

```tsx
import type { ReactNode } from "react";
import { DevSimulationError, type DevErrorKind } from "./devErrorSimulation";

export type DevCrashProps = {
  active?: boolean;
  kind?: DevErrorKind;
  label: string;
  children?: ReactNode;
};

/**
 * Throws in DEV to trigger module error boundaries on demand.
 */
function DevCrash({ active, kind = "none", label }: DevCrashProps) {
  if (!import.meta.env.DEV) return null;

  const resolvedKind = kind !== "none" ? kind : active ? "critical" : null;
  if (!resolvedKind) return null;

  throw new DevSimulationError(label, resolvedKind);
}

export default DevCrash;
```

### src/shared/dev/devErrorSimulation.ts

```ts
export type DevErrorKind = "none" | "info" | "action" | "auth" | "critical";

export type ActiveDevErrorKind = Exclude<DevErrorKind, "none">;

export type DevCrashInput = boolean | DevErrorKind | undefined;

export type DevErrorSimulationState = {
  app: DevErrorKind;
  triage: DevErrorKind;
  compactTriage: DevErrorKind;
  clientCard: DevErrorKind;
  requestCard: DevErrorKind;
  chat: DevErrorKind;
  call: DevErrorKind;
  protocol: DevErrorKind;
  actions: DevErrorKind;
  related: DevErrorKind;
  localSupport: DevErrorKind;
  knowledge: DevErrorKind;
  schemes: DevErrorKind;
};

export const DEFAULT_DEV_ERROR_SIMULATION_STATE: DevErrorSimulationState = {
  app: "none",
  triage: "none",
  compactTriage: "none",
  clientCard: "none",
  requestCard: "none",
  chat: "none",
  call: "none",
  protocol: "none",
  actions: "none",
  related: "none",
  localSupport: "none",
  knowledge: "none",
  schemes: "none",
};

export const DEV_ERROR_OPTIONS: Array<{ value: DevErrorKind; label: string }> =
  [
    { value: "none", label: "Нет" },
    { value: "info", label: "Инфо" },
    { value: "action", label: "Действие" },
    { value: "auth", label: "Доступ" },
    { value: "critical", label: "Критическая" },
  ];

export class DevSimulationError extends Error {
  kind: ActiveDevErrorKind;

  constructor(label: string, kind: ActiveDevErrorKind) {
    super(`[DEV] Simulated ${kind} error: ${label}`);
    this.name = "DevSimulationError";
    this.kind = kind;
  }
}

export const isDevSimulationError = (
  error: unknown,
): error is DevSimulationError => error instanceof DevSimulationError;

export const resolveDevCrashState = (devCrash: DevCrashInput) => {
  const devErrorKind =
    typeof devCrash === "string" ? devCrash : devCrash ? "critical" : "none";

  return {
    devErrorKind,
    showSoftError: devErrorKind === "info" || devErrorKind === "action",
    showBlockingError: devErrorKind === "auth" || devErrorKind === "critical",
  };
};

export const resolveModuleDevState = (devCrash: DevCrashInput) => {
  const { devErrorKind, showSoftError, showBlockingError } =
    resolveDevCrashState(devCrash);

  return {
    devErrorKind,
    softErrorKind: showSoftError ? devErrorKind : "none",
    blockingErrorKind: showBlockingError ? devErrorKind : "none",
  };
};

export const getModuleErrorStateProps = (
  moduleName: string,
  kind?: ActiveDevErrorKind,
): {
  title: string;
  description: string;
  severity: "info" | "warning" | "error";
  retryLabel: string;
} => {
  if (kind === "info") {
    return {
      title: `Инфо-сбой в модуле \u00AB${moduleName}\u00BB`,
      description:
        "Модуль продолжает отвечать, но часть данных может быть неполной. Можно безопасно перезагрузить блок.",
      severity: "info",
      retryLabel: "Обновить",
    };
  }

  if (kind === "action") {
    return {
      title: `Сбой действия в модуле \u00AB${moduleName}\u00BB`,
      description:
        "Просмотр доступен, но выполнение сценариев временно нарушено. Перезапустите блок и повторите действие.",
      severity: "warning",
      retryLabel: "Повторить",
    };
  }

  if (kind === "auth") {
    return {
      title: `Ошибка доступа в модуле \u00AB${moduleName}\u00BB`,
      description:
        "Модуль недоступен из-за ограничений доступа или истекшей авторизации. Проверьте права и перезагрузите блок.",
      severity: "warning",
      retryLabel: "Проверить доступ",
    };
  }

  if (kind === "critical") {
    return {
      title: `Критическая ошибка в модуле \u00AB${moduleName}\u00BB`,
      description:
        "Модуль аварийно остановлен и не может продолжить работу. Требуется полный перезапуск блока.",
      severity: "error",
      retryLabel: "Перезапустить",
    };
  }

  return {
    title: `Ошибка в модуле \u00AB${moduleName}\u00BB`,
    description: "Модуль временно недоступен. Попробуйте перезагрузить.",
    severity: "warning",
    retryLabel: "Перезагрузить",
  };
};
```

### src/shared/dev/DevErrorSimulatorPanel.tsx

```tsx
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ToolPanelHeader from "../ui/ToolPanelHeader";
import {
  DEV_ERROR_OPTIONS,
  type DevErrorKind,
  type DevErrorSimulationState,
} from "./devErrorSimulation";

const DEV_TEST_KNOWLEDGE_ARTICLE_ID = "SH-8b2d6f14-1ce5-47d2-9a61-4f3e8b7c20ad";

export type DevErrorSimulatorPanelProps = {
  value: DevErrorSimulationState;
  onChange: (next: DevErrorSimulationState) => void;
  onReset?: () => void;
};

const MODULE_FIELDS: Array<{
  key: keyof DevErrorSimulationState;
  label: string;
  helper: string;
}> = [
  {
    key: "app",
    label: "Приложение",
    helper:
      "Глобальный access-denied или общий crash всего рабочего пространства.",
  },
  {
    key: "triage",
    label: "Triage",
    helper: "Симуляция ошибок полного triage-экрана.",
  },
  {
    key: "compactTriage",
    label: "Маленький список заявок",
    helper: "Симуляция ошибок компактного списка обращений слева.",
  },
  {
    key: "requestCard",
    label: "Карточка обращения",
    helper: "Ошибка всего центрального блока обращения.",
  },
  {
    key: "clientCard",
    label: "Карточка клиента",
    helper: "Симуляция ошибок клиентских вкладок внутри обращения.",
  },
  {
    key: "chat",
    label: "Чат",
    helper: "Инструмент переписки с пользователем.",
  },
  {
    key: "call",
    label: "Дозвон",
    helper: "Инструмент дозвона и исходящих сценариев связи.",
  },
  {
    key: "protocol",
    label: "Протокол",
    helper: "Инструмент протокола внутри панели инструментов.",
  },
  {
    key: "actions",
    label: "Действия",
    helper: "Инструмент действий и закрытия заявки.",
  },
  {
    key: "related",
    label: "Смежные группы",
    helper: "Инструмент привлечения смежных групп.",
  },
  {
    key: "localSupport",
    label: "Локальная поддержка",
    helper: "Инструмент создания запроса в локальную поддержку.",
  },
  {
    key: "knowledge",
    label: "База знаний",
    helper: "Инструмент базы знаний и привязки статей.",
  },
  {
    key: "schemes",
    label: "Бизнес-схемы",
    helper: "Инструмент навигатора по схемам и маршрутам.",
  },
];

const hasActiveSimulation = (value: DevErrorSimulationState) =>
  value.app !== "none" ||
  value.triage !== "none" ||
  value.compactTriage !== "none" ||
  value.clientCard !== "none" ||
  value.requestCard !== "none" ||
  value.chat !== "none" ||
  value.call !== "none" ||
  value.protocol !== "none" ||
  value.actions !== "none" ||
  value.related !== "none" ||
  value.localSupport !== "none" ||
  value.knowledge !== "none" ||
  value.schemes !== "none";

/**
 * Tool-panel content for development error simulation.
 */
function DevErrorSimulatorPanel({
  value,
  onChange,
  onReset,
}: DevErrorSimulatorPanelProps) {
  const handleOpenKnowledgeIntentTest = () => {
    const url = new URL(
      `/kb/${DEV_TEST_KNOWLEDGE_ARTICLE_ID}`,
      window.location.origin,
    );
    window.open(url.toString(), "_blank");
  };

  return (
    <Stack spacing={1.5} sx={{ p: 1 }}>
      <ToolPanelHeader
        eyebrow="Developer"
        title="Симуляция ошибок"
        description="Переключайте сценарии ошибок по блокам без изменения бизнес-логики."
      />

      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: 1.5,
          borderRadius: 2.5,
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.7)
              : alpha(theme.palette.background.paper, 0.9),
        })}
      >
        <Stack spacing={1.5}>
          {MODULE_FIELDS.map((field) => (
            <Stack key={field.key} spacing={0.75}>
              <FormControl size="small" fullWidth>
                <InputLabel id={`dev-error-${field.key}-label`}>
                  {field.label}
                </InputLabel>
                <Select
                  labelId={`dev-error-${field.key}-label`}
                  label={field.label}
                  value={value[field.key]}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      [field.key]: event.target.value as DevErrorKind,
                    })
                  }
                >
                  {DEV_ERROR_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="fieldLabel">{field.helper}</Typography>
            </Stack>
          ))}

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle2">Тест SH-intent</Typography>
            <Typography variant="fieldLabel">
              Открывает новую вкладку с примером передачи статьи в формате
              `/kb/SH-...`.
            </Typography>
            <Typography variant="fieldLabel">
              {DEV_TEST_KNOWLEDGE_ARTICLE_ID}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<OpenInNewOutlinedIcon fontSize="small" />}
                onClick={handleOpenKnowledgeIntentTest}
              >
                Тест передачи статьи
              </Button>
            </Stack>
          </Stack>

          <Divider />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Typography variant="fieldLabel">
              Уровни info и action дают мягкие сценарии, auth и critical
              проверяют жёсткие деградации.
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onReset?.()}
              disabled={!hasActiveSimulation(value)}
            >
              Сбросить
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default DevErrorSimulatorPanel;
```

### src/shared/dev/index.ts

```ts
export { default as DevCrash } from "./DevCrash";
export { default as DevErrorSimulatorPanel } from "./DevErrorSimulatorPanel";
export { default as ModuleDevGate } from "./ModuleDevGate";
export * from "./devErrorSimulation";
```

### src/shared/dev/ModuleDevGate.tsx

```tsx
import { Alert, Box, Button, Stack } from "@mui/material";
import type { ReactNode } from "react";
import { ModuleErrorBoundary } from "../errors";
import DevCrash from "./DevCrash";
import {
  getModuleErrorStateProps,
  resolveModuleDevState,
  type DevCrashInput,
} from "./devErrorSimulation";

export type ModuleDevGateProps = {
  moduleName: string;
  crashLabel: string;
  devCrash?: DevCrashInput;
  onReset?: () => void;
  resetKey?: string | number;
  children: ReactNode;
};

function ModuleDevGate({
  moduleName,
  crashLabel,
  devCrash,
  onReset,
  resetKey,
  children,
}: ModuleDevGateProps) {
  const { softErrorKind, blockingErrorKind } = resolveModuleDevState(devCrash);
  const errorStateProps =
    softErrorKind !== "none"
      ? getModuleErrorStateProps(moduleName, softErrorKind)
      : null;

  return (
    <ModuleErrorBoundary
      moduleName={moduleName}
      resetKey={resetKey}
      onReset={onReset}
    >
      <DevCrash
        kind={blockingErrorKind !== "none" ? blockingErrorKind : undefined}
        label={crashLabel}
      />
      {errorStateProps ? (
        <Stack spacing={1} sx={{ height: "100%", minHeight: 0 }}>
          <Alert
            severity={errorStateProps.severity}
            variant="outlined"
            action={
              onReset ? (
                <Button color="inherit" size="small" onClick={onReset}>
                  {errorStateProps.retryLabel}
                </Button>
              ) : undefined
            }
          >
            <strong>{errorStateProps.title}</strong>{" "}
            {errorStateProps.description}
          </Alert>
          <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
        </Stack>
      ) : (
        children
      )}
    </ModuleErrorBoundary>
  );
}

export default ModuleDevGate;
```

### src/shared/errors/index.ts

```ts
export { default as ModuleErrorBoundary } from "./ModuleErrorBoundary";
export { default as ModuleErrorState } from "./ModuleErrorState";
```

### src/shared/errors/ModuleErrorBoundary.tsx

```tsx
import { Component, type ReactNode } from "react";
import ModuleErrorState from "./ModuleErrorState";
import {
  getModuleErrorStateProps,
  isDevSimulationError,
} from "../dev/devErrorSimulation";

export type ModuleErrorBoundaryProps = {
  moduleName: string;
  resetKey?: string | number;
  onReset?: () => void;
  children: ReactNode;
};

type ModuleErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

/**
 * Module-level error boundary so each feature can fail independently.
 */
class ModuleErrorBoundary extends Component<
  ModuleErrorBoundaryProps,
  ModuleErrorBoundaryState
> {
  state: ModuleErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ModuleErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // Log technical details for developers without exposing them in the UI.
    console.error("[ModuleErrorBoundary]", this.props.moduleName, error);
  }

  componentDidUpdate(prevProps: ModuleErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      // Reset after explicit reload.
      this.setState({ hasError: false, error: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      const errorStateProps = isDevSimulationError(this.state.error)
        ? getModuleErrorStateProps(this.props.moduleName, this.state.error.kind)
        : getModuleErrorStateProps(this.props.moduleName);

      return (
        <ModuleErrorState {...errorStateProps} onRetry={this.props.onReset} />
      );
    }

    return this.props.children;
  }
}

export default ModuleErrorBoundary;
```

### src/shared/errors/ModuleErrorState.tsx

```tsx
import {
  Alert,
  AlertTitle,
  Button,
  Stack,
  type AlertColor,
} from "@mui/material";

export type ModuleErrorStateProps = {
  title: string;
  description: string;
  severity?: AlertColor;
  retryLabel?: string;
  onRetry?: () => void;
};

/**
 * Reusable error block for module-level failures.
 * Keep copy editable to allow per-module language tweaks.
 */
function ModuleErrorState({
  title,
  description,
  severity = "warning",
  retryLabel = "Перезагрузить",
  onRetry,
}: ModuleErrorStateProps) {
  return (
    <Stack spacing={1.5}>
      <Alert
        severity={severity}
        variant="outlined"
        sx={{ borderRadius: 2 }}
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : undefined
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {description}
      </Alert>
    </Stack>
  );
}

export default ModuleErrorState;
```

### src/shared/hooks/index.ts

```ts
export * from "./useKeyPress";

export { useFeatureFlag } from "./useFeatureFlag";
```

### src/shared/hooks/useFeatureFlag.ts

```ts
import {
  FEATURE_FLAGS,
  type FeatureFlagName,
} from "@shared/config/featureFlags";

/**
 * Возвращает, включена ли указанная фича.
 *
 * Хук -- простой объект доступа, не триггерит ререндер. Если в проекте
 * потребуется реактивность, заменить на `useMemo(() => FLAG, [])`.
 */
export const useFeatureFlag = (name: FeatureFlagName): boolean =>
  FEATURE_FLAGS[name];
```

### src/shared/hooks/useKeyPress/index.ts

```ts
export * from "./useKeyPress";
```

### src/shared/hooks/useKeyPress/useKeyPress.ts

```ts
import { useEffect, useRef, useState } from "react";

import type { HookTarget } from "../../utils/helpers";

import { isTarget } from "../../utils/helpers";

import type { StateRef } from "../useRefState/useRefState";

import { useRefState } from "../useRefState/useRefState";

/** The key or keys to listen for */
export type UseKeyPressKey = string | string[];

/** The callback function to be invoked when key is pressed */
export type UseKeyPressCallback = (
  pressed: boolean,
  event: KeyboardEvent,
) => void;

/** The use key press return type */
export interface UseKeyPressReturn {
  /** The pressed state of the key */
  pressed: boolean;
  /** The ref to attach to the element */
  ref: StateRef<Element>;
}

export interface UseKeyPress {
  (
    target: HookTarget | Window,
    key: UseKeyPressKey,
    callback?: UseKeyPressCallback,
  ): UseKeyPressReturn;

  <Target extends Element>(
    key: UseKeyPressKey,
    callback?: UseKeyPressCallback,
    target?: never,
  ): UseKeyPressReturn & { ref: StateRef<Target> };
}

/**
 * @name useKeyPress
 * @description - Hook that listens for key press events
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @param {HookTarget} [target=window] The target to attach the event listeners to
 * @param {UseKeyPressKey} key The key or keys to listen for
 * @param {(pressed: boolean, event: KeyboardEvent) => void} [callback] Callback function invoked when key is pressed
 * @returns {UseKeyPressReturn} An object containing the pressed state and ref
 *
 * @example
 * const isKeyPressed = useKeyPress(ref, 'a');
 *
 * @overload
 * @template Target The target element type
 * @param {UseKeyPressKey} key The key or keys to listen for
 * @param {(pressed: boolean, event: KeyboardEvent) => void} [callback] Callback function invoked when key is pressed
 * @returns {{ pressed: boolean; ref: StateRef<Target> }} An object containing the pressed state and ref
 *
 * @example
 * const { pressed, ref } = useKeyPress('a');
 */
export const useKeyPress = ((...params: any[]) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const key = (target ? params[1] : params[0]) as UseKeyPressKey;
  const callback = (target ? params[2] : params[1]) as
    | UseKeyPressCallback
    | undefined;

  const [pressed, setPressed] = useState(false);
  const internalRef = useRefState<Element | Window>();

  const keyRef = useRef(key);
  keyRef.current = key;
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    const element =
      ((target
        ? isTarget.getElement(target)
        : internalRef.current) as Element) ?? window;
    if (!element) return;

    const onKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (
        Array.isArray(keyRef.current)
          ? keyRef.current.includes(keyboardEvent.key)
          : keyboardEvent.key === keyRef.current
      ) {
        setPressed(true);
        internalCallbackRef.current?.(true, keyboardEvent);
      }
    };

    const onKeyUp = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (
        Array.isArray(keyRef.current)
          ? keyRef.current.includes(keyboardEvent.key)
          : keyboardEvent.key === keyRef.current
      ) {
        setPressed(false);
        internalCallbackRef.current?.(false, keyboardEvent);
      }
    };

    element.addEventListener("keydown", onKeyDown);
    element.addEventListener("keyup", onKeyUp);

    return () => {
      element.removeEventListener("keydown", onKeyDown);
      element.removeEventListener("keyup", onKeyUp);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { pressed };
  return { pressed, ref: internalRef };
}) as UseKeyPress;
```

### src/shared/hooks/useRefState/useRefState.ts

```ts
import { useState } from "react";

export interface StateRef<Value> {
  (node: Value): void;
  current: Value;
  state?: Value;
}

export const createRefState = <Value>(
  initialValue: Value | undefined,
  setState: (value: Value) => void,
) => {
  let temp = initialValue;
  function ref(value: Value) {
    if (temp === value) return;
    temp = value;
    setState(temp);
  }

  Object.defineProperty(ref, "current", {
    get() {
      return temp;
    },
    set(value: Value) {
      if (temp === value) return;
      temp = value;
      setState(temp);
    },
    configurable: true,
    enumerable: true,
  });

  return ref as StateRef<Value>;
};

/**
 * @name useRefState
 * @description - Hook that returns the state reference of the value
 * @category State
 * @usage low
 *
 * @template Value The type of the value
 * @param {Value} [initialValue] The initial value
 * @returns {StateRef<Value>} The current value
 *
 * @example
 * const internalRefState = useRefState();
 */
export const useRefState = <Value>(initialValue?: Value) => {
  const [state, setState] = useState<Value | undefined>(initialValue);
  const [ref] = useState(() => createRefState<Value>(initialValue, setState));
  ref.state = state;
  return ref;
};
```

### src/shared/hooks/useTaskCacheInit.ts

```ts
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
```

### src/shared/label/index.ts

```ts
export interface LabelDto {
  name: string;
  color: string;
  tooltip: string;
  /** Иконка-тип метки. "chat" -- сообщение в чате получено. */
  icon?: "chat" | "od_open" | "od_close";
}
```

### src/shared/notifications/AppNotificationsProvider.tsx

```tsx
import type { ReactNode } from "react";
import { SnackbarProvider } from "notistack";

export type AppNotificationsProviderProps = {
  children: ReactNode;
};

function AppNotificationsProvider({ children }: AppNotificationsProviderProps) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      {children}
    </SnackbarProvider>
  );
}

export default AppNotificationsProvider;
```

### src/shared/notifications/index.ts

```ts
export { default as AppNotificationsProvider } from "./AppNotificationsProvider";
export { useAppNotifications } from "./useAppNotifications";
export type { AppNotificationSeverity } from "./types";
```

### src/shared/notifications/types.ts

```ts
export type AppNotificationSeverity = "success" | "error" | "info" | "warning";
```

### src/shared/notifications/useAppNotifications.ts

```ts
import { useCallback } from "react";
import { useSnackbar } from "notistack";
import type { AppNotificationSeverity } from "./types";

export const useAppNotifications = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notify = useCallback(
    (message: string, severity: AppNotificationSeverity = "success") => {
      enqueueSnackbar(message, { variant: severity });
    },
    [enqueueSnackbar],
  );

  const notifySuccess = useCallback(
    (message: string) => notify(message, "success"),
    [notify],
  );
  const notifyError = useCallback(
    (message: string) => notify(message, "error"),
    [notify],
  );
  const notifyInfo = useCallback(
    (message: string) => notify(message, "info"),
    [notify],
  );
  const notifyWarning = useCallback(
    (message: string) => notify(message, "warning"),
    [notify],
  );

  return {
    notify,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };
};
```

### src/shared/protocol/api.ts

```ts
import { baseApi } from "../api";
import type { SendToProtocolDTO } from "./types";

const protocolApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendToProtocol: builder.mutation<void, SendToProtocolDTO>({
      query: ({ taskNumber, ...dto }: SendToProtocolDTO) => ({
        url: `web-ews-middle/esm-actions/set-protocol/${taskNumber}`,
        method: "POST",
        body: dto,
      }),
    }),
  }),
});

export const { useSendToProtocolMutation } = protocolApi;
```

### src/shared/protocol/constants.ts

```ts
// empty
```

### src/shared/protocol/hooks/index.ts

```ts
export { useProtocol } from "./useProtocol";
```

### src/shared/protocol/hooks/useProtocol.ts

```ts
import { useUser } from "@shared/user";
import type { RequestDTO } from "@shared/request";
import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";

import { useSendToProtocolMutation } from "../api";
import {
  PROTOCOL_TYPE_CODES,
  type ProtocolType,
  type SendToProtocolDTO,
} from "../types";

const normalizeProtocolType = (
  ticketId: string,
  protocolType: ProtocolType,
) => {
  const shouldChangeType = ticketId.trim().toUpperCase().startsWith("INC");

  if (shouldChangeType) {
    return protocolType === PROTOCOL_TYPE_CODES.USER_MESSAGE
      ? PROTOCOL_TYPE_CODES.MESSAGE_TO_INITIATOR
      : PROTOCOL_TYPE_CODES.MESSAGE_TO_PERFORMER;
  }

  return protocolType;
};

export const useProtocol = () => {
  const [handler, mutationState] = useSendToProtocolMutation();

  const log = useWorklogLogger();

  const { user } = useUser();

  const sendToProtocol = (
    request: RequestDTO,
    message: string,
    typeCode: ProtocolType,
  ) => {
    const dto: SendToProtocolDTO = {
      taskId: request.taskId!,
      taskNumber: request.businessId,
      textMessage: message,
      typeCode: normalizeProtocolType(request.businessId, typeCode),
      createdBy: user?.empObjectId ?? "Не опредён",
      replyTo: null,
    };

    return handler(dto)
      .unwrap()
      .then((result) => {
        log({
          action: WORKLOG_ACTIONS.WRITE_INFO_PROTOCOL,
          task: dto.taskNumber,
          commentParams: { text: dto.textMessage },
        });

        return result;
      });
  };

  return { sendToProtocol, ...mutationState };
};
```

### src/shared/protocol/index.ts

```ts
export * from "./api";
export * from "./constants";
export * from "./types";
export * from "./hooks";
```

### src/shared/protocol/types.ts

```ts
export const PROTOCOL_TYPE_CODES = {
  /** Сообщение пользователю */
  USER_MESSAGE: "USER_MESSAGE",
  MESSAGE_TO_INITIATOR: "MESSAGE_TO_INITIATOR",
  /** Сообщение инженеру */
  ENGINEER_MESSAGE: "ENGINEER_MESSAGE",
  MESSAGE_TO_PERFORMER: "MESSAGE_TO_PERFORMER",
} as const;

export type ProtocolType =
  (typeof PROTOCOL_TYPE_CODES)[keyof typeof PROTOCOL_TYPE_CODES];

/**
  createdBy: engeneerInfo?.empObjectId ?? '',
  replyTo: null,
  taskId: incident?.taskId ?? '',
  taskNumber: incident?.businessId ?? '',
  textMessage: message,
  typeCode:  toClient ? 'USER_MESSAGE' : 'ENGINEER_MESSAGE'
   */

export interface SendToProtocolDTO {
  /** businessId заявки */
  taskNumber: string;
  /** taskId заявки  */
  taskId: string;
  replyTo: null;
  /** Сообщение */
  textMessage: string;
  /** Тип сообщения */
  typeCode: ProtocolType;
  /** UUID отправителя */
  createdBy: string;
}
```

### src/shared/queries/dictionaryApi.ts

```ts
import { baseApi } from "@shared/api";

interface StaticInfoItemDto {
  value: string;
  label: string;
}

interface CloseCodesResponseDto {
  items: StaticInfoItemDto[];
}

interface IncReasonResponseDto {
  items: StaticInfoItemDto[];
}

interface LateReasonResponseDto {
  items: StaticInfoItemDto[];
}

interface HashtagDto {
  id: number;
  hashtag: string;
  title: string;
  hint: string;
}

export interface GroupHashtagDto {
  group: {
    id: number;
    name: string;
    tags: HashtagDto[];
  };
}

export interface DictionaryGroupDto {
  id: number | null;
  name: string | null;
  parentId: number | null;
  tags: HashtagDto[];
}

type HashtagsResponseDto = GroupHashtagDto[];

export const dictionaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCloseCodes: builder.query<CloseCodesResponseDto, string | void>({
      query: (entityType) => ({
        url: "web-ews-middle/static-info/close-codes",
        method: "GET",
        params: entityType ? { taskType: entityType } : undefined,
      }),
    }),
    getIncReason: builder.query<IncReasonResponseDto, void>({
      query: () => ({
        url: "web-ews-middle/static-info/inc/inc-reason",
        method: "GET",
      }),
    }),
    getLateReason: builder.query<LateReasonResponseDto, void>({
      query: () => ({
        url: "web-ews-middle/static-info/late-reasons",
        method: "GET",
      }),
    }),
    getHashtags: builder.query<
      HashtagsResponseDto,
      { unit: string; direction: string }
    >({
      query: (dto) => {
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(dto)) {
          params.append(key, value);
        }

        return {
          url: `web-ews-middle/compendium/tags?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: DictionaryGroupDto[]) => {
        const result: HashtagsResponseDto = [];

        for (const group of response) {
          if (group.tags.length > 0 && group.parentId !== null) {
            result.push({
              group: {
                id: group.id!,
                name: group.name!,
                tags: group.tags,
              },
            });
          }
          if (group.parentId === null) {
            result.push({
              group: {
                id: null,
                name: "",
                tags: group.tags,
              },
            });
          }
        }

        return result;
      },
    }),
  }),
});

export const {
  useGetCloseCodesQuery,
  useGetIncReasonQuery,
  useGetLateReasonQuery,
  useGetHashtagsQuery,
} = dictionaryApi;
```

### src/shared/queries/usePrefetchDictionaries.ts

```ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { dictionaryApi } from "./dictionaryApi";

export function usePrefetchDictionaries() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dictionaryApi.endpoints.getCloseCodes.initiate(undefined));
    dispatch(dictionaryApi.endpoints.getIncReason.initiate(undefined));
    dispatch(dictionaryApi.endpoints.getLateReason.initiate(undefined));
  }, [dispatch]);
}
```

### src/shared/request/constants.ts

```ts
import type { IncType } from "./types";

export const STATE_CODES = {
  REGISTERED: "REGISTERED",
  INWORKGROUP_ASSIGNED: "INWORKGROUP_ASSIGNED",
  INWORKGROUP_RETURNED: "INWORKGROUP_RETURNED",
  INWORKGROUP_APPROVED: "INWORKGROUP_APPROVED",
  INWORKGROUP_NOT_APPROVED: "INWORKGROUP_NOT_APPROVED",
  APPROVE_WAITING: "APPROVE_WAITING",
  APPROVE_REQUEST_INFO: "APPROVE_REQUEST_INFO",
  APPROVE_GIVE_INFO: "APPROVE_GIVE_INFO",
  IN_WORK: "IN_WORK",
  IN_WORK_WORK: "IN_WORK_WORK",
  IN_WORK_REQUEST_INFO: "IN_WORK_REQUEST_INFO",
  IN_WORK_GIVE_INFO: "IN_WORK_GIVE_INFO",
  IN_WORK_TASK_CREATED: "IN_WORK_TASK_CREATED",
  IN_WORK_TASK_COMPLETED: "IN_WORK_TASK_COMPLETED",
  IN_WORK_REQUEST_INFORMATION: "IN_WORK_REQUEST_INFORMATION",
  IN_WORK_GIVE_INFORMATION: "IN_WORK_GIVE_INFORMATION",
  COMPLETED: "COMPLETED",
  CLOSED: "CLOSED",
  WAITING: "WAITING",
} as const;

export const PRIORITY_CODES = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  IMPORTANT: "IMPORTANT",
  CRITICAL: "CRITICAL",
} as const;

export const STATE_CODES_RUS_MAP: Record<keyof typeof STATE_CODES, string> = {
  REGISTERED: "Зарегистрирован",
  INWORKGROUP_ASSIGNED: "Назначен",
  INWORKGROUP_RETURNED: "Возврат в работу",
  INWORKGROUP_APPROVED: "Согласован",
  INWORKGROUP_NOT_APPROVED: "Не согласован",
  APPROVE_WAITING: "Ожидает согласования",
  APPROVE_REQUEST_INFO: "Уточнение информации по согласованию",
  APPROVE_GIVE_INFO: "Получена дополнительная информация по согласованию",
  IN_WORK: "В работе",
  IN_WORK_WORK: "В работе",
  IN_WORK_REQUEST_INFO: "Уточнение информации",
  IN_WORK_GIVE_INFO: "Получена дополнительная информация",
  IN_WORK_TASK_CREATED: "ЗНР созданы",
  IN_WORK_TASK_COMPLETED: "ЗНР выполнены",
  IN_WORK_REQUEST_INFORMATION: "Уточнение информации",
  IN_WORK_GIVE_INFORMATION: "Получена дополнительная информация",
  COMPLETED: "Выполнен",
  CLOSED: "Закрыт",
  WAITING: "Ожидание",
} as const;

export const PRIORITY_CODES_RUS_MAP: Record<
  keyof typeof PRIORITY_CODES,
  string
> = {
  LOW: "Низкий",
  MEDIUM: "Средний",
  HIGH: "Высокий",
  IMPORTANT: "Важный",
  CRITICAL: "Критичный",
} as const;

export const AVAILABILITY_INC_TYPE: IncType = "AVAILABILITY_INC";

export const TICKET_TYPES = {
  INC: "INC", // Инцидент
  SR: "SR", // ЗНО
  SRT: "SRT", // ЗНР
  INCT: "INCT", // ЗПИ
} as const;

export type TicketActionEntityType =
  (typeof TICKET_TYPES)[keyof typeof TICKET_TYPES];

export const TICKET_ENTITY_TYPE_LABELS: Record<TicketActionEntityType, string> =
  {
    INC: "Инцидент",
    SR: "ЗНО",
    SRT: "ЗНР",
    INCT: "ЗПИ",
  };
```

### src/shared/request/index.ts

```ts
export * from "./constants";
export * from "./types";
export * from "./utils";
```

### src/shared/request/types.ts

```ts
import { STATE_CODES, PRIORITY_CODES } from "./constants";
import type { LabelDto } from "../label";

export type IncType =
  | "AVAILABILITY_INC"
  | "USER_INC"
  | "DATA_QUALITY_INC"
  | "AFTERMATH_DEAL_INC"
  | "PROD_STAND_INC"
  | "CONFIG_INC"
  | "VSP_INC"
  | "DATA_PASS_INC";

export interface RequestWorkgroupDTO {
  id: string;
  businessId: string;
  workGroupLabel: string;
}

export interface RequestItService {
  id: string;
  code: string;
  name: string;
  label: string | null;
}

export interface InitiatorSubdivisionDTO {
  id: string | null;
  name: string | null;
  terbank: string | null;
  subbranch: string | null;
}

export interface InitiatorPositionDTO {
  id: string | null;
  name: string | null;
  position?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface RequestInitiatorDTO {
  id: string;
  personalNumber: string;
  lastName: string | null;
  firstName: string | null;
  middleName: string | null;
  hired: string | null;
  fired: string | null;
  timeZone: number | null;
  subdivision: InitiatorSubdivisionDTO | null;
  position: InitiatorPositionDTO | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface RequestAssigneeDTO {
  personalNumber: string;
  lastName: string | null;
  firstName: string | null;
  middleName: string | null;
}

export type StateCode = keyof typeof STATE_CODES;

export type PriorityCode = keyof typeof PRIORITY_CODES;

interface RequestProperty {
  code: string;
  name: string;
  type: string;
  value: string;
  modifiers: [];
}

export interface RequestDTO {
  taskWaiting: string;
  taskId: string;
  businessId: string;
  title: string | null;
  stateCode: StateCode;
  priorityCode: PriorityCode | null;
  workGroup: RequestWorkgroupDTO;
  itService: RequestItService;
  configurationElement: string | null;
  initiator: RequestInitiatorDTO | null;
  tags: string | null;
  description: string;
  createdAt: string | null;
  targetDate: string | null;
  factFinishDate: string | null;
  assignee: RequestAssigneeDTO;
  properties: RequestProperty[];
  labels: LabelDto[];
  incType?: IncType;
}
```

### src/shared/request/utils.ts

```ts
import {
  PRIORITY_CODES_RUS_MAP,
  STATE_CODES_RUS_MAP,
  TICKET_ENTITY_TYPE_LABELS,
  TICKET_TYPES,
  type TicketActionEntityType,
} from "./constants";
import type { RequestDTO } from "./types";
import { AVAILABILITY_INC_TYPE } from "./constants";

export const getRusStateCode = (stateCode: RequestDTO["stateCode"]) =>
  STATE_CODES_RUS_MAP[stateCode] ?? `Неизвестный статус: ${stateCode}`;

export const getRusPriorityCode = (priorityCode: RequestDTO["priorityCode"]) =>
  PRIORITY_CODES_RUS_MAP[priorityCode!] ??
  `Неизвестный приоритет: ${priorityCode}`;

export const isAvailabilityIncident = (request: RequestDTO): boolean =>
  !!request.incType && request.incType === AVAILABILITY_INC_TYPE;

/** Вычисляет entityType из businessId заявки.
 * Порядок проверок важен: INCT должен идти до INC, SRT -- до SR.
 * Соответствует маппингу в getEsmLink / buildEsmLink. */
export const resolveTicketActionEntityType = (
  ticketId: string,
): TicketActionEntityType => {
  const normalizedId = ticketId.trim().toUpperCase();

  if (normalizedId.startsWith("INCT")) return TICKET_TYPES.INCT;
  if (normalizedId.startsWith("INC")) return TICKET_TYPES.INC;
  if (normalizedId.startsWith("SRT")) return TICKET_TYPES.SRT;
  if (normalizedId.startsWith("SR")) return TICKET_TYPES.SR;

  throw new Error(`Не удалось определить тип сущности для ${ticketId}`);
};

export const getRusRequestType = (businessId: string) => {
  return TICKET_ENTITY_TYPE_LABELS[resolveTicketActionEntityType(businessId)];
};
```

### src/shared/routing/constants/communication.ts

```ts
export const COMMUNICATION_MAP = {
  SCHEMES: "schemes",
  CHAT: "chat",
  CALL: "call",
  PROTOCOL: "protocol",
  ACTIONS: "actions",
  RELATED: "related",
  SUPPORT: "local-support",
  KNOWLEDGE: "knowledge",
} as const;

export const COMMUNICATIONS = Object.values(COMMUNICATION_MAP);

export type Communication = (typeof COMMUNICATIONS)[number];

export const COMMUNICATION_TAB = "communication";
```

### src/shared/routing/constants/index.ts

```ts
export { ROUTES, TICKET_ID_KEY } from "./routes";
export {
  COMMUNICATION_MAP,
  COMMUNICATIONS,
  type Communication,
  COMMUNICATION_TAB,
} from "./communication";
```

### src/shared/routing/constants/routes.ts

```ts
export const TICKET_ID_KEY = "ticketId";

export const ROUTES = {
  REQUESTS: "/requests",
  REQUEST: `/requests/ticket/:${TICKET_ID_KEY}`,
  CTI: "/cti",
} as const;
```

### src/shared/routing/hooks/index.ts

```ts
export { useRequestsRouter } from "./useRequestsRouter";
```

### src/shared/routing/hooks/useRequestsRouter.ts

```ts
import { useCallback, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";

import {
  COMMUNICATION_TAB,
  ROUTES,
  TICKET_ID_KEY,
  type Communication,
} from "../constants";
import {
  createTicketRoute,
  getcommunication as getCommunication,
} from "../utils";

export const useRequestsRouter = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const log = useWorklogLogger();

  const ticketId = useMemo(() => params[TICKET_ID_KEY] ?? null, [params]);
  const communication = useMemo(
    () =>
      ticketId ? getCommunication(searchParams.get(COMMUNICATION_TAB)) : null,
    [ticketId, searchParams],
  );

  const openTicket = useCallback(
    (ticketId: string, communication: Communication | null) => {
      navigate(createTicketRoute(ticketId, communication));
    },
    [navigate],
  );

  const opencommunication = useCallback(
    (communication: Communication) => {
      if (!ticketId) return;

      navigate(createTicketRoute(ticketId, communication));
    },
    [navigate, ticketId],
  );

  const closecommunication = useCallback(() => {
    if (!ticketId) return;
    navigate(createTicketRoute(ticketId, null));
  }, [ticketId, navigate]);

  const openRequests = useCallback(() => {
    navigate(ROUTES.REQUESTS);
  }, [navigate]);

  const closeRequest = useCallback(() => {
    if (!ticketId) return;
    log({ action: WORKLOG_ACTIONS.TASK_OUT, task: ticketId });
    navigate(ROUTES.REQUESTS);
  }, [navigate, log, ticketId]);

  return {
    ticketId,
    communication: communication,
    openTicket,
    openRequests,
    closeRequest,
    opencommunication,
    closecommunication,
  };
};
```

### src/shared/routing/index.ts

```ts
export {
  ROUTES,
  TICKET_ID_KEY,
  type Communication,
  COMMUNICATION_MAP,
} from "./constants";
export { createTicketRoute } from "./utils";
export { useRequestsRouter } from "./hooks";
```

### src/shared/routing/utils/index.ts

```ts
export { createTicketRoute, getcommunication } from "./requestsRouter";
```

### src/shared/routing/utils/requestsRouter.ts

```ts
import {
  COMMUNICATION_TAB,
  COMMUNICATIONS,
  ROUTES,
  TICKET_ID_KEY,
  type communication,
} from "../constants";

const isValidcommunication = (c: string | null): c is communication => {
  if (!c) return false;

  return COMMUNICATIONS.includes(c as communication);
};

export const getcommunication = (c: string | null): communication | null => {
  return isValidcommunication(c) ? (c as communication) : null;
};

export const createTicketRoute = (ticketId: string, c: string | null) => {
  const params = new URLSearchParams();

  const communication = getcommunication(c);

  if (communication) {
    params.append(COMMUNICATION_TAB, communication);
  }

  return `${ROUTES.REQUEST.replace(`:${TICKET_ID_KEY}`, ticketId)}?${params.toString()}`;
};
```

### src/shared/types/cache.ts

```ts
export interface CacheEntry<T> {
  value: T;
  cachedAt: number;
  ttlMs: number;
}
```

### src/shared/types/dictionary/index.ts

```ts
export interface StaticInfoItemDto {
  value: string;
  label: string;
}

export interface CloseCodesResponseDto {
  items: StaticInfoItemDto[];
}

export interface IncReasonResponseDto {
  items: StaticInfoItemDto[];
}

export interface LateReasonResponseDto {
  items: StaticInfoItemDto[];
}
```

### src/shared/ui/ActionIconButton.tsx

```tsx
import type { ReactElement } from "react";
import { Box, Tooltip } from "@mui/material";

type Props = {
  bgcolor: string;
  icon: React.ElementType;
  tooltip: string;
  onClick: (e: React.MouseEvent) => void;
  iconSize?: number;
};

/**
 * Прямоугольная кнопка-иконка с цветной заливкой, скруглением 4px
 * и белой иконкой по центру.
 * Единый компонент для кнопок действий (чат/протокол/ЗПИ) в триажных списках,
 * как в демо-, так и в будущем реальном режиме.
 */
export function ActionIconButton({
  bgcolor,
  icon: Icon,
  tooltip,
  onClick,
  iconSize = 14,
}: Props): ReactElement {
  return (
    <Tooltip title={tooltip} placement="top">
      <Box
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e as unknown as React.MouseEvent);
          }
        }}
        sx={(theme) => ({
          width: 20,
          height: 20,
          borderRadius: "4px",
          backgroundColor: bgcolor,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: theme.transitions.create("opacity"),
          "&:hover": { opacity: 0.8 },
        })}
      >
        <Icon sx={{ fontSize: iconSize, color: "#fff", lineHeight: 0 }} />
      </Box>
    </Tooltip>
  );
}
```

### src/shared/ui/copy/CopyButton.tsx

```tsx
import { IconButton, Tooltip } from "@mui/material";
import { useCopy } from "./useCopy";
import { ContentCopy } from "@mui/icons-material";

interface Props {
  value: string;
  message?: string;
  hint?: string;
}

export const CopyButton = (props: Props) => {
  const { value, message, hint } = props;

  const { copy } = useCopy();

  const handleCopyClick = () => {
    copy(value, message);
  };

  return (
    <Tooltip title={hint}>
      <IconButton
        size="small"
        color="inherit"
        onClick={handleCopyClick}
        sx={{
          border: "none",
          color: "inherit",
          p: 0.25,
        }}
      >
        <ContentCopy sx={{ fontSize: 14, color: "inherit" }} />
      </IconButton>
    </Tooltip>
  );
};
```

### src/shared/ui/copy/index.ts

```ts
export { CopyButton } from "./CopyButton";
export { useCopy } from "./useCopy";
```

### src/shared/ui/copy/useCopy.ts

```ts
import { useAppNotifications } from "../../notifications";

export const useCopy = () => {
  const { notifyError, notifySuccess } = useAppNotifications();

  const copy = async (value: string, message?: string) => {
    try {
      await navigator.clipboard.writeText(value);
      if (message) notifySuccess(message);
    } catch {
      notifyError("Не удалось скопировать");
    }
  };

  return { copy };
};
```

### src/shared/ui/DataField.tsx

```tsx
import { Stack, Typography, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";

export type DataFieldProps = {
  label: ReactNode;
  value?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  accent?: boolean;
  emptyValue?: ReactNode;
  stackSx?: SxProps<Theme>;
  valueSx?: SxProps<Theme>;
};

function DataField({
  label,
  value,
  children,
  action,
  accent = false,
  emptyValue = "\u2014",
  stackSx,
  valueSx,
}: DataFieldProps) {
  const resolvedValue = value ?? emptyValue;

  return (
    <Stack spacing={0.25} sx={{ minWidth: 0, ...stackSx }}>
      <Typography variant="fieldLabel">{label}</Typography>
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ minWidth: 0 }}
      >
        {children ?? (
          <Typography
            variant={accent ? "bodyAccent" : "body2"}
            sx={{
              minWidth: 0,
              overflowWrap: "anywhere",
              ...valueSx,
            }}
          >
            {resolvedValue}
          </Typography>
        )}
        {action}
      </Stack>
    </Stack>
  );
}

export default DataField;
```

### src/shared/ui/dictionary/ClosureCodeSelect.tsx

```tsx
import { type ReactNode } from "react";
import { useGetCloseCodesQuery } from "@shared/queries/dictionaryApi";
import { FormInputDropdown } from "@shared/ui";
import type { FieldValues, Control } from "react-hook-form";

interface ClosureCodeSelectProps<TFieldValues extends FieldValues> {
  name: string;
  control: Control<TFieldValues>;
  entityType?: string;
}

export function ClosureCodeSelect<TFieldValues extends FieldValues>({
  name,
  control,
  entityType,
}: ClosureCodeSelectProps<TFieldValues>): ReactNode {
  const { data, isLoading } = useGetCloseCodesQuery(entityType || undefined);

  const options =
    data?.items?.map((item) => ({
      value: item.value,
      label: item.label,
    })) ?? [];

  return (
    <FormInputDropdown
      name={name}
      control={control}
      label="Код закрытия *"
      options={options}
      disabled={isLoading}
    />
  );
}
```

### src/shared/ui/dictionary/IncidentReasonSelect.tsx

```tsx
import { type ReactNode } from "react";
import { useGetIncReasonQuery } from "@shared/queries/dictionaryApi";
import { FormInputDropdown } from "@shared/ui";
import type { FieldValues, Control } from "react-hook-form";

interface IncidentReasonSelectProps<TFieldValues extends FieldValues> {
  name: string;
  control: Control<TFieldValues>;
}

export function IncidentReasonSelect<TFieldValues extends FieldValues>({
  name,
  control,
}: IncidentReasonSelectProps<TFieldValues>): ReactNode {
  const { data, isLoading } = useGetIncReasonQuery();

  const options =
    data?.items?.map((item) => ({
      value: item.value,
      label: item.label,
    })) ?? [];

  return (
    <FormInputDropdown
      name={name}
      control={control}
      label="Причина инцидента *"
      options={options}
      disabled={isLoading}
    />
  );
}
```

### src/shared/ui/dictionary/index.ts

```ts
export { ClosureCodeSelect } from "./ClosureCodeSelect";
export { IncidentReasonSelect } from "./IncidentReasonSelect";
export { LateReasonSelect } from "./LateReasonSelect";
```

### src/shared/ui/dictionary/LateReasonSelect.tsx

```tsx
import { type ReactNode } from "react";
import { useGetLateReasonQuery } from "@shared/queries/dictionaryApi";
import { FormInputDropdown } from "@shared/ui";
import type { FieldValues, Control } from "react-hook-form";

interface LateReasonSelectProps<TFieldValues extends FieldValues> {
  name: string;
  control: Control<TFieldValues>;
}

export function LateReasonSelect<TFieldValues extends FieldValues>({
  name,
  control,
}: LateReasonSelectProps<TFieldValues>): ReactNode {
  const { data, isLoading } = useGetLateReasonQuery();

  const options =
    data?.items?.map((item) => ({
      value: item.value,
      label: item.label,
    })) ?? [];

  return (
    <FormInputDropdown
      name={name}
      control={control}
      label="Причина нарушения КС *"
      options={options}
      disabled={isLoading}
    />
  );
}
```

### src/shared/ui/esm/OpenInESMButton.tsx

```tsx
import { Button } from "@mui/material";
import { getEsmLink } from "@shared/utils";

interface Props {
  businessId: string;
  title?: string;
}

export const OpenInEsmButton = (props: Props) => {
  const { businessId, title } = props;

  const handleOpenInEsm = () => {
    getEsmLink(businessId).then((link) => window.open(link, "_blank"));
  };

  return (
    <Button
      size="small"
      variant="contained"
      onClick={handleOpenInEsm}
      color="success"
    >
      {title ? title : "Открыть в ESM"}
    </Button>
  );
};
```

### src/shared/ui/index.ts

```ts
export { default as DataField } from "./DataField";
export { default as SectionHeader } from "./SectionHeader";
export { default as ToolPanelHeader } from "./ToolPanelHeader";
export { ActionIconButton } from "./ActionIconButton";

// React Hook Form wrappers
export { FormInputText } from "./rhf/FormInputText";
export { FormInputDropdown } from "./rhf/FormInputDropdown";
export { FormInputRadio } from "./rhf/FormInputRadio";
export { FormInputDate } from "./rhf/FormInputDate";
export { FormInputMultiCheckbox } from "./rhf/FormInputMultiCheckbox";
export { FormInputSlider } from "./rhf/FormInputSlider";
export {
  FormInputAutocomplete,
  type FormInputAutocompleteProps,
  type AutocompleteOption,
} from "./rhf/FormInputAutocomplete";
export { FormInputSwitch } from "./rhf/FormInputSwitch";
export { FormInputToggleGroup } from "./rhf/FormInputToggleGroup";
export { FormTabs } from "./rhf/FormTabs";
export type { FormInputProps } from "./rhf/FormInputProps";

// Dictionary selectors
export {
  ClosureCodeSelect,
  IncidentReasonSelect,
  LateReasonSelect,
} from "./dictionary";

// ESM
export { OpenInEsmButton } from "./esm/OpenInESMButton";

export { CopyButton, useCopy } from "./copy";
```

### src/shared/ui/rhf/FormInputAutocomplete.tsx

```tsx
import { Controller, useController } from "react-hook-form";
import { Autocomplete, TextField, type AutocompleteProps } from "@mui/material";
import { useRef } from "react";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import { useFieldDraft } from "@shared/ui/rhf/useFieldDraft";
import { isEqual } from "lodash";

export interface AutocompleteOption<Value> {
  label: string;
  value: Value;
}

export type FormInputAutocompleteProps<
  Value,
  TFieldValues extends FieldValues,
> = FormInputProps<TFieldValues> & {
  options: AutocompleteOption<Value>[];
} & Partial<
    AutocompleteProps<
      AutocompleteOption<Value>,
      undefined,
      undefined,
      undefined
    >
  >;

export function FormInputAutocomplete<Value, TFieldValues extends FieldValues>(
  props: FormInputAutocompleteProps<Value, TFieldValues>,
) {
  const {
    name,
    control,
    label,
    rules,
    options,
    persistScope,
    draftStoreName,
    disabled,
    ...autocompleteProps
  } = props;

  const { field } = useController({ name, control });

  const { clearDraft } = useFieldDraft({
    scope: persistScope,
    field: name as string,
    getValue: () => String(field.value ?? ""),
    storeName: draftStoreName,
  });

  const clearedRef = useRef(false);

  const clearDraftOnce = () => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    void clearDraft();
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const autocompleteValue =
          options.find((o) => isEqual(o.value, value)) ?? null;

        return (
          <Autocomplete
            loadingText="Загрузка данных..."
            noOptionsText="Нет данных"
            {...autocompleteProps}
            options={options}
            getOptionLabel={(opt) => opt.label ?? ""}
            isOptionEqualToValue={(o, v) => isEqual(o, v)}
            value={autocompleteValue}
            disabled={disabled}
            onInputChange={(_, newVal) => {
              if (!autocompleteProps.freeSolo) return;
              onChange(newVal);
              clearDraftOnce();
            }}
            onChange={(_, newVal) => {
              onChange(newVal ? newVal.value : null);
              clearDraftOnce();
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                error={!!error}
                helperText={error ? error.message : null}
                size="small"
              />
            )}
          />
        );
      }}
    />
  );
}
```

### src/shared/ui/rhf/FormInputDate.tsx

```tsx
import { Controller } from "react-hook-form";
import {
  DatePicker,
  type DatePickerProps,
} from "@mui/x-date-pickers/DatePicker";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import type { Dayjs } from "dayjs";

/**
 * DatePicker, обёрнутый в RHF Controller.
 * LocalizationProvider уже есть в AppRoot (AdapterDayjs).
 */
export function FormInputDate<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  ...datePickerProps
}: FormInputProps<TFieldValues> & DatePickerProps<Dayjs>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DatePicker
          {...datePickerProps}
          label={label}
          value={value}
          onChange={(newValue) => onChange(newValue)}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              error: !!error,
              helperText: error ? error.message : null,
            },
          }}
        />
      )}
    />
  );
}
```

### src/shared/ui/rhf/FormInputDateTimePicker.tsx

```tsx
import { Controller } from "react-hook-form";

import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import type { Dayjs } from "dayjs";
import { DateTimePicker, type DateTimePickerProps } from "@mui/x-date-pickers";

/**
 * DatePicker, обёрнутый в RHF Controller.
 * LocalizationProvider уже есть в AppRoot (AdapterDayjs).
 */
export function FormInputDateTimePicker<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  control,
  label,
  ...dateTimePickerProps
}: FormInputProps<TFieldValues> & DateTimePickerProps<Dayjs>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DateTimePicker
          {...dateTimePickerProps}
          label={label}
          value={value}
          onChange={(newValue) => onChange(newValue)}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              error: !!error,
              helperText: error ? error.message : null,
            },
          }}
          timeSteps={{ minutes: 1 }}
        />
      )}
    />
  );
}
```

### src/shared/ui/rhf/FormInputDropdown.tsx

```tsx
import { Controller, useController } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";
import { useRef } from "react";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import { useFieldDraft } from "@shared/ui/rhf/useFieldDraft";

interface DropdownOption {
  label: string;
  value: string;
}

export function FormInputDropdown<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  control,
  label,
  options,
  rules,
  disabled,
  persistScope,
  draftStoreName,
}: FormInputProps<TFieldValues> & {
  options: DropdownOption[];
  disabled?: boolean;
}) {
  const { field } = useController({ name, control });

  const { clearDraft } = useFieldDraft({
    scope: persistScope,
    field: name as string,
    getValue: () => String(field.value ?? ""),
    storeName: draftStoreName,
  });

  const clearedRef = useRef(false);

  const clearDraftOnce = () => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    void clearDraft();
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl size="small" fullWidth error={!!error}>
          <InputLabel>{label}</InputLabel>
          <Select
            label={label}
            onChange={(e) => {
              onChange(e);
              clearDraftOnce();
            }}
            value={value}
            disabled={disabled}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {error?.message ? (
            <FormHelperText>{error.message}</FormHelperText>
          ) : null}
        </FormControl>
      )}
    />
  );
}
```

### src/shared/ui/rhf/FormInputMultiCheckbox.tsx

```tsx
import { Controller, type UseFormSetValue } from "react-hook-form";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import { useState, useEffect } from "react";

interface CheckboxOption {
  label: string;
  value: string;
}

export function FormInputMultiCheckbox<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  control,
  setValue,
  label,
  options,
}: FormInputProps<TFieldValues> & {
  options: CheckboxOption[];
  setValue: UseFormSetValue<TFieldValues>;
}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelect = (val: string) => {
    if (selectedItems.includes(val)) {
      setSelectedItems(selectedItems.filter((item) => item !== val));
    } else {
      setSelectedItems([...selectedItems, val]);
    }
  };

  useEffect(() => {
    setValue(name, selectedItems);
  }, [name, selectedItems, setValue]);

  return (
    <FormControl size="small" variant="outlined">
      <FormLabel component="legend">{label}</FormLabel>
      {options.map((opt) => (
        <FormControlLabel
          key={opt.value}
          control={
            <Controller
              name={name}
              control={control}
              render={() => (
                <Checkbox
                  checked={selectedItems.includes(opt.value)}
                  onChange={() => handleSelect(opt.value)}
                />
              )}
            />
          }
          label={opt.label}
        />
      ))}
    </FormControl>
  );
}
```

### src/shared/ui/rhf/FormInputProps.ts

```ts
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import type { StoreName } from "@shared/cache";

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  rules?: Omit<
    RegisterOptions<TFieldValues>,
    "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  /** Включает персист черновика поля в IndexedDB */
  persistScope?: string;
  /** Хранилище для черновиков. Обязателен при persistScope. */
  draftStoreName?: StoreName;
  /** Сохраняет значение, при указанном draftStoreName в IndexedDB. */
  saveOnInput?: boolean;
  /** Отключает поле (при отправке формы) */
  disabled?: boolean;
  /** Колбэк после записи черновика */
  onDraftSaved?: () => void;
  /** Задержка debounce для записи в форму. Если 0 или не указано -- запись мгновенная */
  debounceMs?: number;
}
```

### src/shared/ui/rhf/FormInputRadio.tsx

```tsx
import { Controller } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";

interface RadioOption {
  label: string;
  value: string;
}

export function FormInputRadio<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  options,
}: FormInputProps<TFieldValues> & { options: RadioOption[] }) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <RadioGroup value={value} onChange={onChange}>
            {options.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio />}
                label={opt.label}
              />
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
}
```

### src/shared/ui/rhf/FormInputSlider.tsx

```tsx
import { Controller, type UseFormSetValue } from "react-hook-form";
import { FormLabel, Slider } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import { useState, useEffect } from "react";

export function FormInputSlider<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  control,
  setValue,
  label,
}: FormInputProps<TFieldValues> & { setValue: UseFormSetValue<TFieldValues> }) {
  const [sliderValue, setSliderValue] = useState<number>(30);

  useEffect(() => {
    if (sliderValue !== undefined) setValue(name, sliderValue);
  }, [name, sliderValue, setValue]);

  const handleChange = (_: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  return (
    <>
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={() => (
          <Slider
            value={sliderValue}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            step={1}
          />
        )}
      />
    </>
  );
}
```

### src/shared/ui/rhf/FormInputSwitch.tsx

```tsx
import { Controller } from "react-hook-form";
import { FormControlLabel, Switch } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";

export function FormInputSwitch<
  TFieldValues extends FieldValues = FieldValues,
>({ name, control, label }: FormInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          control={<Switch checked={!!value} onChange={onChange} />}
          label={label ?? ""}
        />
      )}
    />
  );
}
```

### src/shared/ui/rhf/FormInputText.tsx

```tsx
import { Controller, useController } from "react-hook-form";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
} from "react";
import TextField from "@mui/material/TextField";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";
import { useFieldDraft } from "@shared/ui/rhf/useFieldDraft";
import { debounce } from "@shared/utils";

type TextFieldSlotProps = {
  textField?: Partial<React.ComponentProps<typeof TextField>>;
};

export function FormInputText<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  rules,
  slotProps,
  persistScope,
  draftStoreName,
  saveOnInput,
  disabled,
  debounceMs,
}: FormInputProps<TFieldValues> & { slotProps?: TextFieldSlotProps }) {
  const { field } = useController({ name, control });

  const { clearDraft, save } = useFieldDraft({
    scope: persistScope,
    field: name as string,
    getValue: () => String(field.value ?? ""),
    storeName: draftStoreName,
  });

  const clearedRef = useRef(false);

  const debouncedWrite = useMemo(() => {
    if (debounceMs == null || debounceMs === 0) return null;
    return debounce((value: string) => {
      field.onChange(value);
    }, debounceMs);
  }, [debounceMs, field]);

  const shouldSaveValueOnChange = persistScope && draftStoreName && saveOnInput;

  const clearDraftOnce = () => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    void clearDraft();
  };

  useEffect(() => {
    return () => {
      debouncedWrite?.cancel();
    };
  }, [debouncedWrite]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (debouncedWrite) {
        debouncedWrite(e.target.value);
      } else {
        field.onChange(e);
      }
      clearDraftOnce();
      shouldSaveValueOnChange && save(e.target.value);
    },
    [debouncedWrite, field, shouldSaveValueOnChange, save, clearDraftOnce],
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange: _, value }, fieldState: { error } }) => (
        <TextField
          {...slotProps?.textField}
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          onChange={handleChange}
          value={debounceMs ? undefined : value}
          fullWidth
          label={label}
          variant="outlined"
          disabled={disabled}
        />
      )}
    />
  );
}
```

### src/shared/ui/rhf/FormInputToggleGroup.tsx

```tsx
import { Controller } from "react-hook-form";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { FormInputProps } from "./FormInputProps";

interface ToggleOption {
  label: string;
  value: string;
}

export function FormInputToggleGroup<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  control,
  label,
  options,
}: FormInputProps<TFieldValues> & { options: ToggleOption[] }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <ToggleButtonGroup
          value={value}
          onChange={(_, newValue) => onChange(newValue)}
          exclusive
          size="small"
        >
          {options.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    />
  );
}
```

### src/shared/ui/rhf/FormTabs.tsx

```tsx
import { Tab, Tabs, type TabsProps } from "@mui/material";
import { Controller, useController, type FieldValues } from "react-hook-form";

import type { FormInputProps } from "./FormInputProps";
import { useFieldDraft } from "./useFieldDraft";
import { useRef } from "react";

interface TabItem {
  value: string;
  label: string;
}

interface TabProps extends TabsProps {
  tabs: readonly TabItem[];
}

type Props<TFieldValues extends FieldValues = FieldValues> = Omit<
  FormInputProps<TFieldValues>,
  "label"
> &
  TabProps;

export const FormTabs = <TFieldValues extends FieldValues = FieldValues>(
  props: Props<TFieldValues>,
) => {
  const {
    name,
    control,
    rules,
    persistScope,
    draftStoreName,
    saveOnInput,
    disabled,
    tabs,
    sx: tabsSx,
  } = props;

  const { field } = useController({ name, control });

  const { clearDraft, save } = useFieldDraft({
    scope: persistScope,
    field: name as string,
    getValue: () => String(field.value ?? ""),
    storeName: draftStoreName,
  });

  const clearedRef = useRef(false);

  const shouldSaveValueOnChange = persistScope && draftStoreName && saveOnInput;

  const clearDraftOnce = () => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    void clearDraft();
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <Tabs
          variant="standard"
          sx={tabsSx}
          value={value}
          onChange={(_, value) => {
            onChange(value);
            clearDraftOnce();
            shouldSaveValueOnChange && save(value);
          }}
        >
          {tabs.map((tab) => (
            <Tab
              disabled={disabled}
              value={tab.value}
              key={tab.value}
              label={tab.label}
            />
          ))}
        </Tabs>
      )}
    />
  );
};
```

### src/shared/ui/rhf/useFieldDraft.ts

```ts
import { useCallback } from "react";
import { getStorageProvider, type StoreName } from "@shared/cache";

const buildKey = (scope: string, field: string) => `${scope}:${field}`;

type UseFieldDraftArgs = {
  scope?: string;
  field: string;
  getValue: () => string;
  storeName?: StoreName;
};

export function useFieldDraft({
  scope,
  field,
  getValue,
  storeName,
}: UseFieldDraftArgs) {
  const enabled = !!(scope && storeName);

  const save = useCallback(
    async (value: ReturnType<typeof getValue>) => {
      if (!enabled) return;
      await getStorageProvider().setRecord<string>(
        storeName!,
        buildKey(scope!, field),
        value,
      );
    },
    [enabled, storeName, scope, field, getValue],
  );

  const clearDraft = useCallback(async () => {
    if (!enabled) return;
    try {
      await getStorageProvider().deleteRecord(
        storeName!,
        buildKey(scope!, field),
      );
    } catch {
      /* идемпотентно */
    }
  }, [enabled, storeName, scope, field]);

  const clearAllDrafts = useCallback(async () => {
    if (!enabled) return;
    const prefix = `${scope!}:`;
    const all = await getStorageProvider().getAllRecords<string>(storeName!);
    await Promise.all(
      all
        .filter((r) => r.key.startsWith(prefix))
        .map((r) => getStorageProvider().deleteRecord(storeName!, r.key)),
    );
  }, [enabled, storeName, scope]);

  return { save, clearDraft, clearAllDrafts };
}
```

### src/shared/ui/SectionHeader.tsx

```tsx
import { Typography, type TypographyProps } from "@mui/material";

export type SectionHeaderProps = Omit<TypographyProps, "variant"> & {
  children: TypographyProps["children"];
};

function SectionHeader({ children, sx, ...props }: SectionHeaderProps) {
  return (
    <Typography
      variant="sectionHeader"
      sx={{
        mb: 1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

export default SectionHeader;
```

### src/shared/ui/ToolPanelHeader.tsx

```tsx
import { Stack, Typography, type StackProps } from "@mui/material";

export type ToolPanelHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  stackProps?: StackProps;
};

function ToolPanelHeader({
  eyebrow,
  title,
  description,
  stackProps,
}: ToolPanelHeaderProps) {
  return (
    <Stack spacing={0.5} {...stackProps}>
      <Typography variant="panelEyebrow">{eyebrow}</Typography>
      <Typography variant="bodyAccent">{title}</Typography>
      <Typography variant="fieldLabel">{description}</Typography>
    </Stack>
  );
}

export default ToolPanelHeader;
```

### src/shared/user/api/index.ts

```ts
import { baseApi } from "../../api";

import type { UserCommonDTO, UserInfoDTO, UserDirectionDTO } from "../types";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query<UserInfoDTO, void>({
      query: () => ({
        url: "web-ews-middle/user/info",
        method: "GET",
      }),
    }),
    getUserCommon: builder.query<UserCommonDTO, void>({
      query: () => ({
        url: "web-ews-middle/user/common",
        method: "GET",
      }),
    }),
    getUserDirection: builder.query<UserDirectionDTO, void>({
      query: () => ({
        url: "web-ews-middle/user/direction",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useGetUserCommonQuery,
  useGetUserDirectionQuery,
} = userApi;
```

### src/shared/user/index.ts

```ts
export { useUser, AuthGuard } from "./model";

export { type UserInfoDTO } from "./types";

export { isBOUser } from "./utils";
```

### src/shared/user/model/AuthGuard.tsx

```tsx
import type { PropsWithChildren, ReactNode } from "react";
import { useEffect, useRef, useCallback } from "react";
import {
  Backdrop,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { extractErrorMessage } from "@shared/api";
import { WORKLOG_ACTIONS, useWorklogLogger } from "@shared/worklog-logger";

import { UserRole } from "../types";
import { useUser } from "./useUser";

export function AuthGuard(props: PropsWithChildren) {
  const { children } = props;

  const log = useWorklogLogger();
  const startedRef = useRef(false);
  const { user, isLoading, error } = useUser();

  const logStart = useCallback(() => {
    if (!startedRef.current && user?.employeeNumber) {
      startedRef.current = true;
      log({
        action: WORKLOG_ACTIONS.APP_START,
        task: "Information",
        commentParams: { tn: user.employeeNumber },
      });
    }
  }, [user, log]);

  useEffect(() => {
    logStart();
  }, [logStart]);

  if (isLoading) return <AuthOverlay />;

  if (error) {
    const message =
      "data" in error &&
      (extractErrorMessage(error.data) ?? "Неизвестная ошибка");

    return (
      <AuthError>
        {"status" in error && (
          <ErrorMessage title="Код ответа:" content={error.status} />
        )}
        {message && <ErrorMessage title="Ошибка:" content={message} />}
      </AuthError>
    );
  }

  if (!user)
    return (
      <AuthError>
        <ErrorMessage
          title="Ошибка:"
          content="Не удалось получить пользователя"
        />
      </AuthError>
    );

  const VALID_USER_ROLES = [UserRole.EFS_SBERASSIST_ENGEENER];

  const isUserHasValidRoles = user?.roles?.some((r) =>
    VALID_USER_ROLES.includes(r),
  );

  if (!isUserHasValidRoles)
    return (
      <AuthError>
        <ErrorMessage
          title="Необходимые роли:"
          content={VALID_USER_ROLES.join(", ")}
        />
        <ErrorMessage
          title="Пользовательские роли:"
          content={user.roles.join(", ")}
        />
      </AuthError>
    );

  return children;
}

function AuthOverlay() {
  return (
    <Backdrop open>
      <Stack spacing={1.5} alignItems="center">
        <CircularProgress />
        <Typography>Загружаем пользователя...</Typography>
      </Stack>
    </Backdrop>
  );
}

function AuthError(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <Stack height="100vh" alignItems="center" justifyContent="center">
      <Paper variant="outlined" sx={{ p: 1.5, maxWidth: 700, width: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Ошибка авторизации
        </Typography>
        <Stack spacing={0.5}>{children}</Stack>
      </Paper>
    </Stack>
  );
}

function ErrorMessage(props: { title: string; content: number | string }) {
  const { title, content } = props;

  return (
    <Stack direction="row" spacing={0.5}>
      <Typography whiteSpace="nowrap" color="textSecondary">
        {title}
      </Typography>
      <Typography>{content}</Typography>
    </Stack>
  );
}
```

### src/shared/user/model/index.ts

```ts
export { useUser } from "./useUser";
export { AuthGuard } from "./AuthGuard";
```

### src/shared/user/model/useUser.ts

```ts
import {
  useGetUserCommonQuery,
  useGetUserDirectionQuery,
  useGetUserInfoQuery,
} from "../api";

export const useUser = () => {
  const userInfoQ = useGetUserInfoQuery();
  const userCommonQ = useGetUserCommonQuery();
  const userDirectionQ = useGetUserDirectionQuery(undefined, {
    selectFromResult: (state) => ({
      ...state,
      data: state.isError && !state.data ? { direction: "Общее" } : state.data,
    }),
  });

  return {
    user: {
      ...userInfoQ.data,
      ...userCommonQ.data,
      ...userDirectionQ.data,
    },
    isLoading:
      userInfoQ.isLoading || userCommonQ.isLoading || userDirectionQ.isLoading,
    error: userInfoQ.error ?? userCommonQ.error,
  };
};
```

### src/shared/user/types/index.ts

```ts
export { type UserInfoDTO } from "./UserInfo.dto";
export { type UserCommonDTO } from "./UserCommon.dto";
export { type UserDirectionDTO } from "./UserDirection.dto";

export { UserRole } from "./UserRole.enum";
```

### src/shared/user/types/UserCommon.dto.ts

```ts
import type { UserRole } from "./UserRole.enum";

export interface UserCommonDTO {
  login: string;
  fio: string;
  employeeNumber: string;
  roles: UserRole[];
}
```

### src/shared/user/types/UserDirection.dto.ts

```ts
export interface UserDirectionDTO {
  direction: string;
}
```

### src/shared/user/types/UserInfo.dto.ts

```ts
export interface UserInfoDTO {
  sapId: string;
  smId: string;
  smName: string;
  fullName: string;
  lastName: string;
  firstName: string;
  middleName: string;
  phoneNumberPrimary: string;
  phoneNumberSecond: string;
  emailPrimary: string;
  emailSecond: string;
  department: string;
  unit: string;
  subdivision: string;
  empCity: string;
  smPosition: string;
  empDirId: string;
  empDirFio: string;
  fosDirId: string;
  fosDirFio: string;
  /** UUID пользователя */
  empObjectId: string;
}
```

### src/shared/user/types/UserRole.enum.ts

```ts
export enum UserRole {
  EFS_SBERASSIST_RMAP_USER = "EFS_SBERASSIST_RMAP_USER",
  EFS_SBERASSIST_RMAP_MANAGEMENT = "EFS_SBERASSIST_RMAP_MANAGEMENT",
  EFS_SBERASSIST_BASE = "EFS_SBERASSIST_BASE",
  EFS_SBERASSIST_MANAGER = "EFS_SBERASSIST_MANAGER",
  EFS_SBERASSIST_OPERATOR = "EFS_SBERASSIST_OPERATOR",
  EFS_SBERASSIST_ENGEENER = "EFS_SBERASSIST_ENGEENER",
  EFS_SBERASSIST_VIP = "EFS_SBERASSIST_VIP",
  EFS_SBERASSIST_KOORDINATOR = "EFS_SBERASSIST_KOORDINATOR",
  EFS_SBERASSIST_EMPLOYEE_CC = "EFS_SBERASSIST_EMPLOYEE_CC",
  EFS_SBERASSIST_CHIEF = "EFS_SBERASSIST_CHIEF",
}
```

### src/shared/user/utils/index.ts

```ts
export { isBOUser } from "./isBOUser";
```

### src/shared/user/utils/isBOUser.ts

```ts
import { UserRole, type UserCommonDTO, type UserInfoDTO } from "../types";

const BO_USER = "ЦИТППБО";

/** Проверяет принадлежность пользователя к ЦИТППБО */
export const isBOUser = (user: UserInfoDTO & UserCommonDTO) => {
  return (
    user.unit.toLocaleUpperCase() === BO_USER &&
    [UserRole.EFS_SBERASSIST_OPERATOR].every((r) => user.roles.includes(r))
  );
};
```

### src/shared/utils/backlog.ts

```ts
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

export type BacklogThresholds = Record<string, number>;

dayjs.extend(duration);

/**
 * Пороги для определения номера ближайшего бэклога (в днях от создания заявки).
 * Ключ -- номер бэклога, значение -- минимальное количество дней,
 * при котором используется данный номер.
 */
const BACKLOG_THRESHOLDS: BacklogThresholds = {
  "1": 0, // менее 1 дня
  "2": 1, // 1--2 дня
  "5": 2, // 2--5 дней
  "6": 5, // 5--6 дней
};

const DAY_MS = 1000 * 60 * 60 * 24;
const HOUR_MS = 1000 * 60 * 60;
const MINUTE_MS = 1000 * 60;

export interface BacklogLabelInfo {
  name: string;
  color: string;
  tooltip: string;
}

export interface BacklogInfoResult {
  labelInfo: BacklogLabelInfo | null;
  backlogMs: number | null;
}

/**
 * Определяет номер бэклога на основе прошедших дней с момента создания заявки.
 * @param createdDateMs -- время создания заявки в миллисекундах (Date.getTime())
 * @param nowMs -- текущее время в миллисекундах (Date.getTime())
 * @returns номер бэклога (0 если не определён)
 */
function getBacklogNumber(createdDateMs: number, nowMs: number): number {
  const elapsedDays = (nowMs - createdDateMs) / DAY_MS;

  // Если заявка старше 6 дней -- ближайшего бэклога нет
  if (elapsedDays >= BACKLOG_THRESHOLDS["6"] + 1) return 0;

  // Ищем максимальный номер, для которого порог выполнен
  const entries = Object.entries(BACKLOG_THRESHOLDS).sort(
    ([, a], [, b]) => Number(b) - Number(a),
  );

  for (const [number, thresholdDays] of entries) {
    if (elapsedDays >= thresholdDays) {
      return Number(number);
    }
  }

  return 0;
}

/**
 * Вычисляет время до ближайшего бэклога и информацию для отображения метки.
 * @param createdAt -- ISO-строка или Date создания заявки
 * @param now -- текущее время (dayjs или number)
 * @returns объект { labelInfo, backlogMs } или null при номере бэклога 0
 */
export function getBacklogInfo(
  createdAt: string | Date | null | undefined,
): { labelInfo: BacklogLabelInfo | null; backlogMs: number | null } | null {
  if (!createdAt) return null;

  const nowDate = dayjs().startOf("minute");
  const nowMs =
    nowDate instanceof dayjs ? nowDate.valueOf() : (nowDate as number);
  const createdMs =
    createdAt instanceof Date
      ? createdAt.getTime()
      : new Date(createdAt).getTime();

  if (!createdMs || Number.isNaN(createdMs)) return null;

  const backlogNumber = getBacklogNumber(createdMs, nowMs);

  if (backlogNumber === BACKLOG_THRESHOLDS["1"]) return null;

  // Время наступления ближайшего бэклога
  const backlogTargetMs = createdMs + DAY_MS * backlogNumber;

  // Оставшееся время
  const backlogMs = backlogTargetMs - nowMs;

  // Название метки: "БЛ<номер>" + отформатированное время
  const myDuration = dayjs.duration(Math.max(0, backlogMs));
  const days = myDuration.days();
  const hours = myDuration.hours();
  const minutes = myDuration.minutes();
  const formattedDuration =
    days > 0
      ? `${days}д ${hours}ч`
      : hours > 0
        ? `${hours}ч ${minutes}м`
        : `${minutes}м`;
  const name = `БЛ${backlogNumber} ${formattedDuration}`;

  // Цвет фона: >4ч -- чёрный, <=4ч -- оранжевый
  const color = backlogMs > HOUR_MS * 4 ? "textPrimary" : "orange";

  return {
    labelInfo: {
      name,
      color,
      tooltip: "Остаток времени до ближайшего бэклога",
    },
    backlogMs,
  };
}
```

### src/shared/utils/debounce.ts

```ts
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delayMs: number,
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, delayMs);
  };

  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
```

### src/shared/utils/declension.ts

```ts
/**
 * Склонение русских существительных по правилам:
 *   1 --> nominative, 2-4 --> genitive singular, 5-0 --> genitive plural
 *   Исключение: 11-14 --> всегда genitive plural
 *
 * Examples:
 *   declension(1, {минута: ['минута', 'минуты', 'минут']}) --> "1 минута"
 *   declension(40, {минута: ['минута', 'минуты', 'минут']}) --> "40 минут"
 *   declension(100, {день: ['день', 'дня', 'дней']}) --> "100 дней"
 */
export function declension(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const lastDigit = abs % 10;

  if (abs > 10 && abs < 20) return `${n} ${forms[2]}`;
  if (lastDigit > 1 && lastDigit < 5) return `${n} ${forms[1]}`;
  if (lastDigit === 1) return `${n} ${forms[0]}`;
  return `${n} ${forms[2]}`;
}
```

### src/shared/utils/esm.ts

```ts
export const getEsmLink = async (businessId: string) => {
  let stendUrl = "";
  try {
    const config = await (
      await fetch(`${document.location.origin}/web-ews-ui/config.json`)
    ).json();
    stendUrl = config.SBER_ESM_URL;
  } catch {
    //
  }

  let baseLink = `${stendUrl}/efs-ermops-static/app-ops_esm/`;

  const upperBusinessId = businessId.toUpperCase();

  if (upperBusinessId.startsWith("SRT")) {
    baseLink += "znr";
  } else if (upperBusinessId.startsWith("SR")) {
    baseLink += "zno";
  } else if (upperBusinessId.startsWith("INCT")) {
    baseLink += "zpi";
  } else if (upperBusinessId.startsWith("INC")) {
    baseLink += "incident";
  }

  return `${baseLink}?businessId=${businessId}`;
};
```

---

## Итого

- **15 поддиректорий**
- **~79 файлов** (TS + TSX)
- Основные модули: `api`, `cache`, `ui`, `user`, `request`, `routing`, `protocol`, `dev`, `hooks`, `notifications`
