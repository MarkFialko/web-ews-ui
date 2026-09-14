import { useState } from "react";

import {
  Paper,
  Stack,
  Typography,
  Chip,
  TextField,
  Divider,
  Box,
} from "@mui/material";

const accessItems = [
  {
    name: "AD / УД-184209",
    status: "Используется",
    details: "Последний вход: сегодня 09:42 · домен CORP",
  },
  {
    name: "VPN Office",
    status: "Заблокирована",
    details: "Причина: 5 неуспешных попыток входа",
  },
  {
    name: "SAP CRM",
    status: "Используется",
    details: "Роль: sales_user · действует до 30.06.2026",
  },
  {
    name: "SharePoint Sales",
    status: "Неактивен",
    details: "Причина: не использовался более 90 дней",
  },
];

export const AccessContextTab = () => {
  const [query, setQuery] = useState("");
  const blockedCount = accessItems.filter((item) =>
    ["Заблокирована", "Неактивен"].includes(item.status),
  ).length;
  const filteredItems = accessItems.filter((item) => {
    const text = `${item.name} ${item.status} ${item.details}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Stack spacing={1} sx={{ p: 1.25 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Typography variant="subtitle2">Доступы инициатора</Typography>
          {blockedCount ? (
            <Chip
              label={`${blockedCount} заблок.`}
              color="warning"
              size="small"
            />
          ) : null}
        </Stack>

        <TextField
          label="Поиск по имени или статусу"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          size="small"
          fullWidth
        />

        <Stack divider={<Divider flexItem />}>
          {filteredItems.map((item) => (
            <Stack
              key={item.name}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              sx={{ py: 0.85 }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.details}
                </Typography>
              </Box>
              <Chip
                label={item.status}
                size="small"
                color={
                  ["Заблокирована", "Неактивен"].includes(item.status)
                    ? "warning"
                    : "success"
                }
              />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};
