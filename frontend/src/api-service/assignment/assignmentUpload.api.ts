import baseApi from "../baseApi";
import type { AssignmentPayload } from "./assignmentUpload.types";

export const assignmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
     
        createAssignment: builder.mutation<{},AssignmentPayload>({
            query: (payload) => ({
                url: `/assignments/${1}/submit`,
                method: "POST",
                body: payload,
            }),
        }),
    }),
});

export const {useCreateAssignmentMutation} = assignmentApi;