import { useGetChatHistoryQuery } from "../api";

const TEN_SECONDS = 10_000;
const PAGE_COUNT = 100;

export const useChatHistory = (businessId: string) => {
  const { data: messages, ...queryState } = useGetChatHistoryQuery(
    {
      numberId: businessId!,
      pageStart: 0,
      pageCount: PAGE_COUNT,
    },
    {
      pollingInterval: TEN_SECONDS,
    },
  );

  return {
    messages: messages?.content ?? [],
    ...queryState,
  };
};
