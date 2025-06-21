import baseApi, { ApiTagType } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserDashboardData: builder.query({
            query: (payload) => ({
                url: `/analytics/users/${payload.id}`,
                method: "GET",
            }),
            providesTags: [ApiTagType.USER],
        }),
        getUserById: builder.query({
            query: (payload) => ({
                url: `/users/${payload.id}`,
                method: "GET",
            }),
            providesTags: [ApiTagType.USER],
        }),
        getUserRoleInSession: builder.query({
            query: (payload) => ({
                url: `/session/${payload.sessionId}/roles/${payload.userId}`,
                method: "GET",
            }),
            providesTags: [ApiTagType.USER],
        }),

        createUser: builder.mutation({
            query: (payload) => ({
                url: "/users",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: [ApiTagType.USER],
        }),
    }),
});

export const {
    useGetUserDashboardDataQuery,
    useGetUserByIdQuery,
    useGetUserRoleInSessionQuery,
    useCreateUserMutation,
} = userApi;
