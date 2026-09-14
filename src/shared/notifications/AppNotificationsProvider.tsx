import type { ReactNode } from "react";
import { SnackbarProvider } from "notistack";

export type AppNotificationsProviderProps = {
  children: ReactNode;
};

function AppNotificationsProvider({ children }: AppNotificationsProviderProps) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      {children}
    </SnackbarProvider>
  );
}

export default AppNotificationsProvider;
