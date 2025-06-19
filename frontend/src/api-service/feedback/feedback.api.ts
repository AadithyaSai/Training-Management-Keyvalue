import baseApi from "../baseApi";

export const feedbackApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFeedbackList: builder.query({
            query: () => ({
                url: "/feedback",
                method: "GET",
            }),
        }),
        getFeedbacksBySessionId: builder.query({
            query: (payload) => ({
                url: `/feedback/session/${payload.sessionId}`,
                method: "GET",
            }),
        }),
        createFeedback: builder.mutation({
            query: (payload) => ({
                url: "/feedback",
                method: "POST",
                body: payload,
            }),
        }),
    }),
});

export const {
    useGetFeedbackListQuery,
    useGetFeedbacksBySessionIdQuery,
    useCreateFeedbackMutation,
} = feedbackApi;
