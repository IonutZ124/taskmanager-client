import { api } from "../emptySplitApi";

export const task = api.injectEndpoints({
  endpoints: (builder) => ({
    createNewTask: builder.mutation({
      query: (payload) => ({
        url: "/create-task",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Statuses"],
    }),
    arctiveTask: builder.mutation({
      query: (id) => ({
        url: `/archive-task/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Statuses", "ArchivedTasks"],
    }),
    changeTaskStatus: builder.mutation({
      query: (payload) => ({
        url: "/change-task-status",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Statuses"],
    }),
    getTaskHistory: builder.query({
      query: ({ id, page }) => ({
        url: `/get-task-history/${id}?page=${page}`,
      }),
      providesTags: ["TaskHistory"],
    }),
    getTaskAssigned: builder.query({
      query: ({ id, page = 1 }) => ({
        url: `get-task-assigned-users/${id}?page=${page}`,
      }),
      providesTags: ["assignedUsers"],
    }),
    getUserArchivedTasks: builder.query({
      query: (page) => ({
        url: `/get-user-archived-tasks?page=${page}`,
      }),
      providesTags: ["ArchivedTasks"],
    }),
    assignUserToTask: builder.mutation({
      query: (payload) => ({
        url: "/assign-task-to-user",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["assignedUsers"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/delete-task/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Statuses"],
    }),
    createComment: builder.mutation({
      query: (payload) => ({
        url: "/create-comment",
        method: "POST",
        body: payload,
      }),
    }),
    deleteTaskComments: builder.mutation({
      query: (id) => ({
        url: `/delete-comment/${id}`,
        method: "DELETE",
      }),
    }),
    getTaskComments: builder.query({
      query: ({ id, page = 1 }) => ({
        url: `get-comments/${id}?page=${page}`,
      }),
      providesTags: ["taskComments"],
    }),
  }),
});
export const {
  useCreateNewTaskMutation,
  useArctiveTaskMutation,
  useChangeTaskStatusMutation,
  useGetTaskHistoryQuery,
  useGetTaskAssignedQuery,
  useGetUserArchivedTasksQuery,
  useAssignUserToTaskMutation,
  useDeleteTaskMutation,
  useCreateCommentMutation,
  useDeleteTaskCommentsMutation,
  useGetTaskCommentsQuery,
} = task;
