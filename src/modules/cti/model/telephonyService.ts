import {
  AGENT_MODE_CHANGED,
  AGENT_STATE_CHANGED,
  CAPACITY_UPDATED,
  CHANGED_VOICE_MODE,
  CLOSE_AGENT_SESSION,
  CONTACT_DATA_UPDATED,
  DEACTIVATE_AGENT,
  INTERACTION_COMPLETED,
  INTERACTIONS_CLEARED,
  NEED_RECOVERY_WORKITEM,
  NEW_INTERACTION,
  RECONNECTION_ATTEMPTS_HAVE_ENDED,
  SCPL,
  SERVER_IS_NOT_AVAILABLE,
  type IAgent,
  type ISCPL,
  type IWebSocketClient,
  type IWebSocketStatus,
} from "@sber-scpl/core/jssdk";
import { EventEmitter } from "events";
import { CREATE_TRANSPORT_CONFIG } from "../config";
import { enqueueSnackbar } from "notistack";

export const CONNECTION_STATUS_CHANGED = "connectionStatusChanged";
export const TRANSPORT_CONNECTING = "transportConnecting";
export const TRANSPORT_CONNECTED = "transportConnected";
export const TRANSPORT_DISCONNECTED = "transportDisconnected";
export const TRANSPORT_ERROR = "transportError";

/** События агента, которые сервис ретранслирует на себе, чтобы хуки могли подписываться
 * на стабильный объект (service) и не заботиться о моменте появления реального Agent. */
export const AGENT_EVENTS = {
  AGENT_STATE_CHANGED: AGENT_STATE_CHANGED,
  AGENT_MODE_CHANGED: AGENT_MODE_CHANGED,
  CAPACITY_UPDATED: CAPACITY_UPDATED,
  NEW_INTERACTION: NEW_INTERACTION,
  INTERACTION_COMPLETED: INTERACTION_COMPLETED,
  INTERACTIONS_CLEARED: INTERACTIONS_CLEARED,
  CONTACT_DATA_UPDATED: CONTACT_DATA_UPDATED,
  CHANGED_VOICE_MODE: CHANGED_VOICE_MODE,
  NEED_RECOVERY_WORKITEM: NEED_RECOVERY_WORKITEM,
  DEACTIVATE_AGENT: DEACTIVATE_AGENT,
  CLOSE_AGENT_SESSION: CLOSE_AGENT_SESSION,
  SERVER_IS_NOT_AVAILABLE: SERVER_IS_NOT_AVAILABLE,
  RECONNECTION_ATTEMPTS_HAVE_ENDED: RECONNECTION_ATTEMPTS_HAVE_ENDED,
} as const;

/**
 * Тонкий адаптер над ISCPL: создаёт транспорт + агента, ретранслирует его события
 * на себе и хранит статус подключения. Весь остальной код приложения обращается к SDK
 * только через этот сервис — ISCPL/MockSCPL нигде больше не импортируются напрямую.
 */
export class TelephonyService extends EventEmitter {
  private _scpl: ISCPL;
  private _transport?: IWebSocketClient;
  private _agent?: IAgent;
  private _status: IWebSocketStatus = "idle";
  private _host: string;

  constructor() {
    super();
    this._scpl = new SCPL();
  }

  getAgent(): IAgent | undefined {
    return this._agent;
  }

  getStatus(): IWebSocketStatus {
    return this._status;
  }

  private _setStatus(status: IWebSocketStatus): void {
    this._status = status;
    this.emit(CONNECTION_STATUS_CHANGED, status);
  }

  private _relayAgentEvents(agent: IAgent): void {
    Object.values(AGENT_EVENTS).forEach((event) => {
      agent.on(event, (...args: unknown[]) => this.emit(event, ...args));
    });
  }

  connect = async (host?: string): Promise<void> => {
    if (host) {
      this._host = host;
    }
    this._setStatus("connecting");
    try {
      this.emit(TRANSPORT_CONNECTING);
      this._transport = await this._scpl.createProxyTransport({
        ...CREATE_TRANSPORT_CONFIG,
        host: this._host,
      });

      this._transport.on("connected", async () => {
        const transportMessage = "[CTI] Транспорт подключен";

        enqueueSnackbar(transportMessage, { variant: "success" });

        this.emit(TRANSPORT_CONNECTED);

        this._agent = this._scpl.createAgent(this._transport!, true);
        this._relayAgentEvents(this._agent);
        const result = await this._agent.start();
        this._setStatus(result.ok ? "connected" : "failed");
      });

      this._transport.on("disconnected", (error) => {
        const message = "[CTI] Транспорт отключен: " + JSON.stringify(error);

        enqueueSnackbar(message, { variant: "error" });

        this.emit(TRANSPORT_DISCONNECTED, error);

        this._setStatus("failed");
      });
    } catch (error) {
      const message =
        "[CTI] Ошибка при создании транспорта: " + JSON.stringify(error);

      enqueueSnackbar(message, { variant: "error" });

      this.emit(TRANSPORT_ERROR, error);

      this._setStatus("failed");
    }
  };

  /** Переподключение вручную (например, по кнопке в панели) — переиспользует конфиг последнего connect(). */
  reconnect = async (): Promise<void> => {
    this._scpl.clear();
    this._transport = undefined;
    this._agent = undefined;
    await this.connect();
  };

  disconnect = (): void => {
    this._transport?.emit("disconnected", null);
    this._scpl.clear();
    this._transport = undefined;
    this._agent = undefined;
    this._setStatus("disconnected");
  };
}
