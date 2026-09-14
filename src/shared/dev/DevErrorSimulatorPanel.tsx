import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ToolPanelHeader from "../ui/ToolPanelHeader";
import {
  DEV_ERROR_OPTIONS,
  type DevErrorKind,
  type DevErrorSimulationState,
} from "./devErrorSimulation";

const DEV_TEST_KNOWLEDGE_ARTICLE_ID = "SH-8b2d6f14-1ce5-47d2-9a61-4f3e8b7c20ad";

export type DevErrorSimulatorPanelProps = {
  value: DevErrorSimulationState;
  onChange: (next: DevErrorSimulationState) => void;
  onReset?: () => void;
};

const MODULE_FIELDS: Array<{
  key: keyof DevErrorSimulationState;
  label: string;
  helper: string;
}> = [
  {
    key: "app",
    label: "Приложение",
    helper:
      "Глобальный access-denied или общий crash всего рабочего пространства.",
  },
  {
    key: "triage",
    label: "Triage",
    helper: "Симуляция ошибок полного triage-экрана.",
  },
  {
    key: "compactTriage",
    label: "Маленький список заявок",
    helper: "Симуляция ошибок компактного списка обращений слева.",
  },
  {
    key: "requestCard",
    label: "Карточка обращения",
    helper: "Ошибка всего центрального блока обращения.",
  },
  {
    key: "clientCard",
    label: "Карточка клиента",
    helper: "Симуляция ошибок клиентских вкладок внутри обращения.",
  },
  {
    key: "chat",
    label: "Чат",
    helper: "Инструмент переписки с пользователем.",
  },
  {
    key: "call",
    label: "Дозвон",
    helper: "Инструмент дозвона и исходящих сценариев связи.",
  },
  {
    key: "protocol",
    label: "Протокол",
    helper: "Инструмент протокола внутри панели инструментов.",
  },
  {
    key: "actions",
    label: "Действия",
    helper: "Инструмент действий и закрытия заявки.",
  },
  {
    key: "related",
    label: "Смежные группы",
    helper: "Инструмент привлечения смежных групп.",
  },
  {
    key: "localSupport",
    label: "Локальная поддержка",
    helper: "Инструмент создания запроса в локальную поддержку.",
  },
  {
    key: "knowledge",
    label: "База знаний",
    helper: "Инструмент базы знаний и привязки статей.",
  },
  {
    key: "schemes",
    label: "Бизнес-схемы",
    helper: "Инструмент навигатора по схемам и маршрутам.",
  },
];

const hasActiveSimulation = (value: DevErrorSimulationState) =>
  value.app !== "none" ||
  value.triage !== "none" ||
  value.compactTriage !== "none" ||
  value.clientCard !== "none" ||
  value.requestCard !== "none" ||
  value.chat !== "none" ||
  value.call !== "none" ||
  value.protocol !== "none" ||
  value.actions !== "none" ||
  value.related !== "none" ||
  value.localSupport !== "none" ||
  value.knowledge !== "none" ||
  value.schemes !== "none";

/**
 * Tool-panel content for development error simulation.
 */
function DevErrorSimulatorPanel({
  value,
  onChange,
  onReset,
}: DevErrorSimulatorPanelProps) {
  const handleOpenKnowledgeIntentTest = () => {
    const url = new URL(
      `/kb/${DEV_TEST_KNOWLEDGE_ARTICLE_ID}`,
      window.location.origin,
    );
    window.open(url.toString(), "_blank");
  };

  return (
    <Stack spacing={1.5} sx={{ p: 1 }}>
      <ToolPanelHeader
        eyebrow="Developer"
        title="Симуляция ошибок"
        description="Переключайте сценарии ошибок по блокам без изменения бизнес-логики."
      />

      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: 1.5,
          borderRadius: 2.5,
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.7)
              : alpha(theme.palette.background.paper, 0.9),
        })}
      >
        <Stack spacing={1.5}>
          {MODULE_FIELDS.map((field) => (
            <Stack key={field.key} spacing={0.75}>
              <FormControl size="small" fullWidth>
                <InputLabel id={`dev-error-${field.key}-label`}>
                  {field.label}
                </InputLabel>
                <Select
                  labelId={`dev-error-${field.key}-label`}
                  label={field.label}
                  value={value[field.key]}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      [field.key]: event.target.value as DevErrorKind,
                    })
                  }
                >
                  {DEV_ERROR_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="fieldLabel">{field.helper}</Typography>
            </Stack>
          ))}

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle2">Тест SH-intent</Typography>
            <Typography variant="fieldLabel">
              Открывает новую вкладку с примером передачи статьи в формате
              `/kb/SH-...`.
            </Typography>
            <Typography variant="fieldLabel">
              {DEV_TEST_KNOWLEDGE_ARTICLE_ID}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<OpenInNewOutlinedIcon fontSize="small" />}
                onClick={handleOpenKnowledgeIntentTest}
              >
                Тест передачи статьи
              </Button>
            </Stack>
          </Stack>

          <Divider />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Typography variant="fieldLabel">
              Уровни info и action дают мягкие сценарии, auth и critical
              проверяют жёсткие деградации.
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onReset?.()}
              disabled={!hasActiveSimulation(value)}
            >
              Сбросить
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default DevErrorSimulatorPanel;
