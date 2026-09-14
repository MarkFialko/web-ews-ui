import type { TicketItem } from "./TicketItem";

export type TicketsResponse = {
  onMe?: TicketItem[];
  onGroup?: TicketItem[];
  onOther?: TicketItem[];
  closed?: TicketItem[];
  activeCount?: number;
  dataQuality?: "LIMITED" | "FULL";
};
