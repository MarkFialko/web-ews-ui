/**
 * Incident DTO displayed inside the Client Card module.
 */
export type ClientIncident = {
  id: string;
  date: string;
  createdAtRaw?: string;
  title: string;
  group: string;
  status: string;
  priority: string;
  owner: "me" | "group" | "other" | "closed";
  dueAt: string;
  dueAtRaw?: string;
  dueLeft: string;
  closedAt?: string;
  notifications?: number;
  assignee?: string | null;
  summary: string;
};
