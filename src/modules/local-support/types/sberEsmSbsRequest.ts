/**
 * DTO для создания SRT/INCT через локальную поддержку
 * (endpoint: POST web-ews-middle/sbs/complete-task)
 */
export type SberEsmSbsRequest = {
  /**
   * Id записи SberEsm
   */
  key: string;
  /**
   * Id конфигурационного элемента услуги
   */
  serviceId?: string;
  /**
   * Территориальный банк
   */
  territorialBank?: string;
  /**
   * Адрес инициатора
   */
  address?: string;
  /**
   * Принадлежность к ВСП или Админ. зданию
   */
  vsp?: boolean;
  /**
   * Автопривлечение для УПАРМ
   */
  routing?: boolean;
  /**
   * Необходимые работы
   */
  requiredWork?: string;
  /**
   * Имя АРМ
   */
  pcName?: string;
  /**
   * Контактный телефон
   */
  telephone?: string;
};
