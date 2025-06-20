import baseApi from "../baseApi";

export const assignmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAssignmentList: builder.query({
            query: () => ({
                url: `/assignments/${1}/submissions`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetAssignmentListQuery } = assignmentApi;
