# WebEWS UI

Единое рабочее окно инженера 1-й линии технической поддержки Сбербанка. Объединяет весь функционал обработки обращений в одном веб-интерфейсе: очередь заявок, карточку обращения, коммуникации (чат, звонки, протокол), действия с задачей, базу знаний и связанные процессы.

---

## Обзор проекта

**WebEWS UI** — frontend-приложение единого рабочего окна инженера (Engineer Work Station). Цель — свести поиск, карточку клиента, заявки и коммуникации в один UI, ускорив обработку обращений на первой линии.

**Целевая аудитория:** инженеры 1-й линии технической поддержки.

**Ключевые возможности:**

| Модуль | Описание |
|--------|----------|
| **Triage** | Очередь входящих запросов с лэйнами по SLA-сигналам, поиском, фильтрацией, бамп-механикой |
| **Request Card** | Детальная карточка заявки: вкладки, теги, worklog, данные клиента, оптимистичные обновления |
| **Call** | Панель набора номера, таймер звонка, фиксация результата (на связи/занят/перезвон) |
| **Chat** | Внутризадачный мессенджер, polling каждые 10с, быстрые ответы, AI-рекомендации |
| **Protocol** | Отправка официальных коммуникаций (инженеру/пользователю), черновики в IndexedDB |
| **Ticket Actions** | Смена статуса, назначение, рабочие группы, коды закрытия, field-level dirty tracking |
| **Knowledge Base** | Поиск и просмотр статей БЗ, привязка SH-ID, AI-рекомендации |
| **Local Support** | Создание запросов в локальную поддержку (СБС) через SberESM |
| **Related Requests** | Привлечение смежных групп: ЗПИ/ЗНР, маршрутизация, согласование |
| **Worklog Logger** | Кросс-модульное логирование действий инженера (24 типа), батч-отправка |

---

## Технологический стек

| Технология | Версия | Назначение |
|------------|--------|-----------|
| React | ^19.2 | UI-библиотека |
| TypeScript | ~5.9 | Статическая типизация |
| Vite | 5.4 | Сборка (ES2022, ESM) |
| MUI | ^7.3 | Компоненты и стилизация (sx prop + theme) |
| Redux Toolkit | ^2.11 | Состояние |
| RTK Query | ^2.11 | API-запросы и кэширование |
| React Router DOM | ^7.14 | Роутинг (basename "/web-ews-ui") |
| React Hook Form | ^7.69 | Формы (Controller pattern) |
| notistack | ^3.0 | Snackbar-уведомления |
| lucide-react | ^0.562 | Иконки |
| @tanstack/react-virtual | 3.14 | Виртуализация списков |
| dayjs | ^1.11 | Дата/время (русская локаль) |
| MSW | ^2.4 | Мок-сервер для dev |
| Immer | 11.1 | Иммутабельные обновления кэша |

---

## Быстрый старт

### Предварительные требования

- Node.js (рекомендуется 20+)
- npm

### Установка

```bash
npm install
```

### Основные команды

| Команда | Назначение |
|---------|-----------|
| `npm run dev` | Запуск dev-сервера с прокси и IAM-авторизацией |
| `npm run build` | Продакшен-сборка (создаёт `web-ews-ui.zip`) |
| `npm run preview` | Предпросмотр собранной версии |
| `npm run lint` | Линтинг (ESLint) |
| `npm run format` | Автоматическое форматирование (Prettier) |
| `npm run format:check` | Проверка форматирования |
| `npm test` | Запуск тестов в watch-режиме (Vitest) |
| `npm run test:run` | Одиночный запуск тестов |

### Настройка окружения

Скопируйте `.env.example` в `.env` и заполните переменные:

```bash
cp .env.example .env
```

| Переменная | Описание |
|------------|----------|
| `VITE_USE_MOCKS` | Включить MSW-моки для dev (`true`/`false`) |
| `VITE_RMI_USERS_BASE_URL` | Базовый URL каталога пользователей |
| `VITE_ESM_DATASOURCE_BASE_URL` | Базовый URL ESM датасорса |
| `VITE_ESM_GATEWAY_BASE_URL` | Базовый URL ESM-шлюза |
| `VITE_AUTH_LOGIN` | Логин для dev-авторизации (SberID) |
| `VITE_AUTH_PASSWORD` | Пароль для dev-авторизации (SberID) |

---

## Архитектура

```
src/
├── app/                    # Глобальная инфраструктура
│   ├── store.ts            # Redux store (только baseApi reducer)
│   ├── hooks.ts            # Типизированные useAppDispatch/useAppSelector
│   └── command-palette/    # Глобальная палитра команд (Ctrl+Shift+P)
├── modules/                # Feature-модули (14 шт.)
│   ├── triage/             # Очередь заявок (самый большой модуль)
│   ├── request-card/       # Карточка заявки
│   ├── ticket-actions/     # Действия с задачей
│   ├── call/               # Звонки
│   ├── chat/               # Чат
│   ├── protocol/           # Протокол
│   ├── knowledge-base/     # База знаний
│   ├── local-support/      # Локальная поддержка
│   ├── related-requests/   # Смежные группы
│   ├── related-groups/     # Типы для related-requests
│   ├── engineer-workspace/ # Композиция всех панелей
│   ├── engineer-requests/  # Модель EngineerRequest (типы)
│   ├── client-card/        # Карточка клиента
│   └── user/               # Авторизация
├── shared/                 # Общие примитивы и инфраструктура
│   ├── api/                # baseApi, extractErrorMessage
│   ├── cache/              # IndexedDB слой
│   ├── ui/                 # Переиспользуемые MUI-компоненты + RHF-обёртки
│   ├── hooks/              # Общие хуки (useFeatureFlag, useKeyPress)
│   ├── types/              # Глобальные типы (CacheEntry, ...)
│   ├── worklog-logger/     # Система логирования действий
│   ├── notifications/      # notistack-обёртка
│   ├── errors/             # ModuleErrorBoundary
│   ├── dev/                # DevCrash, симуляция ошибок
│   └── ...                 # ещё ~11 категорий
├── mocks/                  # MSW-моки для dev
├── theme.ts                # MUI-тема, кастомные variant'ы
├── dayjs.ts                # Настройка русской локали dayjs
└── App.tsx / AppRoot.tsx   # Точки входа
```

Подробную схему см. в [architecture.md](./architecture.md).

---

## Линтинг

Проект использует **ESLint 9** с плоской конфигурацией (`eslint.config.js`):

- `@eslint/js` — базовые правила
- `typescript-eslint` — TypeScript-правила
- `eslint-plugin-react-hooks` — правила хуков React
- `eslint-plugin-react-refresh` — hot-reload правила
- `eslint-plugin-unused-imports` — удаление неиспользуемых импортов
- `eslint-config-prettier` — отключение конфликтующих правил
- `eslint-plugin-prettier` — Prettier как правило ESLint

Запуск: `npm run lint`. Автофикс: `npm run lint -- --fix`.

**Pre-commit:** проект использует Husky + lint-staged — автоматический линт и форматирование при коммите.

---

## Конвенции

Подробный справочник конвенций и паттернов — в [GIGACODE.md](./GIGACODE.md).

### Ключевые правила

1. **Feature-first структура** — каждая фича в `src/modules/<module>/`, код не может лежать вне модуля или shared.
2. **RTK Query — единственный источник данных** — модульные API через `baseApi.injectEndpoints()`, без отдельных Redux-слайсов.
3. **Абсолютные импорты** — через алиасы `@app/*`, `@modules/*`, `@shared/*` (относительные вне модуля запрещены).
4. **Barrel-экспорты** — каждый подкаталог модуля имеет `index.ts`.
5. **Комментарии только на русском** — к неочевидному коду, не к очевидному.

---

## Документация

- **[GIGACODE.md](./GIGACODE.md)** — полный справочник: стек, архитектура, конвенции, паттерны разработки
- **[architecture.md](./architecture.md)** — архитектурные решения, потоки данных, схема взаимодействия модулей
- **[openspec/specs/](./openspec/specs/)** — мастер-спецификации модулей (требования и сценарии Given/When/Then)

### Мастер-спецификации

| Спецификация | Охват |
|--------------|-------|
| `triage/spec.md` | Очередь заявок, лейны, поиск, бамп |
| `request-card/spec.md` | Карточка заявки, теги, worklog, база знаний |
| `ticket-actions/spec.md` | Действия с задачей, закрытие |
| `worklog/spec.md` | Система логирования действий |
| `call/spec.md` | Звонки |
| `chat/spec.md` | Чат |
| `protocol/spec.md` | Протокол |
| `local-support/spec.md` | Локальная поддержка |
| `related-requests/spec.md` | Смежные группы |
