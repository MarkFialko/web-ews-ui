import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import {
  COMMUNICATION_CHANNEL,
  COMMUNICATION_STATE,
} from "../constants/communication";

type CommunicationMeta = {
  label: string;
  viaLabel: string;
  openLabel: string;
  Icon: typeof ChatOutlinedIcon;
};

const CHANNEL_META: Record<string, CommunicationMeta> = {
  [COMMUNICATION_CHANNEL.CHAT]: {
    label: "Чат",
    viaLabel: "через Чат",
    openLabel: "Открыть чат",
    Icon: ChatOutlinedIcon,
  },
  [COMMUNICATION_CHANNEL.PROTOCOL]: {
    label: "Протокол",
    viaLabel: "через Протокол",
    openLabel: "Открыть протокол",
    Icon: DescriptionOutlinedIcon,
  },
  [COMMUNICATION_CHANNEL.CALL]: {
    label: "Звонок",
    viaLabel: "по телефону",
    openLabel: "Журнал звонков",
    Icon: PhoneOutlinedIcon,
  },
};

export const getCommunicationChannelMeta = (
  channel: string,
): CommunicationMeta =>
  CHANNEL_META[channel] ?? CHANNEL_META[COMMUNICATION_CHANNEL.CALL];

export const formatCommunicationTimestamp = (value: string): string =>
  new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

type CommunicationState =
  | { state: typeof COMMUNICATION_STATE.INITIAL }
  | {
      state: typeof COMMUNICATION_STATE.WAITING;
      channel: string;
      timestamp: string;
    }
  | {
      state: typeof COMMUNICATION_STATE.USER_REPLIED;
      channel: string;
      message: { direction: string; channel: string; timestamp: string };
    };

export const getCommunicationState = (incident: {
  communication?: {
    messages: { direction: string; channel: string; timestamp: string }[];
  };
}): CommunicationState => {
  const messages = [...(incident?.communication?.messages ?? [])].sort(
    (left, right) =>
      new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime(),
  );

  const lastOutgoing = [...messages]
    .reverse()
    .find((message) => message.direction === "outgoing");
  const lastIncoming = [...messages]
    .reverse()
    .find((message) => message.direction === "incoming");

  if (!lastOutgoing) {
    return { state: COMMUNICATION_STATE.INITIAL };
  }

  if (
    lastIncoming &&
    new Date(lastIncoming.timestamp).getTime() >
      new Date(lastOutgoing.timestamp).getTime()
  ) {
    return {
      state: COMMUNICATION_STATE.USER_REPLIED,
      channel: lastIncoming.channel,
      message: lastIncoming,
    };
  }

  return {
    state: COMMUNICATION_STATE.WAITING,
    channel: lastOutgoing.channel,
    timestamp: lastOutgoing.timestamp,
  };
};
