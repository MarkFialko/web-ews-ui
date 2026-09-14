import { useEffect, useRef } from "react";
import type { EventEmitter } from "events";

/**
 * Универсальный хук для автоматической подписки/отписки на события EventEmitter.
 *
 * Автоматически:
 * - Подписывается при mount
 * - Отписывается при unmount
 * - Подписывается на новые события при их добавлении в handlers
 * - Отписывается от событий при удалении ключей из handlers
 * - Перезапускает подписку при изменении target
 *
 * Коллбэки не нужно мемоизировать через useCallback — хук хранит их в ref
 * и вызывает свежую версию при каждом событии.
 *
 * @example
 * ```tsx
 *
 * useCtiEvents(service, {
 *   [AGENT_STATE_CHANGED]: (state) => {
 *     enqueueSnackbar(`Агент: ${state}`, { variant: "info" });
 *   },
 *   [INTERACTION_COMPLETED]: () => {
 *     setShowModal(false);
 *   },
 * });
 * ```
 */
export function useCtiEvents(
  target: EventEmitter | undefined | null,
  handlers: Record<string, ((...args: unknown[]) => void) | undefined>,
): void {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const wrappersRef = useRef(new Map<string, (...args: unknown[]) => void>());

  useEffect(() => {
    if (!target) return;

    const wrappers = wrappersRef.current;
    const currentKeys = new Set(Object.keys(handlersRef.current));

    // Отписаться от событий, которых больше нет в handlers
    for (const event of [...wrappers.keys()]) {
      if (!currentKeys.has(event)) {
        target.off(event, wrappers.get(event)!);
        wrappers.delete(event);
      }
    }

    // Подписаться на текущие события
    for (const [event, handler] of Object.entries(handlersRef.current)) {
      if (!handler) continue;

      // Создаём wrapper один раз, храним в ref
      if (!wrappers.has(event)) {
        const wrapper = (...args: unknown[]) => {
          handlersRef.current[event]?.(...args);
        };
        wrappers.set(event, wrapper);
      }

      target.on(event, wrappers.get(event)!);
    }

    // Полная отписка при unmount
    return () => {
      for (const [event, wrapper] of wrappers) {
        target.off(event, wrapper);
      }
    };
  }, [target]);
}
