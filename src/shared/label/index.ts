export interface LabelDto {
  name: string;
  color: string;
  tooltip: string;
  /** Иконка-тип метки. "chat" -- сообщение в чате получено. */
  icon?: "chat" | "od_open" | "od_close";
}
