import baseApi, { ApiTagType } from "../baseApi";

export const sessionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSessionList: builder.query({
            query: () => ({ url: "/session", method: "GET" }),
            providesTags: [ApiTagType.SESSION],
        }),

        getSessionById: builder.query({
            query: (payload) => ({
                url: `/session/${payload.id}`,
                method: "GET",
            }),
            providesTags: [ApiTagType.SESSION],
        }),

        createSession: builder.mutation({
            query: (payload) => ({
                url: "/session",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: [ApiTagType.SESSION],
        }),

        updateSession: builder.mutation({
            query: (payload) => ({
                url: `/session/${payload.id}`,
                method: "PATCH",
                body: payload.data,
            }),
            invalidatesTags: [ApiTagType.SESSION],
        }),

        deleteSession: builder.mutation({
            query: (payload) => ({
                url: `/session/${payload.id}`,
                method: "DELETE",
            }),
            invalidatesTags: [ApiTagType.SESSION],
        }),
    }),
});

export const {
    useGetSessionListQuery,
    useGetSessionByIdQuery,
    useCreateSessionMutation,
    useUpdateSessionMutation,
    useDeleteSessionMutation,
} = sessionApi;
