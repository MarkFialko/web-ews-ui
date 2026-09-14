# OpenSpec — нейминг и apply-фаза

## Нейминг change-каталогов

Название каталога в `openspec/changes/` и `openspec/changes/archive/`:

```
PORTALSOL-NNNN/имя-описания    или    EWS-NNNN/имя-описания
```

- Jira-префикс (PORTALSOL-/EWS-) + тире + номер тикета
- Затем `/` + краткое описание на английском с дефисами вместо пробелов
- Пример: `openspec/changes/EWS-10410/add-worklog-to-tasks/`

## Apply-фаза

Во время реализации change по tasks.md:

- Редактируется только `tasks.md` (чекбоксы). `proposal.md`, `design.md`, `specs/` (дельты) не трогать.
- Не расширять scope сверх написанного в `tasks.md`.
- При расхождении между `design.md`/`tasks.md` и реальным кодом — остановиться, написать вопрос в отчёте, не додумывать.
- Archive (мёрж в основной specs/) не запускать самостоятельно — отдельный шаг после ревью.
