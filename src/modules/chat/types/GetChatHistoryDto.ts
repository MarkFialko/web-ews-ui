export interface GetChatHistoryDTO {
  /** Номер запроса */
  numberId: string;
  /** Начальный индекс страницы */
  pageStart: number;
  /** Количество элементов на странице */
  pageCount: number;
}
