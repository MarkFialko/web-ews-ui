import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BrowserRouter } from "react-router-dom";
import { CommandPaletteProvider } from "@app/command-palette";
import { store } from "@app/store";
import { AppNotificationsProvider } from "@shared/notifications";
import { useTaskCacheInit } from "@shared/hooks/useTaskCacheInit";
import { WorklogFlusher } from "@shared/worklog-logger";

import { AuthGuard } from "@shared/user";
import { theme, THEME_MODE_STORAGE_KEY } from "./theme";

import "./dayjs";
import { AppRouter } from "@app/routing";
import { TelephonyProvider } from "@modules/cti/model/TelephonyProvider";

function TaskCacheInit() {
  useTaskCacheInit();
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      {/* Флашер внутри Provider (ему нужен redux-контекст), но снаружи роутинга —
          чтобы не размонтироваться при навигации. */}
      <WorklogFlusher />
      <ThemeProvider
        theme={theme}
        modeStorageKey={THEME_MODE_STORAGE_KEY}
        defaultMode="light"
      >
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="ru"
          localeText={{
            cancelButtonLabel: "Отмена",
            okButtonLabel: "Выбрать",
          }}
        >
          <CssBaseline />
          <AppNotificationsProvider>
            <AuthGuard>
              <BrowserRouter basename="web-ews-ui">
                <TelephonyProvider>
                  <CommandPaletteProvider>
                    <TaskCacheInit />
                    <AppRouter />
                  </CommandPaletteProvider>
                </TelephonyProvider>
              </BrowserRouter>
            </AuthGuard>
          </AppNotificationsProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}
