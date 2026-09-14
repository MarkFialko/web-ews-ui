import {
  Box,
  Stack,
  Paper,
  Divider,
  Button,
  Typography,
  Chip,
} from "@mui/material";
import { useState } from "react";

import { InfoLine } from "../../common";

const workstationItems = [
  {
    name: "NB-MSK-184209",
    os: "Windows 11 Enterprise 23H2",
    ip: "10.42.18.91",
    domain: "CORP",
    isLastSession: true,
    details: [
      ["NetBIOS", "NB-MSK-184209"],
      ["Домен пользователя", "CORP"],
      ["Домен компьютера", "CORP"],
      ["Производитель", "Lenovo"],
      ["Модель", "ThinkPad T14 Gen 3"],
      ["CPU", "Intel Core i7-1260P"],
      ["RAM", "32 ГБ"],
      ["Диск", "SSD 512 ГБ"],
      ["Дата установки ОС", "14.02.2026"],
      ["Каталог", "OU=Workstations,OU=Moscow,DC=corp"],
      ["MAC", "A4-5E-60-18-42-09"],
      ["Шлюз", "10.42.18.1"],
      ["BIOS SN", "PF4M184209"],
      ["BIOS пароль", "Установлен"],
      ["Last heartbeat", "сегодня 12:31"],
      ["Локация", "БЦ Кутузовский, 8 этаж, место 8-124"],
    ],
  },
  {
    name: "VDI-SALES-042",
    os: "Windows 10 VDI",
    ip: "10.88.42.77",
    domain: "VDI",
    isLastSession: false,
    details: [],
  },
];

export const PcInfoTab = () => {
  const [selectedArm, setSelectedArm] = useState(0);
  const current = workstationItems[selectedArm];

  return (
    <Stack spacing={1}>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Stack divider={<Divider flexItem />}>
          {workstationItems.map((arm, index) => (
            <Button
              key={arm.name}
              variant="text"
              onClick={() => setSelectedArm(index)}
              sx={{
                justifyContent: "space-between",
                p: 1,
                borderRadius: 0,
                textAlign: "left",
                bgcolor:
                  selectedArm === index ? "action.selected" : "transparent",
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Typography variant="body2" sx={{ fontWeight: 900 }}>
                    {arm.name}
                  </Typography>
                  {arm.isLastSession ? (
                    <Chip
                      label="Последняя сессия"
                      size="small"
                      color="primary"
                    />
                  ) : null}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {arm.os} · IP {arm.ip} · домен {arm.domain}
                </Typography>
              </Box>
            </Button>
          ))}
        </Stack>
      </Paper>

      {current.details.length ? (
        <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Подробно АРМ
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 0.75,
            }}
          >
            {current.details.map(([label, value]) => (
              <InfoLine key={label} label={label} value={value} />
            ))}
          </Box>
        </Paper>
      ) : null}
    </Stack>
  );
};
