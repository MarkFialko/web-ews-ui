import { userHandlers } from "./user";

/** Сводный список всех MSW-хендлеров. Новые домены (по мере разбора ручек
 * web-ews-middle) добавлять сюда отдельным файлом в этой же папке. */
export const handlers = [...userHandlers];
