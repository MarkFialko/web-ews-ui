import { baseApi } from "@shared/api";
import type { ConfirmReadResponse, WebEwsUnreadNotification } from "../types";

const NOTIFICATION_API = "web-ews-middle/notifications";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUnreadChatNotifications: builder.query<WebEwsUnreadNotification[], void>(
      {
        query: () => ({
          url: `${NOTIFICATION_API}/at-work-unreaded`,
          method: "GET",
        }),
        providesTags: ["Notification"],
        // Поллинг управляется из useChatMessageBump хука через pollingInterval.
        keepUnusedDataFor: 0,
      },
    ),

    confirmNotificationRead: builder.mutation<
      ConfirmReadResponse,
      { messageId: number }
    >({
      query: ({ messageId }) => ({
        url: `${NOTIFICATION_API}/confirm/${messageId}`,
        method: "GET",
      }),
      // Инвалидируем кэш — RTK Query сделает refetch, businessId исчезнет
      // из ответа, и effect в useChatMessageBump корректно снимет бамп.
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetUnreadChatNotificationsQuery,
  useConfirmNotificationReadMutation,
} = notificationApi;
