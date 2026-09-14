import {
  type ICreateTransportConfig,
  TransportPaths,
} from "@sber-scpl/core/jssdk";

export const CREATE_TRANSPORT_CONFIG: Omit<ICreateTransportConfig, "host"> = {
  path: TransportPaths.AGENT,
  requestTimeout: 20000,
  maxRetries: 0,
  delay: 0,
  shouldPutPingsToLogStack: false,
};
