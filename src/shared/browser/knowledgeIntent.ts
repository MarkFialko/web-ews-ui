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
