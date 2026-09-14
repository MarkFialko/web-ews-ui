/**
 * Локальная заглушка приватного пакета `@sber-scpl/core/jssdk` (внутренний CTI SDK
 * Сбербанка, недоступен вне корпоративного реестра npm).
 *
 * Назначение: дать проекту собраться и запуститься (`npm run dev` / `npm run build` /
 * `tsc`) без доступа к реальному пакету. Реального подключения к телефонии эта
 * заглушка не выполняет — `SCPL.createProxyTransport()` резолвится в транспорт,
 * который никогда не эмитит "connected", поэтому CTI-модуль останется в состоянии
 * "не подключено", но не уронит приложение.
 *
 * Экспортируемые имена и их использование собраны по факту импортов из
 * `@sber-scpl/core/jssdk` во всём `src/modules/cti/` — это не официальная
 * спецификация SDK, а минимально достаточный набор форм под то, что реально
 * читается/вызывается в коде.
 */

type EventHandler = (...args: any[]) => void;

// ---------------------------------------------------------------------------
// Имена событий (значения — произвольные уникальные строки, важна только
// уникальность между собой, не совпадение с реальным SDK).
// ---------------------------------------------------------------------------



export const AGENT_STATE_CHANGED = "agentStateChanged";
export const AGENT_MODE_CHANGED = "agentModeChanged";
export const CAPACITY_UPDATED = "capacityUpdated";
export const CHANGED_VOICE_MODE = "changedVoiceMode";
export const CLOSE_AGENT_SESSION = "closeAgentSession";
export const CONTACT_DATA_UPDATED = "contactDataUpdated";
export const DEACTIVATE_AGENT = "deactivateAgent";
export const INTERACTIONS_CLEARED = "interactionsCleared";
export const INTERACTION_COMPLETED = "interactionCompleted";
export const NEED_RECOVERY_WORKITEM = "needRecoveryWorkitem";
export const NEW_INTERACTION = "newInteraction";
export const RECONNECTION_ATTEMPTS_HAVE_ENDED = "reconnectionAttemptsHaveEnded";
export const SERVER_IS_NOT_AVAILABLE = "serverIsNotAvailable";

export const AGENT_HANGUP = "agentHangup";
export const CLIENT_HANGUP = "clientHangup";
export const CONSULT_HANGUP = "consultHangup";
export const SERVER_HANGUP = "serverHangup";
export const CONTEXT_CHANGED = "contextChanged";
export const JOINED_TO_CONFERENCE = "joinedToConference";
export const MUTED = "muted";
export const RONA_TIMEOUT = "ronaTimeout";
export const WORKITEM_PARTYLIST_UPDATED = "workitemPartylistUpdated";
export const WORKITEM_STATE_CHANGED = "workitemStateChanged";

export const NEW_RTC_SESSION = "newRtcSession";
export const RTC_SESSION_TRACK = "track";

export const OutboundInteractionOptions = {
  DESTINATION_NUMBER: "destinationNumber",
} as const;

// ---------------------------------------------------------------------------
// Типы
// ---------------------------------------------------------------------------

export type IWebSocketStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "failed"
  | "disconnected";

export type WorkitemStateID = string;
export type InteractionDirection = "inbound" | "outbound";

export interface IStateReason {
  id: string;
  label: string;
  reasonType?: string;
  [key: string]: any;
}

export interface IState {
  id: string;
  label: string;
  reasons?: IStateReason[];
  [key: string]: any;
}

export interface IDictionaries {
  states: IState[];
  [key: string]: any;
}

export interface IAgentState {
  stateID?: string;
  reasonID?: string;
  nextAgentState?: string;
  nextReasonID?: string;
  timestampAgentState?: number;
  label?: string;
  [key: string]: any;
}

export interface IAgentMode {
  [key: string]: any;
}

export interface IPartyListParticipant {
  callID?: string;
  userId?: string;
  hold?: boolean;
  party?: string;
  state?: string;
  [key: string]: any;
}

export interface IWorkitemState {
  workitemStateID?: WorkitemStateID;
  [key: string]: any;
}

export interface IVoiceInteractionData {
  direction?: InteractionDirection;
  service?: { name?: string; [key: string]: any };
  startTime?: string;
  endTime?: string;
  [key: string]: any;
}

export interface IVoiceInteraction {
  id?: string;
  duration?: number;
  direction?: InteractionDirection;
  rtcSession?: {
    remoteStream?: MediaStream;
    on: (event: string, handler: EventHandler) => void;
  };
  getWorkitemState: () => IWorkitemState | undefined;
  getWorkitemPartyList: () => IPartyListParticipant[];
  getContext: () => Promise<Record<string, any>>;
  getInteractionData: () => IVoiceInteractionData | undefined;
  hangup: () => Promise<IWebSocketTransactionResult>;
  accept: () => Promise<IWebSocketTransactionResult>;
  hold: (callIDs: string[]) => Promise<IWebSocketTransactionResult>;
  resume: (callID: string) => Promise<IWebSocketTransactionResult>;
  transfer: (opts: {
    destination: string;
    transferTo: string;
    transferType: string;
  }) => Promise<IWebSocketTransactionResult>;
  cancelTransfer: () => Promise<IWebSocketTransactionResult>;
  closeConference: () => Promise<IWebSocketTransactionResult>;
  joinToConference: (callIDs: string[]) => Promise<IWebSocketTransactionResult>;
  muteMicrophone: () => Promise<IWebSocketTransactionResult>;
  unmuteMicrophone: () => Promise<IWebSocketTransactionResult>;
  on: (event: string, handler: EventHandler) => void;
  off: (event: string, handler: EventHandler) => void;
}

export interface IAgent {
  getAgentMode: () => IAgentMode | undefined;
  getAgentState: () => IAgentState | undefined;
  getDictionaries: () => IDictionaries | undefined;
  changeState: (
    stateId: string,
    reasonId?: string,
  ) => Promise<IWebSocketTransactionResult>;
  start: () => Promise<IWebSocketTransactionResult>;
  stop: (reasonId?: string) => Promise<IWebSocketTransactionResult>;
  createOutInteraction: (opts: {
    destination: string;
    outboundTo: string;
    channel: string;
  }) => Promise<IWebSocketTransactionResult>;
  assignPhoneNumber: (...args: any[]) => Promise<IWebSocketTransactionResult>;
  on: (event: string, handler: EventHandler) => void;
  off?: (event: string, handler: EventHandler) => void;
}

export interface IWebSocketClient {
  on: (event: string, handler: EventHandler) => void;
  emit: (event: string, ...args: any[]) => void;
}

export interface IWebSocketTransactionResult {
  ok: boolean;
  resultDesc?: string;
  data?: any;
}

export interface ICreateTransportConfig {
  host?: string;
  [key: string]: any;
}

export enum TransportPaths {
  AGENT = 'agent'
}

export interface ISCPL {
  createProxyTransport: (
    config: ICreateTransportConfig,
  ) => Promise<IWebSocketClient>;
  createAgent: (transport: IWebSocketClient, autoStart?: boolean) => IAgent;
  clear: () => void;
}

export interface Interaction {
  [key: string]: any;
}

// ---------------------------------------------------------------------------
// Рантайм-заглушка
// ---------------------------------------------------------------------------

class StubEmitter {
  private handlers = new Map<string, Set<EventHandler>>();

  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit(event: string, ...args: any[]): void {
    this.handlers.get(event)?.forEach((handler) => handler(...args));
  }
}

const notAvailable = (method: string): Promise<IWebSocketTransactionResult> =>
  Promise.resolve({
    ok: false,
    resultDesc: `[stub @sber-scpl/core/jssdk] "${method}" недоступен: реальный SDK не установлен`,
  });

class StubVoiceInteraction extends StubEmitter implements IVoiceInteraction {
  getWorkitemState = (): IWorkitemState | undefined => undefined;
  getWorkitemPartyList = (): IPartyListParticipant[] => [];
  getContext = (): Promise<Record<string, any>> => Promise.resolve({});
  getInteractionData = (): IVoiceInteractionData | undefined => undefined;
  hangup = () => notAvailable("hangup");
  accept = () => notAvailable("accept");
  hold = () => notAvailable("hold");
  resume = () => notAvailable("resume");
  transfer = () => notAvailable("transfer");
  cancelTransfer = () => notAvailable("cancelTransfer");
  closeConference = () => notAvailable("closeConference");
  joinToConference = () => notAvailable("joinToConference");
  muteMicrophone = () => notAvailable("muteMicrophone");
  unmuteMicrophone = () => notAvailable("unmuteMicrophone");
}

class StubAgent extends StubEmitter implements IAgent {
  getAgentMode = (): IAgentMode | undefined => undefined;
  getAgentState = (): IAgentState | undefined => undefined;
  getDictionaries = (): IDictionaries => ({ states: [] });
  changeState = () => notAvailable("changeState");
  start = () => notAvailable("start");
  stop = () => notAvailable("stop");
  createOutInteraction = () => notAvailable("createOutInteraction");
  assignPhoneNumber = () => notAvailable("assignPhoneNumber");
}

class StubTransport extends StubEmitter implements IWebSocketClient {}

/**
 * Заглушка `SCPL`: транспорт создаётся успешно, но событие "connected" никогда
 * не эмитится — `telephonyService.connect()` останется в статусе "connecting"
 * бесконечно, без падения приложения. Это осознанное поведение: без реального
 * SDK CTI не может подключиться по-настоящему, а падать из-за этого не должен.
 */
export class SCPL implements ISCPL {
  createProxyTransport(
    _config: ICreateTransportConfig,
  ): Promise<IWebSocketClient> {
    return Promise.resolve(new StubTransport());
  }

  createAgent(_transport: IWebSocketClient, _autoStart?: boolean): IAgent {
    return new StubAgent();
  }

  clear(): void {}
}

export { StubVoiceInteraction, StubAgent, StubTransport };
