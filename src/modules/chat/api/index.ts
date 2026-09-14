import { baseApi } from "@shared/api";

import type {
  ChatHistoryDTO,
  GetChatHistoryDTO,
  SendMessageRequestDTO,
  SendMessageResponseDTO,
} from "../types";
import { arrayBufferToBinaryString } from "../utils";

const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatHistory: builder.query<ChatHistoryDTO, GetChatHistoryDTO>({
      query: ({ numberId, pageStart, pageCount }: GetChatHistoryDTO) => {
        return {
          url: `web-ews-middle/chat/history/${numberId}`,
          method: "GET",
          params: { pageStart, pageCount },
        };
      },
    }),
    sendMessage: builder.mutation<
      SendMessageResponseDTO,
      SendMessageRequestDTO
    >({
      query: (dto: SendMessageRequestDTO) => {
        return {
          url: "web-ews-middle/chat/sendMessage",
          method: "POST",
          body: dto,
        };
      },
    }),
    getChatAttachment: builder.query<string, string>({
      query: (guid: string) => ({
        url: `web-ews-middle/chat/attachment/${guid}`,
        method: "GET",
        // Декодируем в бинарную строку (Latin-1) уже здесь: результат сериализуем для Redux
        // и байты НЕ искажаются (в отличие от response.text(), портящего байты > 0x7F).
        responseHandler: async (response) =>
          arrayBufferToBinaryString(await response.arrayBuffer()),
      }),
    }),
  }),
});

export const {
  useGetChatHistoryQuery,
  useSendMessageMutation,
  useLazyGetChatAttachmentQuery,
} = chatApi;
