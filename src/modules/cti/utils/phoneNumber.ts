import type { IVoiceInteractionData } from "@sber-scpl/core/jssdk";

export const resolveInteractionNumber = (data?: IVoiceInteractionData) => {
  if (!data) return "Не определён";
  const phone =
    data.direction === "outbound"
      ? data.primaryDestinationNumber
      : data.primaryCallingNumber;
  return phone ?? "Не определён";
};
