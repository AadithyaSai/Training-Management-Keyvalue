import baseApi from "../baseApi";

export const assignmentApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAssignmentList: builder.query({
			query: (id) => ({
				url: `/assignments/${id}/submissions/all`,
				method: "GET",
			}),
		}),
	}),
});

export const { useGetAssignmentListQuery } = assignmentApi;
