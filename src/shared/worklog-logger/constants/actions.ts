import type { WorklogSource } from "@shared/worklog";

/**
 * Справочник кодов действий инженера. Ровно 24 кода из обновлённой БТ —
 * единый источник, по которому в `engineer_activity_log` пишут и WebEWS,
 * и десктопное приложение. Значение каждого кода совпадает с БТ, не сокращать.
 *
 * Формат кода — `Подсистема.Модуль.Действие` с префиксом `ews`.
 *
 * ВНИМАНИЕ: код DELETE_HASHTAG отсутствует в БТ. Он заведён на нашей стороне
 * (см. БТ: удаление хештега отдельным событием не предусмотрено). В БТ его нет
 * — дорабатываем локально, в документ БТ не вписываем.
 */
export const WORKLOG_ACTIONS = {
  APP_START: "ews.start",
  APP_INACTIVE_END: "ews.inactive_end",
  LIST_OPEN: "ews.list.open",
  OPEN_TASK: "ews.task.open",
  OPEN_TASK_BIG: "ews.list.open_task",
  TASK_LOCAL: "ews.local.task",
  TASK_OUT: "ews.task.out",
  TASK_IN_WORK: "ews.task.in_work",
  CLOSE_TASK: "ews.action.task_close",
  TASK_REAZON: "ews.action.reazon_task",
  WRITE_INFO_DECISION: "ews.action.write_info_decision",
  WRITE_CHAT: "ews.chat.write",
  WRITE_INFO_PROTOCOL: "ews.protocol.write_info",
  WRITE_HASHTAG_DIR: "ews.hashtag.write__dir",
  WRITE_HASHTAG: "ews.hashtag.write",
  DELETE_HASHTAG: "ews.hashtag.delete",
  CREATE_ZNR: "ews.task.create_ZNR",
  REDIRECT_TASK_ON_GROUP: "ews.redirect.task_on_group",
  REDIRECT_TASK_ON_USER: "ews.redirect.task_on_user",
  REDIRECT_TASK_ON_SBS: "ews.redirect.task_on_SBS",
  CALL_DIAL: "ews.call.dial",
  CALL_SUCCESS: "ews.call.success",
  NO_CALL: "ews.call.miss",
  CALL_LATER: "ews.call.callback",
  // CTI actions
  CTI_TRANSPORT_CONNECTING: "cti.transport.conecting",
  CTI_TRANSPORT_CONNECTED: "cti.transport.connected",
  CTI_TRANSPORT_DISCONNECTED: "cti.transport.disconnected",
  CTI_TRANSPORT_ERROR: "cti.transport.error",
  CTI_CALL_START: "cti.call.start",
  CTI_CALL_END: "cti.call.end",

  CTI_CALL_RONA: "cti.call.rona",
  CTI_CALL_INBOUND: "cti.call.inbound",
  CTI_CALL_OUTBOUND: "cti.call.outbound",

  CTI_CALL_ACCEPT: "cti.call.accept",
  CTI_TRANSFER_BLIND: "cti.transfer.blind",
  CTI_TRANSFER_CONSULTATION: "cti.transfer.consultation",
  CTI_TRANSFER_CANCEL: "cti.transfer.cancel",
  CTI_HOLD: "cti.hold",
  CTI_RESUME: "cti.resume",
  CTI_CONFERENCE_JOIN: "cti.conference.join",
  CTI_MUTE: "cti.mute",
  CTI_UNMUTE: "cti.unmute",
  CTI_AGENT_READY: "cti.agent.ready",
  CTI_AGENT_NOTREADY: "cti.agent.notready",
  CTI_AGENT_LOGGEDOFF: "cti.agent.loggedoff",
} as const;

export type WorklogAction =
  (typeof WORKLOG_ACTIONS)[keyof typeof WORKLOG_ACTIONS];

/**
 * Источник события для поля `source` по колонке БТ «Отображать в Истории
 * действие по заявке»:
 * - Да → `webEws_worklog`, событие попадает в ленту «История действий»;
 * - Нет → `webEws`, служебное событие, в ленте не показывается.
 *
 * ВНИМАНИЕ: DELETE_HASHTAG — кода нет в БТ, он заведён на нашей стороне.
 * Логируем его в ленту (`webEws_worklog`).
 */
export const ACTION_SOURCE_MAP: Readonly<Record<WorklogAction, WorklogSource>> =
  {
    [WORKLOG_ACTIONS.APP_START]: "webEws",
    [WORKLOG_ACTIONS.APP_INACTIVE_END]: "webEws",
    [WORKLOG_ACTIONS.LIST_OPEN]: "webEws",
    [WORKLOG_ACTIONS.OPEN_TASK]: "webEws",
    [WORKLOG_ACTIONS.OPEN_TASK_BIG]: "webEws",
    [WORKLOG_ACTIONS.TASK_LOCAL]: "webEws",
    [WORKLOG_ACTIONS.TASK_OUT]: "webEws",
    [WORKLOG_ACTIONS.TASK_IN_WORK]: "webEws_worklog",
    [WORKLOG_ACTIONS.CLOSE_TASK]: "webEws_worklog",
    [WORKLOG_ACTIONS.TASK_REAZON]: "webEws_worklog",
    [WORKLOG_ACTIONS.WRITE_INFO_DECISION]: "webEws_worklog",
    [WORKLOG_ACTIONS.WRITE_CHAT]: "webEws_worklog",
    [WORKLOG_ACTIONS.WRITE_INFO_PROTOCOL]: "webEws_worklog",
    [WORKLOG_ACTIONS.WRITE_HASHTAG_DIR]: "webEws_worklog",
    [WORKLOG_ACTIONS.WRITE_HASHTAG]: "webEws_worklog",
    [WORKLOG_ACTIONS.DELETE_HASHTAG]: "webEws_worklog",
    [WORKLOG_ACTIONS.CREATE_ZNR]: "webEws_worklog",
    [WORKLOG_ACTIONS.REDIRECT_TASK_ON_GROUP]: "webEws_worklog",
    [WORKLOG_ACTIONS.REDIRECT_TASK_ON_USER]: "webEws_worklog",
    [WORKLOG_ACTIONS.REDIRECT_TASK_ON_SBS]: "webEws_worklog",
    [WORKLOG_ACTIONS.CALL_DIAL]: "webEws_worklog",
    [WORKLOG_ACTIONS.CALL_SUCCESS]: "webEws_worklog",
    [WORKLOG_ACTIONS.NO_CALL]: "webEws_worklog",
    [WORKLOG_ACTIONS.CALL_LATER]: "webEws_worklog",
    [WORKLOG_ACTIONS.CTI_TRANSPORT_CONNECTING]: "cti",
    [WORKLOG_ACTIONS.CTI_TRANSPORT_CONNECTED]: "cti",
    [WORKLOG_ACTIONS.CTI_TRANSPORT_DISCONNECTED]: "cti",
    [WORKLOG_ACTIONS.CTI_TRANSPORT_ERROR]: "cti",
    [WORKLOG_ACTIONS.CTI_CALL_START]: "cti",
    [WORKLOG_ACTIONS.CTI_CALL_END]: "cti",
    [WORKLOG_ACTIONS.CTI_TRANSFER_BLIND]: "cti",
    [WORKLOG_ACTIONS.CTI_TRANSFER_CONSULTATION]: "cti",
    [WORKLOG_ACTIONS.CTI_TRANSFER_CANCEL]: "cti",
    [WORKLOG_ACTIONS.CTI_HOLD]: "cti",
    [WORKLOG_ACTIONS.CTI_RESUME]: "cti",
    [WORKLOG_ACTIONS.CTI_CONFERENCE_JOIN]: "cti",
    [WORKLOG_ACTIONS.CTI_MUTE]: "cti",
    [WORKLOG_ACTIONS.CTI_UNMUTE]: "cti",
    [WORKLOG_ACTIONS.CTI_AGENT_READY]: "cti",
    [WORKLOG_ACTIONS.CTI_AGENT_NOTREADY]: "cti",
    [WORKLOG_ACTIONS.CTI_AGENT_LOGGEDOFF]: "cti",
    [WORKLOG_ACTIONS.CTI_CALL_ACCEPT]: "cti",
    [WORKLOG_ACTIONS.CTI_CALL_RONA]: "cti",
    [WORKLOG_ACTIONS.CTI_CALL_INBOUND]: "cti",
    [WORKLOG_ACTIONS.CTI_CALL_OUTBOUND]: "cti",
  };
