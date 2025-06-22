import baseApi, { ApiTagType } from "../baseApi";
import type { User } from "../users/user.type";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserList: builder.query<User[], void>({
            query: () => ({ url: "/users", method: "GET" }),
        }),

        getUserById: builder.query({
            query: (payload) => ({
                url: `/users/${payload.id}`,
                method: "GET",
            }),
            providesTags: [ApiTagType.USER],
        }),

        getUserDashboardData: builder.query({
            query: (payload) => ({
                url: `/analytics/users/${payload.id}`,
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
    useGetUserListQuery,
    useGetUserByIdQuery,
    useGetUserDashboardDataQuery,
    useGetUserRoleInSessionQuery,
    useCreateUserMutation,
} = userApi;
