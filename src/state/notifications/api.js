import { api } from "../emptySplitApi";

export const getUserNotifications = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserNotifications: builder.query({
      query: (page = 1) => ({
        url: `/get-user-notifications?page=${page}`,
      }),
      providesTags: ["UserNotifications"],
    }),
    markNotificationAsSeen: builder.mutation({
      query: (payload) => ({
        url: "/mark-notification-as-seen",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["UserNotifications", "CheckNotifications"],
    }),
    deleteNotifiaction: builder.mutation({
      query: (id) => ({
        url: `/delete-notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserNotifications", "CheckNotifications"],
    }),
    checkUserNotifications: builder.query({
      query: () => `/has-user-unseen-notifications`,
      providesTags: ["CheckNotifications"],
    }),
  }),
});

export const {
  useGetUserNotificationsQuery,
  useLazyGetUserNotificationsQuery,
  useMarkNotificationAsSeenMutation,
  useDeleteNotifiactionMutation,
  useCheckUserNotificationsQuery,
} = getUserNotifications;
