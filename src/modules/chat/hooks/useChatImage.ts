import { useCallback, useEffect, useRef, useState } from "react";

import { getStorageProvider, STORE_NAMES } from "@shared/cache";
import { isCacheFresh } from "@shared/cache/cacheLayer";
import { CACHE_TTL_HOURS } from "@shared/constants/cache";
import type { CacheEntry } from "@shared/types/cache";

import { useLazyGetChatAttachmentQuery } from "../api";
import { buildDataUrlFromBinary, extractBinaryFromMultiPart } from "../utils";

const MS_IN_HOUR = CACHE_TTL_HOURS * 3_600_000;

/**
 * Получение изображения по GUID с приоритетом локального кэша (IndexedDB).
 * GUID передаётся ровно как в `message` (включая `{}`, без нормализации) — он используется
 * и для запроса, и для ключа кэша, чтобы они совпадали.
 */
export const useChatImage = (guid: string, mimeType?: string) => {
  const [getAttachment] = useLazyGetChatAttachmentQuery();

  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Защита от конкурентных load() в одном экземпляре и от stale-ответов при смене guid.
  const inFlightRef = useRef(false);
  const guidRef = useRef(guid);

  useEffect(() => {
    guidRef.current = guid;
  }, [guid]);

  const load = useCallback(async () => {
    if (!guid) return;
    // Запрос уже в полёте — не дублируем.
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    // Валидация MIME до сетевого запроса: без него data URL будет битым.
    const effectiveMime = mimeType?.trim();
    if (!effectiveMime) {
      inFlightRef.current = false;
      setIsError(true);
      setError("Не определён mimeType изображения");
      setIsLoading(false);
      return;
    }

    const provider = getStorageProvider();

    try {
      // 1. Кэш-first: если есть свежая запись — используем её, запрос не выполняем.
      const cached = await provider.getRecord<CacheEntry<string>>(
        STORE_NAMES.CHAT_IMAGES,
        guid,
      );
      if (isCacheFresh(cached)) {
        if (guidRef.current !== guid) return;
        setDataUrl(cached.value);
        setIsLoading(false);
        setIsError(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setIsError(false);
      setError(null);

      // 2. Нет кэша — запрашиваем multipart-ответ (уже бинарная строка Latin-1)
      //    и извлекаем бинарный файл из блока "files".
      const binaryBody = await getAttachment(guid).unwrap();
      if (guidRef.current !== guid) return;

      // 3. Перечитываем кэш: за время запроса другая миниатюра/модалка могла уже
      //    сохранить картинку — тогда берём её и НЕ дублируем запись/запрос.
      const fresh = await provider.getRecord<CacheEntry<string>>(
        STORE_NAMES.CHAT_IMAGES,
        guid,
      );
      if (isCacheFresh(fresh)) {
        if (guidRef.current !== guid) return;
        setDataUrl(fresh.value);
        setIsLoading(false);
        return;
      }

      const binaryFile = extractBinaryFromMultiPart(binaryBody, "files");
      if (!binaryFile) {
        throw new Error("Не удалось извлечь изображение из ответа");
      }
      const url = buildDataUrlFromBinary(binaryFile, effectiveMime);
      if (guidRef.current !== guid) return;

      // 4. Сначала сохраняем в кэш — к моменту появления dataUrl картинка уже доступна
      //    из кэша, поэтому открытая из миниатюры модалка возьмёт её без повторного запроса.
      try {
        await provider.setRecord(STORE_NAMES.CHAT_IMAGES, guid, {
          value: url,
          cachedAt: Date.now(),
          ttlMs: MS_IN_HOUR,
        } satisfies CacheEntry<string>);
      } catch {
        /* сбой кэширования не блокирует отображение изображения */
      }

      setDataUrl(url);
      setIsLoading(false);
    } catch (e) {
      if (guidRef.current !== guid) return;
      setIsError(true);
      setError(
        e instanceof Error ? e.message : "Не удалось загрузить изображение",
      );
      setIsLoading(false);
    } finally {
      inFlightRef.current = false;
    }
  }, [guid, mimeType, getAttachment]);

  return { dataUrl, isLoading, isError, error, load };
};
