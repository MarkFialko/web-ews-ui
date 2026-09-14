import { getRusStateCode } from "@shared/request";
import type { EngineerRequestStatus } from "../../engineer-requests/types/EngineerRequest";

export const getTicketActionStatusColor = (
  status: EngineerRequestStatus,
): "default" | "warning" | "error" | "info" | "success" => {
  if (status === "Эскалация") return "error";
  if (
    status === "Новая" ||
    status === "Зарегистрирован" ||
    status === "Назначен"
  )
    return "info";
  if (status === "В работе/Уточнение информации") return "warning";
  if (
    status === "Требуется ответ" ||
    status === "Ожидание ответа" ||
    status === "Ожидает клиента"
  ) {
    return "warning";
  }
  if (status === "Возврат") return "warning";
  if (status === "Выполнен" || status === "Решено") return "success";
  if (status === "В работе") return "success";
  return "default";
};

export const canCloseTicketInStatus = (status: EngineerRequestStatus) =>
  getRusStateCode(status) === "В работе";

export const getCloseTicketDisabledReason = (status: EngineerRequestStatus) =>
  canCloseTicketInStatus(status) ? "" : `Недоступно в статусе "${status}".`;
