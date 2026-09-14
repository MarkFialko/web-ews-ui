import { useState } from "react";

import { PersonSearchOutlined } from "@mui/icons-material";
import { Box, Stack, Typography, Tabs, Tab } from "@mui/material";

import { Panel } from "../common";

import {
  AccessContextTab,
  ClientContextTab,
  PcInfoTab,
  RequestsContextTab,
} from "./tabs";

interface Props {
  activeCallUuid: string | null;
}

export const RequestContext = (props: Props) => {
  const { activeCallUuid } = props;

  const [activeContextTab, setActiveContextTab] = useState(0);

  return (
    <Panel title="Контекст заявки" icon={<PersonSearchOutlined />}>
      <Stack spacing={1.5}>
        {activeCallUuid ? (
          <Box
            sx={(theme) => ({
              px: 1,
              py: 0.75,
              border: 1,
              borderColor: theme.palette.divider,
              borderRadius: 1.5,
              bgcolor: theme.palette.action.hover,
            })}
          >
            <Typography variant="caption" color="text.secondary">
              UUID входящего звонка
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "text.primary",
                fontFamily: "monospace",
                overflowWrap: "anywhere",
              }}
            >
              {activeCallUuid}
            </Typography>
          </Box>
        ) : null}

        <Tabs
          value={activeContextTab}
          onChange={(_, value: number) => setActiveContextTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Вкладки контекста заявки"
        >
          <Tab label="Клиент" />
          <Tab label="Доступы" />
          <Tab label="Инфо о ПК" />
          <Tab label="Обращения" />
        </Tabs>

        {activeContextTab === 0 ? <ClientContextTab /> : null}
        {activeContextTab === 1 ? <AccessContextTab /> : null}
        {activeContextTab === 2 ? <PcInfoTab /> : null}
        {activeContextTab === 3 ? <RequestsContextTab /> : null}
      </Stack>
    </Panel>
  );
};
