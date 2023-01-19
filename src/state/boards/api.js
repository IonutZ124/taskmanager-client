import { api } from "../emptySplitApi";

export const boards = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserBoards: builder.query({
      query: (page = 1) => `/get-user-boards?page=${page}`,
      providesTags: ["Samples"],
    }),
    getUserArchivedBoards: builder.query({
      query: (page = 1) => `/get-user-archived-boards?page=${page}`,
      providesTags: ["ArchivedBoards"],
    }),
    getBoardsWhereUserIsMember: builder.query({
      query: (page = 1) => `/get-joined-boards?page=${page}`,
      providesTags: ["JoinedBoards"],
    }),
    createBoard: builder.mutation({
      query: (payload) => ({
        url: "/create-board",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Samples"],
    }),
    deleteUserBoard: builder.mutation({
      query: (id) => ({
        url: `/delete-board/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Samples", "ArchivedBoards"],
    }),
    archiveBoard: builder.mutation({
      query: (id) => ({
        url: `/archive-board/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Samples", "ArchivedBoards"],
    }),
    changeBoardMemberRole: builder.mutation({
      query: (payload) => ({
        url: "/change-boardmember-role",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["BoardMembers"],
    }),
    createNewStatus: builder.mutation({
      query: (payload) => ({
        url: "/create-status",
        method: "POST",
        body: payload,
      }),
    }),
    deleteBoardStatus: builder.mutation({
      query: (id) => ({
        url: `/delete-status/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Statuses"],
    }),
    getBoardContent: builder.query({
      query: (slug) => ({
        url: `/board/${slug}`,
      }),
      providesTags: ["Statuses"],
    }),
    getBoardMembers: builder.query({
      query: ({ slug, page, search }) => ({
        url:
          search && search.length
            ? `/get-board-members/${slug}?search=${search}`
            : `/get-board-members/${slug}?page=${page}`,
      }),
      providesTags: ["BoardMembers"],
    }),
    removeMemberFromBoard: builder.mutation({
      query: ({ id, member_id }) => ({
        url: `/remove-member-from-board/${id}`,
        method: "DELETE",
        body: { member_id: member_id },
      }),
      invalidatesTags: ["BoardMembers"],
    }),
    joinBoard: builder.mutation({
      query: (payload) => ({
        url: "/accept-board-invite",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["JoinedBoards"],
    }),
    sendBoardInvite: builder.mutation({
      query: (payload) => ({
        url: "/send-invite",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetUserBoardsQuery,
  useGetUserArchivedBoardsQuery,
  useGetBoardsWhereUserIsMemberQuery,
  useCreateBoardMutation,
  useDeleteUserBoardMutation,
  useArchiveBoardMutation,
  useChangeBoardMemberRoleMutation,
  useCreateNewStatusMutation,
  useDeleteBoardStatusMutation,
  useLazyGetBoardContentQuery,
  useGetBoardMembersQuery,
  useRemoveMemberFromBoardMutation,
  useJoinBoardMutation,
  useSendBoardInviteMutation,
} = boards;
