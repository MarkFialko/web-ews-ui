export { useAgentSnapshot } from "./useAgentSnapshot";
export { TelephonyProvider, useTelephonyService } from "./TelephonyProvider";
export { useActiveVoiceInteraction } from "./useActiveVoiceInteraction";
export { useVoiceInteractionSnapshot } from "./useVoiceInteractionSnapshot";
export { useTimer } from "./useElapsedTime";
export { CTIProvider, useCTI } from "./CTIContext";
export { useCtiEvents } from "./useCtiEvents";
export { useInteractionLogs } from "./useInteractionLogs";
export { useCallHistory } from "./useCallHistory";
export type { CallRecord, CallType } from "./useCallHistory";
export { useSaveHistory } from "./useSaveHistory";
export { useAgentAction, type AgentActionTarget } from "./useAgentAction";

export {
  CONTEXT_KEYS,
  CONTEXT_KEY_MAP,
  getContext,
  type CTIContext,
} from "./context";
