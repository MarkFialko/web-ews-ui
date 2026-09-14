export const EMPTY_WORKLOG_TEXTS = {
  loading: "Загрузка истории действий...",
  empty: "История действий отсутствует.",
} as const;

export const WORKLOG_HEADER_TEXTS = {
  sectionTitle: "История действий по заявке",
  viewInEsm: "Посмотреть ESM",
  resetFilters: "Сбросить",
  filterStartDate: "Начальная дата",
  filterEndDate: "Конечная дата",
  filterAuthor: "Автор (табельный)",
  filterAuthorPlaceholder: "8 цифр",
  filterAction: "Тип события",
  filterAllActions: "Все",
  itemsPerPage: "На странице",
  noEntries: "Нет записей",
} as const;

export const ACTION_ICON_TEXTS = {
  chat: "Чат",
  protocol: "Протокол",
  navigateToChat: "Перейти в Чат",
  navigateToProtocol: "Перейти в Протокол",
} as const;

export const LOCAL_SUPPORT_TEXTS = {
  loading: "Загрузка данных...",
  loadingEngineerInfo: "Загрузка данных инженера…",
  noEngineerData: "Нет данных об инженерной сети",
  noArmsForEmployee: "Нет АРМ для табельного № {personalNumber}",
  createNewLocalSupport: "Создать новый запрос на локальную поддержку",
  editLocalSupport: "Редактировать запрос",
  noLocalSupportEntries: "Нет записей по локальной поддержке",
  address: "Адрес",
  addressHelper: "Укажите адрес (не менее 10 символов)",
  territorialBank: "Тер. банк",
  service: "Сервис",
  serviceName: "Имя АРМ",
  serviceNameHelper:
    "Укажите имя АРМ (не менее 5 символов) или оставьте поле пустым",
  contactPhone: "Контактный телефон",
  contactPhoneHelper: "Укажите контактный телефон (не менее 5 цифр)",
  requiredWork: "Необходимые работы",
  requiredWorkHelper: "Опишите необходимые работы (не менее 10 символов)",
  routing: "Маршрутизация",
  cancel: "Отмена",
  submit: "Отправить",
  submitting: "Отправка...",
  createSuccess: "Запрос на локальную поддержку успешно создан",
  editSuccess: "Запрос на локальную поддержку успешно обновлён",
  createError:
    "Не удалось отправить запрос на локальную поддержку. Попробуйте ещё раз или обратитесь к администратору.",
  editError:
    "Не удалось обновить запрос на локальную поддержку. Попробуйте ещё раз или обратитесь к администратору.",
  validationError:
    "Не удалось отправить запрос: не получен идентификатор задачи из SberESM. Попробуйте перезагрузить страницу или обратитесь к администратору.",
  group: "Группа",
  vsp: "ВСП",
  adminBuilding: "Админ. здание",
} as const;
