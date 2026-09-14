import { PhoneInTalkOutlined, OpenInNewOutlined } from "@mui/icons-material";
import {
  Paper,
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  Button,
} from "@mui/material";

import { InfoLine } from "../../common";

const requestGroups = [
  {
    title: "На мне",
    requests: [
      {
        id: "IM-105014",
        created: "03.07.2026 13:05",
        subject: "Заблокирована учетная запись после смены пароля",
        status: "В работе",
        priority: "Высокий",
        due: "03.07.2026 15:05",
        group: "ЦИТПРМП / 1 линия",
        assignee: "Иванов И.И.",
        contact: true,
      },
    ],
  },
  {
    title: "На моей группе",
    requests: [
      {
        id: "SR-55109",
        created: "03.07.2026 10:42",
        subject: "Доступ к сетевой папке Sales",
        status: "Назначено",
        priority: "Средний",
        due: "04.07.2026 10:42",
        group: "ЦИТПРМП / 1 линия",
        assignee: "Иванов И.И.",
      },
    ],
  },
  {
    title: "На другой группе",
    requests: [
      {
        id: "IM-104907",
        created: "02.07.2026 16:20",
        subject: "Проблема с VPN",
        status: "Ожидает исполнителя",
        priority: "Высокий",
        due: "03.07.2026 16:20",
        group: "ЦИТППБО / Сеть и VPN",
        assignee: "Иванов И.И.",
      },
    ],
  },
  {
    title: "Закрытые",
    requests: [
      {
        id: "IM-104822",
        created: "01.07.2026 09:18",
        subject: "Не открывается SAP GUI",
        status: "Выполнен",
        priority: "Низкий",
        due: "01.07.2026 17:00",
        group: "ЦИТПРМП / 1 линия",
        assignee: "Иванов И.И.",
      },
    ],
  },
];

export const RequestsContextTab = () => {
  const activeRequestsCount = requestGroups
    .flatMap((group) => group.requests)
    .filter(
      (request) =>
        request.status !== "Выполнен" && request.status !== "Закрыт",
    ).length;

  if (!requestGroups.some((group) => group.requests.length)) {
    return (
      <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Запросы отсутствуют
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Typography variant="subtitle2">
          Последние обращения клиента
        </Typography>
        {activeRequestsCount ? (
          <Chip
            label={`${activeRequestsCount} активных`}
            size="small"
            color="primary"
          />
        ) : null}
      </Stack>

      {requestGroups
        .filter((group) => group.requests.length)
        .map((group) => (
          <Paper
            key={group.title}
            variant="outlined"
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            <Stack>
              <Stack
                sx={{ px: 1, py: 0.75, borderBottom: 1, borderColor: "divider" }}
              >
                <Typography variant="subtitle2">{group.title}</Typography>
              </Stack>
              <Stack divider={<Divider flexItem />}>
                {group.requests.map((request) => (
                  <Stack key={request.id} spacing={0.75} sx={{ p: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 900 }}>
                          {request.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.subject}
                        </Typography>
                      </Box>
                      <Chip label={request.status} size="small" />
                    </Stack>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, minmax(0, 1fr))",
                        },
                        gap: 0.5,
                      }}
                    >
                      <InfoLine label="Создано" value={request.created} />
                      <InfoLine label="Приоритет" value={request.priority} />
                      <InfoLine label="Контрольный срок" value={request.due} />
                      <InfoLine label="РГ" value={request.group} />
                      <InfoLine label="Исполнитель" value={request.assignee} />
                    </Box>
                    <Stack direction="row" spacing={0.75}>
                      {request.contact ? (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<PhoneInTalkOutlined />}
                        >
                          Связаться
                        </Button>
                      ) : null}
                      <Button
                        size="small"
                        variant="outlined"
                        href={`https://esm.example.local/tickets/${request.id}`}
                        target="_blank"
                        rel="noreferrer"
                        endIcon={<OpenInNewOutlined />}
                      >
                        Открыть заявку
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Paper>
        ))}
    </Stack>
  );
};
