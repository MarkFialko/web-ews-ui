import { PROTOCOL_TYPE_CODES } from "@shared/protocol";

export const TABS = [
  {
    value: PROTOCOL_TYPE_CODES.ENGINEER_MESSAGE,
    label: "Инженеру",
  },
  {
    value: PROTOCOL_TYPE_CODES.USER_MESSAGE,
    label: "Пользователю",
  },
] as const;
