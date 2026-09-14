import type {
  IAgentMode,
  IAgentState,
  IDictionaries,
  IPartyListParticipant,
  IVoiceInteraction,
  IVoiceInteractionData,
  IWebSocketStatus,
  IWorkitemState,
} from "@sber-scpl/core/jssdk";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useTelephonyService } from "./TelephonyProvider";
import {
  useActiveVoiceInteraction,
  useAgentSnapshot,
  useVoiceInteractionSnapshot,
} from ".";
import { resolveInteractionNumber } from "../utils";

interface CTIContext {
  status: IWebSocketStatus;
  state?: IAgentState;
  mode?: IAgentMode;
  dictionaries?: IDictionaries;

  isReady: boolean;

  interaction?: IVoiceInteraction;

  participants: IPartyListParticipant[];
  participantsWithoutMe: IPartyListParticipant[];
  workitemState?: IWorkitemState;
  // TODO: опечатка из оригинала — поле объявлено как interactionDate, но
  // везде в коде (в т.ч. в IncomingCallDialog.tsx) читается interactionData.
  // Похоже, реальный рантайм-объект интерфейсу не соответствует.
  interactionDate?: IVoiceInteractionData;

  firstLine: string;
  setFirstLine: (value: string) => void;
  secondLine: string;
  setSecondLine: (value: string) => void;
  thirdLine: string;
  setThirdLine: (value: string) => void;

  isPostProcessing: boolean;
  isCallActive: boolean;

  isTransfer: boolean;
  isConference: boolean;
}

const CTIContext = createContext<CTIContext | null>(null);

const PARTICIPANTS_ORDER = {
  owner: 0,
  agent: 1,
  client: 2,
  consultant: 3,
  extConsultant: 4,
}


const sortParticipantsByRole = (participants: IPartyListParticipant[]): IPartyListParticipant[]=> {
  return [...participants].sort((a,b) => {
    const orderA = PARTICIPANTS_ORDER[a.party] ?? Infinity
    const orderB = PARTICIPANTS_ORDER[b.party] ?? Infinity

    return orderA - orderB
  })
}

// TODO: sortParticipantsByRole используется ниже, но ни объявление, ни импорт
// не попали ни в один кадр — нужны ещё фото начала файла или utils/*.
export const CTIProvider = ({ children }: { children: ReactNode }) => {
  const service = useTelephonyService();

  const { status, dictionaries, mode, state } = useAgentSnapshot();
  const isReady = status === "connected";

  const interaction = useActiveVoiceInteraction();

  const snapshot = useVoiceInteractionSnapshot(interaction);
  const workitemState = snapshot?.workitemState;
  const participants = snapshot?.partyList ?? [];
  const interactionData = snapshot?.data;

  /** Первая линия */
  const [interactionPhone, setInteractionPhone] = useState("");
  const [secondLine, setSecondLine] = useState("");
  const [thirdLine, setThirdLine] = useState("");

  useEffect(() => {
    if (interactionData) {
      setInteractionPhone(resolveInteractionNumber(interactionData));
    }
  }, [interactionData]);

  const participantsWithoutMe = sortParticipantsByRole(
    participants.filter((p) => p.userId !== service.getAgent()?.getUserID()),
  );

  const isPostProcessing = workitemState?.workitemStateID === "Wrapup";
  const isCallActive = !!interaction! && !isPostProcessing;

  const isTransfer = workitemState?.workitemStateID === "Transfer";
  const isConference = workitemState?.workitemStateID === "Conference";

  const value = {
    status: status,
    dictionaries: dictionaries,
    mode: mode,
    state: state,

    isReady: isReady,

    interaction: interaction,

    participants: participants,
    participantsWithoutMe: participantsWithoutMe,
    workitemState: workitemState,
    interactionData: interactionData,

    firstLine: interactionPhone,
    setFirstLine: setInteractionPhone,
    secondLine: secondLine,
    setSecondLine: setSecondLine,
    thirdLine: thirdLine,
    setThirdLine: setThirdLine,

    isPostProcessing: isPostProcessing,
    isCallActive: isCallActive,

    isTransfer: isTransfer,
    isConference: isConference,
  };

  return <CTIContext.Provider value={value}>{children}</CTIContext.Provider>;
};

export const useCTI = () => {
  const ctx = useContext(CTIContext);

  if (!ctx)
    throw new Error("useCTI должен использоваться внутри <CTIProvider>");

  return ctx;
};
