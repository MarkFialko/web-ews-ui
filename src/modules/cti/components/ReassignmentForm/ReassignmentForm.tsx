import { useState } from "react";

import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Button,
} from "@mui/material";

import { Panel } from "../common";
import { AttachFileOutlined, SwapHorizOutlined } from "@mui/icons-material";

export const ReassignmentForm = () => {
  const [targetGroupMode, setTargetGroupMode] = useState<"own" | "other">(
    "own",
  );

  return (
    <Panel title="Регистрация обращений ОП" icon={<SwapHorizOutlined />}>
      <Stack spacing={1.25}>
        <FormControl size="small" fullWidth>
          <InputLabel>Инициатор (для кого)</InputLabel>
          <Select label="Инициатор (для кого)" defaultValue="orlova">
            <MenuItem value="orlova">Мария Орлова</MenuItem>
            <MenuItem value="department">Отдел продаж</MenuItem>
            <MenuItem value="manager">Руководитель направления</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel>Контактное лицо (от кого)</InputLabel>
          <Select label="Контактное лицо (от кого)" defaultValue="orlova">
            <MenuItem value="orlova">Мария Орлова · 184209</MenuItem>
            <MenuItem value="ivanov">Алексей Иванов · 193840</MenuItem>
            <MenuItem value="assistant">Ассистент подразделения</MenuItem>
          </Select>
        </FormControl>

        <ToggleButtonGroup
          exclusive
          fullWidth
          size="small"
          value={targetGroupMode}
          onChange={(_, value: "own" | "other" | null) => {
            if (value) setTargetGroupMode(value);
          }}
          aria-label="Направление переназначения"
        >
          <ToggleButton value="own">На свою РГ</ToggleButton>
          <ToggleButton value="other">На другую РГ</ToggleButton>
        </ToggleButtonGroup>

        {targetGroupMode === "other" ? (
          <FormControl size="small" fullWidth>
            <InputLabel>Рабочая группа</InputLabel>
            <Select label="Рабочая группа" defaultValue="iam">
              <MenuItem value="iam">IAM / Учетные записи</MenuItem>
              <MenuItem value="workplace">Рабочее место</MenuItem>
              <MenuItem value="network">Сеть и VPN</MenuItem>
            </Select>
          </FormControl>
        ) : null}

        <TextField
          label="Услуга (объект)"
          defaultValue="Рабочее место сотрудника / учетная запись"
          size="small"
        />

        <TextField label="КЭ" defaultValue="AD-MSK-USER-184209" size="small" />

        <TextField
          label="Тема обращения"
          defaultValue="Заблокирована учетная запись после смены пароля"
          size="small"
        />

        <TextField
          label="Описание"
          defaultValue="Пользователь сообщает, что после смены пароля не может войти в доменную учетную запись. Требуется проверка блокировок и журн..."
          multiline
          minRows={4}
          size="small"
        />

        {targetGroupMode === "other" ? (
          <TextField
            label="ТЕГ"
            defaultValue="IAM, учетная запись, блокировка"
            size="small"
          />
        ) : null}

        <TextField
          label="Решение"
          defaultValue="Проверена активность учетной записи. При повторной ошибке направить в IAM для анализа политик блокировки."
          multiline
          minRows={3}
          size="small"
        />

        {targetGroupMode === "own" ? (
          <TextField
            label="ТЕГ"
            defaultValue="консультация, первая линия, учетная запись"
            size="small"
          />
        ) : null}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1,
          }}
        >
          <FormControl size="small" fullWidth>
            <InputLabel>Приоритет</InputLabel>
            <Select label="Приоритет" defaultValue="high">
              <MenuItem value="high">Высокий</MenuItem>
              <MenuItem value="medium">Средний</MenuItem>
              <MenuItem value="low">Низкий</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Код закрытия</InputLabel>
            <Select label="Код закрытия" defaultValue="consultation">
              <MenuItem value="consultation">Консультация</MenuItem>
              <MenuItem value="resolved">Решено 1 линией</MenuItem>
              <MenuItem value="transfer">Передано в профильную РГ</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          component="label"
          variant="outlined"
          startIcon={<AttachFileOutlined />}
        >
          Добавить вложение
          <input hidden type="file" />
        </Button>

        <Button variant="contained" startIcon={<SwapHorizOutlined />}>
          Зарегистрировать
        </Button>
      </Stack>
    </Panel>
  );
};
