import type { DictionaryGroupDto } from "@shared/queries/dictionaryApi";

/**
 * Покрывает все варианты сборки дерева в transformResponse (getHashtags):
 * - теги без группы (id/parentId/name все null) — id 100;
 * - корневая группа без детей — id 3 "Безопасность";
 * - трёхуровневая цепочка (докащывает рекурсию) — id 1 "1С" -> id 2
 *   "Оборудование" -> id 4 "Принтеры";
 * - группа-"папка" без своих тегов, только с дочерней группой — id 5
 *   "Доступы" -> id 6 "СБС".
 */
export const hashtagsMock: DictionaryGroupDto[] = [
  {
    id: null,
    name: null,
    parentId: null,
    tags: [
      {
        id: 100,
        hashtag: "срочно",
        title: "Срочно",
        hint: "Требует немедленного внимания",
      },
    ],
  },
  {
    id: 1,
    name: "1С",
    parentId: null,
    tags: [
      { id: 11, hashtag: "1с", title: "1С", hint: "Проблемы с 1С:Предприятие" },
    ],
  },
  {
    id: 2,
    name: "Оборудование",
    parentId: 1,
    tags: [
      {
        id: 21,
        hashtag: "сканер",
        title: "Сканер",
        hint: "Проблемы со сканером штрихкодов",
      },
    ],
  },
  {
    id: 4,
    name: "Принтеры",
    parentId: 2,
    tags: [
      {
        id: 41,
        hashtag: "принтер_лазерный",
        title: "Лазерный принтер",
        hint: "Проблемы с лазерным принтером",
      },
      {
        id: 42,
        hashtag: "принтер_струйный",
        title: "Струйный принтер",
        hint: "Проблемы со струйным принтером",
      },
    ],
  },
  {
    id: 3,
    name: "Безопасность",
    parentId: null,
    tags: [
      {
        id: 31,
        hashtag: "пароли",
        title: "Пароли",
        hint: "Сброс/смена паролей",
      },
    ],
  },
  {
    id: 5,
    name: "Доступы",
    parentId: null,
    tags: [],
  },
  {
    id: 6,
    name: "СБС",
    parentId: 5,
    tags: [
      {
        id: 61,
        hashtag: "заявка_на_доступ",
        title: "Заявка на доступ",
        hint: "Оформление заявки на доступ через СБС",
      },
    ],
  },
];
