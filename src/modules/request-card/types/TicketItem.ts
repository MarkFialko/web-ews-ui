export type TicketItem = {
  ticketNumber?: string;
  createdAt?: string;
  subject?: string;
  status?: string;
  priority?: string;
  workGroup?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  description?: string | null;
  dataQuality?: "LIMITED" | "FULL";
};
