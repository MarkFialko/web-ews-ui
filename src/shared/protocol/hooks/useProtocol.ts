import { useUser } from "@shared/user";
import type { RequestDTO } from "@shared/request";
import { useWorklogLogger, WORKLOG_ACTIONS } from "@shared/worklog-logger";

import { useSendToProtocolMutation } from "../api";
import {
  PROTOCOL_TYPE_CODES,
  type ProtocolType,
  type SendToProtocolDTO,
} from "../types";

const normalizeProtocolType = (
  ticketId: string,
  protocolType: ProtocolType,
) => {
  const shouldChangeType = ticketId.trim().toUpperCase().startsWith("INC");

  if (shouldChangeType) {
    return protocolType === PROTOCOL_TYPE_CODES.USER_MESSAGE
      ? PROTOCOL_TYPE_CODES.MESSAGE_TO_INITIATOR
      : PROTOCOL_TYPE_CODES.MESSAGE_TO_PERFORMER;
  }

  return protocolType;
};

export const useProtocol = () => {
  const [handler, mutationState] = useSendToProtocolMutation();

  const log = useWorklogLogger();

  const { user } = useUser();

  const sendToProtocol = (
    request: RequestDTO,
    message: string,
    typeCode: ProtocolType,
  ) => {
    const dto: SendToProtocolDTO = {
      taskId: request.taskId!,
      taskNumber: request.businessId,
      textMessage: message,
      typeCode: normalizeProtocolType(request.businessId, typeCode),
      createdBy: user?.empObjectId ?? "Не опредён",
      replyTo: null,
    };

    return handler(dto)
      .unwrap()
      .then((result) => {
        log({
          action: WORKLOG_ACTIONS.WRITE_INFO_PROTOCOL,
          task: dto.taskNumber,
          commentParams: { text: dto.textMessage },
        });

        return result;
      });
  };

  return { sendToProtocol, ...mutationState };
};
