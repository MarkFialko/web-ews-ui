import { SORT_OPTIONS } from "../constants";
import type { TriageSortKey } from "../types";
import type { RequestDTO, StateCode } from "@shared/request";

export const getEngeneerName = (
  engeneer: RequestDTO["initiator"],
  format: "full" | "short" = "full",
): string => {
  if (engeneer === null) return "-";

  const { firstName, lastName, middleName } = engeneer;

  const firstNameChar = firstName?.[0]?.toUpperCase() ?? "";
  const middleNameChar = middleName?.[0]?.toUpperCase() ?? "";

  const fullFormat = `${lastName ?? ""} ${firstName ?? ""} ${middleName ?? ""}`;
  const shortFormat = `${lastName ?? ""} ${firstNameChar ? firstNameChar + "." : ""} ${middleNameChar ? middleNameChar + "." : ""}`;

  return format === "full" ? fullFormat : shortFormat;
};

export const getStateCodeFormat = (code: StateCode) => {
  if (code === "REGISTERED") return "Зарегистрирован";
  if (code === "INWORKGROUP_ASSIGNED") return "Назначен";
  if (code === "INWORKGROUP_RETURNED") return "Возврат в работу";
  if (code === "INWORKGROUP_APPROVED") return "Согласован";
  if (code === "INWORKGROUP_NOT_APPROVED") return "Не согласован";
  if (code === "APPROVE_WAITING") return "Ожидает согласования";
  if (code === "APPROVE_REQUEST_INFO")
    return "Уточнение информации по согласованию";
  if (code === "APPROVE_GIVE_INFO")
    return "Получена дополнительная информация по согласованию";
  if (code === "IN_WORK") return "В работе";
  if (code === "IN_WORK_WORK") return "В работе";
  if (code === "IN_WORK_REQUEST_INFO") return "Уточнение информации";
  if (code === "IN_WORK_GIVE_INFO") return "Получена дополнительная информация";
  if (code === "IN_WORK_TASK_CREATED") return "ЗНР созданы";
  if (code === "IN_WORK_TASK_COMPLETED") return "ЗНР выполнены";
  if (code === "IN_WORK_REQUEST_INFORMATION") return "Уточнение информации";
  if (code === "IN_WORK_GIVE_INFORMATION")
    return "Получена дополнительная информация";
  if (code === "COMPLETED") return "Выполнен";
  if (code === "CLOSED") return "Закрыт";

  return code;
};

export function getSortOptionLabel(sortKey: TriageSortKey) {
  return SORT_OPTIONS.find((option) => option.value === sortKey)!.label;
}
