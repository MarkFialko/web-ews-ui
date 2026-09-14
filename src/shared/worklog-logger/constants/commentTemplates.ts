import { WORKLOG_ACTIONS } from "./actions";
import { formatDateTime } from "../utils/formatDateTime";
import { maskPhone } from "../utils/phoneMask";
import { formatDurationMinutes } from "@shared/utils/time";

type TemplateFn = (params: Record<string, unknown>) => string;

const TEMPLATES: Record<string, string | TemplateFn> = {
  [WORKLOG_ACTIONS.APP_START]: (params) => {
    const tn = String(params.tn ?? "");
    return `Инженер "${tn}" запустил EWS`;
  },

  [WORKLOG_ACTIONS.APP_INACTIVE_END]: (params) =>
    `EWS был неактивен ${formatDurationMinutes(
      Math.round(Number(params.minutes ?? 0)),
    )}`,

  [WORKLOG_ACTIONS.LIST_OPEN]: "",
  [WORKLOG_ACTIONS.OPEN_TASK]: "",
  [WORKLOG_ACTIONS.OPEN_TASK_BIG]: "",
  [WORKLOG_ACTIONS.TASK_LOCAL]: "",
  [WORKLOG_ACTIONS.TASK_OUT]: "",
  [WORKLOG_ACTIONS.TASK_IN_WORK]: "",
  [WORKLOG_ACTIONS.CLOSE_TASK]: "",
  [WORKLOG_ACTIONS.TASK_REAZON]: "",
  [WORKLOG_ACTIONS.WRITE_CHAT]: "",
  [WORKLOG_ACTIONS.WRITE_INFO_PROTOCOL]: "",

  [WORKLOG_ACTIONS.WRITE_HASHTAG_DIR]: (params) => {
    const tag = String(params.tag ?? "");
    const ts = formatDateTime(
      params.ts instanceof Date ? params.ts : new Date(),
    );
    return `Инженер проставил хештег «${tag}» ${ts}`;
  },

  [WORKLOG_ACTIONS.WRITE_HASHTAG]: (params) => {
    const text = String(params.tag ?? "");
    const ts = formatDateTime(
      params.ts instanceof Date ? params.ts : new Date(),
    );
    return `Инженер проставил хештег «${text}» ${ts}`;
  },

  [WORKLOG_ACTIONS.WRITE_INFO_DECISION]: (params) => {
    const group = String(params.group ?? "");
    const codeName = String(params.codeName ?? "");
    const codeNumber = String(params.codeNumber ?? "");
    // При отсутствии сведений (поля не переданы) — пустая строка.
    if (!group && !codeName && !codeNumber) return "";
    return `${group}; ${codeName}; ${codeNumber}`;
  },

  [WORKLOG_ACTIONS.CREATE_ZNR]: (params) => {
    const znr = String(params.znr ?? "");
    return znr || "";
  },

  [WORKLOG_ACTIONS.REDIRECT_TASK_ON_GROUP]: (params) => {
    const group = String(params.group ?? "");
    return `Инженер переназначил запрос на группу ${group}`;
  },

  [WORKLOG_ACTIONS.REDIRECT_TASK_ON_USER]:
    "Инженер переназначил запрос на другого инженера",

  [WORKLOG_ACTIONS.REDIRECT_TASK_ON_SBS]: "",

  [WORKLOG_ACTIONS.CALL_DIAL]: (params) =>
    maskPhone(String(params.phone ?? "")),
  [WORKLOG_ACTIONS.CALL_SUCCESS]: (params) =>
    maskPhone(String(params.phone ?? "")),
  [WORKLOG_ACTIONS.NO_CALL]: (params) => maskPhone(String(params.phone ?? "")),
  [WORKLOG_ACTIONS.CALL_LATER]: (params) =>
    maskPhone(String(params.phone ?? "")),

  // Удаление тега — кода нет в БТ, заведён на нашей стороне (см. actions.ts).
  [WORKLOG_ACTIONS.DELETE_HASHTAG]: (params) => {
    const tag = String(params.tag ?? "");
    const ts = formatDateTime(
      params.ts instanceof Date ? params.ts : new Date(),
    );
    return `Инженер удалил хештег «${tag}» ${ts}`;
  },

  [WORKLOG_ACTIONS.CTI_TRANSPORT_CONNECTING]: "Подключение к транспорту",
  [WORKLOG_ACTIONS.CTI_TRANSPORT_CONNECTED]: "Подключено к транспорту",
  [WORKLOG_ACTIONS.CTI_TRANSPORT_DISCONNECTED]: "Отключение транспорта",
  [WORKLOG_ACTIONS.CTI_TRANSPORT_ERROR]: "Ошибка транспорта",

  [WORKLOG_ACTIONS.CTI_MUTE]: (params) => {
    const data = params.data;
    return `Выключение микрофона: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_UNMUTE]: (params) => {
    const data = params.data;
    return `Включение микрофона: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_CALL_ACCEPT]: (params) => {
    const data = params.data;
    return `Ответ на исходящее взаимодействие: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_CALL_START]: (params) => {
    const data = params.data;
    return `Инициирование взаимодействия: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_CALL_END]: (params) => {
    const data = params.data;
    return `Завершение взаимодействия: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_TRANSFER_BLIND]: (params) => {
    const data = params.data;
    return `Слепой перевод: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_TRANSFER_CONSULTATION]: (params) => {
    const data = params.data;
    return `Консультация: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_TRANSFER_CANCEL]: (params) => {
    const data = params.data;
    return `Отмена консультации: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_HOLD]: (params) => {
    const data = params.data;
    return `Постановка взаимодействия на паузу: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_RESUME]: (params) => {
    const data = params.data;
    return `Возобновлние взаимодействия: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_CONFERENCE_JOIN]: (params) => {
    const data = params.data;
    return `Конференция: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_AGENT_READY]: (params) => {
    const data = params.data;
    return `Агент готов: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_AGENT_NOTREADY]: (params) => {
    const data = params.data;
    return `Агент не готов: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_AGENT_LOGGEDOFF]: (params) => {
    const data = params.data;
    return `Выход из панели: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_CALL_RONA]: (params) => {
    const data = params.data;
    return `Пропущенное взаимодействие: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_CALL_INBOUND]: (params) => {
    const data = params.data;
    return `Входящий звонок: ${data}`;
  },
  [WORKLOG_ACTIONS.CTI_CALL_OUTBOUND]: (params) => {
    const data = params.data;
    return `Исходящий звонок: ${data}`;
  },
};

/**
 * Сформировать текст `comment` для данного action-кода.
 * Для неизвестных кодов — пустая строка, а не null.
 */
export function buildComment(
  action: string,
  params?: Record<string, unknown>,
): string {
  const tpl = TEMPLATES[action];

  // Если шаблон не найден (например, новый код, только добавленный) —
  // возвращаем пустую строку, а не null/undefined.
  if (!tpl) return "";

  if (typeof tpl === "string") return tpl;
  return tpl(params ?? {});
}

export { TEMPLATES };
