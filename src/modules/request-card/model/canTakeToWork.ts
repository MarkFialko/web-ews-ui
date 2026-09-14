import { TAKE_TO_WORK_ALLOWED_STATUSES } from "@modules/request-card/constants/statuses";
import type { StateCode } from "@shared/request";

export const canTakeToWork = (status: StateCode): boolean =>
  TAKE_TO_WORK_ALLOWED_STATUSES.includes(status as StateCode);
