import { api } from "../emptySplitApi";

export const user = api.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (payload) => ({
        url: "/register",
        method: "POST",
        body: payload,
      }),
    }),
    loginUser: builder.mutation({
      query: (payload) => ({
        url: "/login",
        method: "POST",
        body: payload,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (payload) => ({
        url: "/verify-email",
        method: "POST",
        body: payload,
      }),
    }),
    resendVerifyEmail: builder.mutation({
      query: (payload) => ({
        url: "/resend-verify-email",
        method: "POST",
        body: payload,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: "/forgot-password",
        method: "POST",
        body: payload,
      }),
    }),
    changePassword: builder.mutation({
      query: (payload) => ({
        url: "/reset-password",
        method: "POST",
        body: payload,
      }),
    }),
    getAuthUser: builder.query({
      query: () => `/user`,
    }),
    getUserByID: builder.query({
      query: (id) => `/user/${id}`,
      providesTags: ["UserProfile"],
    }),
    uploadImageProfile: builder.mutation({
      query: (payload) => ({
        url: "/upload-profile-image",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useVerifyEmailMutation,
  useResendVerifyEmailMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useGetAuthUserQuery,
  useLazyGetAuthUserQuery,
  useGetUserByIDQuery,
  useUploadImageProfileMutation,
} = user;
