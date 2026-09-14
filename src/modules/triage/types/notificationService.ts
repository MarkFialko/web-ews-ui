export interface WebEwsUnreadNotification {
  id: number;
  title: string;
  type: string;
  bodyHtml: string;
  displayType: "WebEws";
  createTimestamp: number;
  authorSmId: string;
  showTimeSec: number;
  lifetimeSec: number | null;
}

export type ConfirmReadResponse = string;
