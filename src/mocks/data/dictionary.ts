import type { DictionaryGroupDto } from "@shared/queries/dictionaryApi";

export const hashtagsMock: DictionaryGroupDto[] = [
  {
    id: 1,
    name: "1С",
    parentId: null,
    tags: [
      { id: 11, hashtag: "1с", title: "1С", hint: "Проблемы с 1С:Предприятие" },
      {
        id: 12,
        hashtag: "срочно",
        title: "Срочно",
        hint: "Требует немедленного внимания",
      },
    ],
  },
  {
    id: 2,
    name: "Оборудование",
    parentId: 1,
    tags: [
      {
        id: 21,
        hashtag: "принтер",
        title: "Принтер",
        hint: "Проблемы с печатью",
      },
      {
        id: 22,
        hashtag: "сканер",
        title: "Сканер",
        hint: "Проблемы со сканером штрихкодов",
      },
    ],
  },
];
