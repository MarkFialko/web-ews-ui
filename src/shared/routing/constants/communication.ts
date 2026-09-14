export const COMMUNICATION_MAP = {
  SCHEMES: "schemes",
  CHAT: "chat",
  CALL: "call",
  PROTOCOL: "protocol",
  ACTIONS: "actions",
  RELATED: "related",
  SUPPORT: "local-support",
  KNOWLEDGE: "knowledge",
} as const;

export const COMMUNICATIONS = Object.values(COMMUNICATION_MAP);

export type Communication = (typeof COMMUNICATIONS)[number];

export const COMMUNICATION_TAB = "communication";
