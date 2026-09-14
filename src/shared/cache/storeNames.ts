export const STORE_NAMES = {
  REQUESTS: "requests",
  PENDING_OPS: "pendingOps",
  TRIAGE: "triage",
  REQUEST_EMPLOYEE: "requestEmployee",
  REQUEST_PHOTO: "requestPhoto",
  REQUEST_ARMS: "requestArms",
  REQUEST_ACCESS: "requestAccess",
  REQUEST_TICKETS: "requestTickets",
  CLOSURE_DRAFTS: "closureDrafts",
  PROTOCOL_DRAFTS: "protocolDrafts",
  WORKLOG_EVENTS: "worklogEvents",
  RELATED_REQUEST_DRAFTS: "relatedRequestDrafts",
  CHAT_IMAGES: "chatImages",
  CALL_HISTORY: "callHistory",
} as const;

export type StoreName = (typeof STORE_NAMES)[keyof typeof STORE_NAMES];
