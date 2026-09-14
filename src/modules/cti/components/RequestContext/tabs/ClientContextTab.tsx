import {
  Paper,
  alpha,
  Stack,
  Typography,
  Chip,
  TextField,
  Box,
} from "@mui/material";
import { PhoneInTalkOutlined, PhoneIphone } from "@mui/icons-material";

import { CopyButton } from "@shared/ui";

import { ClientPlainText, ContactValue } from "../common";

export const ClientContextTab = () => {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box
        sx={(theme) => ({
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 300px" },
          gap: 1.25,
          p: 1.25,
          bgcolor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.primary.main, 0.1)
              : alpha(theme.palette.primary.main, 0.06),
          borderBottom: 1,
          borderColor: "divider",
        })}
      >
        <Stack direction="row" spacing={1.25} sx={{ minWidth: 0, flex: 1 }}>
          <Box
            sx={(theme) => ({
              display: "grid",
              width: 44,
              height: 44,
              flex: "0 0 auto",
              placeItems: "center",
              borderRadius: 2,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: 900,
              fontSize: 17,
            })}
          >
            МО
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Typography variant="h6" sx={{ fontWeight: 900, mr: 0.5 }}>
                Мария Орлова
              </Typography>
              <CopyButton value="Мария Орлова" hint="Скопировать ФИО" />
              <Chip label="Активный сотрудник" size="small" color="success" />
              <Chip label="VIP" size="small" color="warning" />
              <Chip label="Пилот Web EWS" size="small" variant="outlined" />
            </Stack>

            <Stack
              direction="row"
              spacing={0.75}
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 0.5 }}
            >
              <Chip label="ТН 000184209" size="small" variant="outlined" />
              <Chip label="УД-184209" size="small" variant="outlined" />
              <Chip
                label="Инженер по продажам"
                size="small"
                variant="outlined"
              />
              <Chip label="ЦАМБ (8567)" size="small" variant="outlined" />
              <Chip label="12:34 GMT+3" size="small" variant="outlined" />
              <Chip
                label="Продажи корпоративным клиентам"
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>
        </Stack>

        <Stack
          spacing={0.5}
          sx={{
            minWidth: { md: 260 },
            alignSelf: { xs: "stretch", md: "flex-start" },
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Телефоны
          </Typography>
          <ContactValue
            icon={<PhoneIphone fontSize="small" />}
            label="Мобильный"
            value="+7 (916) 482-15-04"
          />
          <ContactValue
            icon={<PhoneInTalkOutlined fontSize="small" />}
            label="Внутренний"
            value="8-55714222"
          />
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridColumn: { md: "1 / -1" },
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(3, minmax(0, 1fr))",
            },
            gap: 0.75,
          }}
        >
          <ClientPlainText
            label="Подразделение сотрудника"
            value="отдел продаж корпоративным клиентам"
          />
          <ClientPlainText label="Местное время" value="12:34 GMT+3" />
          <ClientPlainText
            label="Профиль УД"
            value="УД-184209, активный профиль пользователя"
          />
          <ClientPlainText
            label="Внутренняя почта"
            value="m.orlova@corp.local"
            copyable
          />
          <ClientPlainText
            label="Внешняя почта"
            value="m.orlova@example.ru"
            copyable
          />
          <ClientPlainText
            label="Место работы"
            value="Москва, БЦ Кутузовский, 8 этаж, место 8-124"
          />
          <ClientPlainText label="Режим работы" value="Сегодня удаленно" />
          <ClientPlainText label="График" value="с 08:00 до 17:00" />
        </Box>
      </Box>

      <Box sx={{ p: 1.25 }}>
        <TextField
          label="Информация о запросе"
          defaultValue={`Робот: Опишите, пожалуйста, проблему.
Клиент: После смены пароля не могу войти в учетную запись.
Робот: Уточните, ошибка возникает при входе в Windows или во внутреннюю систему?
Клиент: При входе в Windows на рабочем ноутбуке.
Робот: Передаю обращение оператору.`}
          multiline
          minRows={5}
          size="small"
          fullWidth
        />
      </Box>
    </Paper>
  );
};
