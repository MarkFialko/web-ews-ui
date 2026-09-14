import type { RequestDTO } from "@shared/request";

export const getStatusColor = (
  status: RequestDTO["stateCode"],
): "default" | "warning" | "error" | "info" | "success" => {
  if (status === "REGISTERED") return "info";
  if (status === "INWORKGROUP_ASSIGNED") return "info";
  if (status === "IN_WORK_REQUEST_INFORMATION") return "warning";
  if (status === "INWORKGROUP_RETURNED") return "warning";
  if (status === "COMPLETED") return "success";
  if (status === "CLOSED") return "default";
  if (status === "IN_WORK_WORK") return "success";
  return "default";
};
