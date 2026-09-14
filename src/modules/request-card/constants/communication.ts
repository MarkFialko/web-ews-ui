export const COMMUNICATION_CHANNEL = {
  CHAT: "chat",
  PROTOCOL: "protocol",
  CALL: "call",
} as const;

export const TOOL_IDS = {
  CHAT: "chat",
  PROTOCOL: "protocol",
  CALL: "call",
  KNOWLEDGE: "knowledge",
} as const;

export const COMMUNICATION_STATE = {
  INITIAL: "initial",
  WAITING: "waiting",
  USER_REPLIED: "user_replied",
} as const;
