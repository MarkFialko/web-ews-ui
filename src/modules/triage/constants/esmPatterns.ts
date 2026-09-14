/**
 * Паттерн для поиска businessId в ESM.
 * Без флага `g` — test() хранит lastIndex и через раз возвращает false.
 */
export const ESM_BUSINESS_ID_PATTERN = /^(INC|SR|INCT|SRT)[0-9]{8,10}$/i;
