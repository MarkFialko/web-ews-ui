import { useSendMessageMutation } from "../api";

import { type SendMessageRequestDTO } from "../types";

export const useChat = () => {
  const [send, mutationState] = useSendMessageMutation();

  const sendMessage = (dto: SendMessageRequestDTO) => {
    return send(dto).unwrap();
  };

  return { sendMessage, ...mutationState };
};
