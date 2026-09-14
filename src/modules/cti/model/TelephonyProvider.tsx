import {
  type ReactNode,
  useRef,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";

import { TelephonyService } from "./telephonyService";
import {
  TRANSPORT_CONNECTING,
  TRANSPORT_CONNECTED,
  TRANSPORT_DISCONNECTED,
  TRANSPORT_ERROR,
  CONNECTION_STATUS_CHANGED,
} from "./telephonyService";

import { isBOUser, useUser } from "@shared/user";
import { CTIProvider } from "./CTIContext";
import { getConfig } from "@shared/config";

const TelephonyContext = createContext<TelephonyService | null>(null);

export function TelephonyProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();

  const serviceRef = useRef<TelephonyService | null>(null);
  if (!serviceRef.current) {
    serviceRef.current = new TelephonyService();
  }

  // Мемоизуем `isBOUser` по `user?.unit` — стабильному примитиву, а не по объекту
  // `user`, ссылка которого меняется при каждом рендере из-за spread в useUser().
  const shouldConnect = useMemo(() => isBOUser(user), [user]);

  useEffect(() => {
    if (!shouldConnect) return;
    const service = serviceRef.current;
    if (!service) return;
    getConfig().then((c) => {
      if (c) {
        service.connect(c.CTI_URL);
      }
    });
    return () => service.disconnect();
  }, [shouldConnect]);

  return (
    <TelephonyContext.Provider value={serviceRef.current}>
      <CTIProvider>{children}</CTIProvider>
    </TelephonyContext.Provider>
  );
}

export function useTelephonyService(): TelephonyService {
  const service = useContext(TelephonyContext);
  if (!service) {
    throw new Error(
      "useTelephonyService должен использоваться внутри <TelephonyProvider>",
    );
  }
  return service;
}

export {
  TRANSPORT_CONNECTING,
  TRANSPORT_CONNECTED,
  TRANSPORT_DISCONNECTED,
  TRANSPORT_ERROR,
  CONNECTION_STATUS_CHANGED,
};
