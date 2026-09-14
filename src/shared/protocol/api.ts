import { baseApi } from "../api";
import type { SendToProtocolDTO } from "./types";

const protocolApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendToProtocol: builder.mutation<void, SendToProtocolDTO>({
      query: ({ taskNumber, ...dto }: SendToProtocolDTO) => ({
        url: `web-ews-middle/esm-actions/set-protocol/${taskNumber}`,
        method: "POST",
        body: dto,
      }),
    }),
  }),
});

export const { useSendToProtocolMutation } = protocolApi;
