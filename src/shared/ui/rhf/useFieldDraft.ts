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
