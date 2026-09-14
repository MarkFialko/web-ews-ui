import { useEffect, useCallback } from "react";
import { useAppDispatch } from "@app/hooks";
import { useFeatureFlag } from "@shared/hooks/useFeatureFlag";
import { flush } from "../model/buffer";
import { setWorklogSender } from "../model/worklogSender";
import { worklogLogsApi } from "../api/worklogLogsApi";
import { classifyWorklogError } from "../utils/classifyWorklogError";
import { WORKLOG_ACTIONS } from "../constants/actions";
import { useWorklogLogger } from "./useWorklogLogger";
import {
  WORKLOG_MAX_BATCH_INTERVAL_MS,
  WORKLOG_INACTIVITY_THRESHOLD_MS,
} from "../constants/limits";

/**
 * Эпизод простоя живёт на уровне модуля, а не в замыкании эффекта: StrictMode
 * дважды монтирует эффекты, и каждая копия замыкания считала бы эпизод своим —
 * отсюда дубль ews.inactive_end с разницей в миллисекунду. Общее состояние
 * (и флаг, и метка) одно на всё приложение, сколько бы раз ни смонтировался хук.
 */
let lastActivity = Date.now();
let inactiveLogged = false;

/**
 * Актуальный логгер для модульных обработчиков. Хранится модульно, потому что
 * обработчики регистрируются один раз и не видят замыкание эффекта; логгер же
 * пересоздаётся при смене данных пользователя.
 */
let activeLogger: ReturnType<typeof useWorklogLogger> | null = null;

let detectorsRegistered = false;

/** Единственное место записи события простоя. Флаг выставляем до вызова записи. */
const logInactiveEnd = (idleMs: number): void => {
  if (inactiveLogged || !activeLogger) return;
  inactiveLogged = true;
  activeLogger({
    action: WORKLOG_ACTIONS.APP_INACTIVE_END,
    task: "Information",
    commentParams: { minutes: Math.floor(idleMs / 60_000) },
  });
};

const onActivity = (): void => {
  const idleMs = Date.now() - lastActivity;
  if (idleMs >= WORKLOG_INACTIVITY_THRESHOLD_MS) {
    logInactiveEnd(idleMs);
  }
  lastActivity = Date.now();
  inactiveLogged = false;
};

const onVisibilityChange = (): void => {
  if (document.visibilityState === "visible") onActivity();
};

// pagehide — страховка: если вкладка закрыта, на onActivity не дождёмся.
const onLeave = (): void => {
  const idleMs = Date.now() - lastActivity;
  if (idleMs >= WORKLOG_INACTIVITY_THRESHOLD_MS) {
    logInactiveEnd(idleMs);
  }

  // keepalive вместо sendBeacon: sendBeacon не позволяет проставить
  // заголовок авторизации, а 204 без авторизации = 401 = retry = палится очередь.
  flush({ keepalive: true }).catch(() => undefined);
};

const registerInactiveDetectors = (): void => {
  if (detectorsRegistered) return;

  window.addEventListener("mousedown", onActivity);
  window.addEventListener("keydown", onActivity);
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", onLeave);
  detectorsRegistered = true;
};

const unregisterInactiveDetectors = (): void => {
  if (!detectorsRegistered) return;

  window.removeEventListener("mousedown", onActivity);
  window.removeEventListener("keydown", onActivity);
  document.removeEventListener("visibilitychange", onVisibilityChange);
  window.removeEventListener("pagehide", onLeave);
  detectorsRegistered = false;
};

/**
 * Монтируется один раз в корне приложения. Регистрирует отправщика,
 * запускает флаши и детекцию простоя.
 *
 * При выключенном флаге логирования эффекты безопасны: они возвращаются
 * до создания таймеров, отправщиков и слушателей.
 */
export function useWorklogFlusher() {
  const loggingEnabled = useFeatureFlag("worklogLogging");
  const dispatch = useAppDispatch();
  const log = useWorklogLogger();

  // Модульные обработчики читают activeLogger в момент вызова, а не из замыкания.
  useEffect(() => {
    activeLogger = log;
    return () => {
      activeLogger = null;
    };
  }, [log]);

  useEffect(() => {
    if (!loggingEnabled) return;

    setWorklogSender(async (events, options) => {
      try {
        await dispatch(
          worklogLogsApi.endpoints.sendWorklogLogs.initiate(
            { events, keepalive: options?.keepalive },
            // Хук мутации копил бы записи в кэше RTK Query на каждую пачку, track: false отключает.
            { track: false },
          ),
        ).unwrap();

        return "delivered";
      } catch (error) {
        return classifyWorklogError(error);
      }
    });

    return () => setWorklogSender(null);
  }, [dispatch, loggingEnabled]);

  const handleFlush = useCallback(() => {
    if (!loggingEnabled) return;
    flush().catch(() => undefined);
  }, [loggingEnabled]);

  useEffect(() => {
    handleFlush();
  }, [handleFlush]);

  useEffect(() => {
    if (!loggingEnabled) return;

    const id = setInterval(handleFlush, WORKLOG_MAX_BATCH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [handleFlush, loggingEnabled]);

  useEffect(() => {
    if (!loggingEnabled) return;

    registerInactiveDetectors();
    return () => unregisterInactiveDetectors();
  }, [loggingEnabled]);

  return null;
}
