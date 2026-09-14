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
      title: `Инфо-сбой в модуле «${moduleName}»`,
      description:
        "Модуль продолжает отвечать, но часть данных может быть неполной. Можно безопасно перезагрузить блок.",
      severity: "info",
      retryLabel: "Обновить",
    };
  }

  if (kind === "action") {
    return {
      title: `Сбой действия в модуле «${moduleName}»`,
      description:
        "Просмотр доступен, но выполнение сценариев временно нарушено. Перезапустите блок и повторите действие.",
      severity: "warning",
      retryLabel: "Повторить",
    };
  }

  if (kind === "auth") {
    return {
      title: `Ошибка доступа в модуле «${moduleName}»`,
      description:
        "Модуль недоступен из-за ограничений доступа или истекшей авторизации. Проверьте права и перезагрузите блок.",
      severity: "warning",
      retryLabel: "Проверить доступ",
    };
  }

  if (kind === "critical") {
    return {
      title: `Критическая ошибка в модуле «${moduleName}»`,
      description:
        "Модуль аварийно остановлен и не может продолжить работу. Требуется полный перезапуск блока.",
      severity: "error",
      retryLabel: "Перезапустить",
    };
  }

  return {
    title: `Ошибка в модуле «${moduleName}»`,
    description: "Модуль временно недоступен. Попробуйте перезагрузить.",
    severity: "warning",
    retryLabel: "Перезагрузить",
  };
};
