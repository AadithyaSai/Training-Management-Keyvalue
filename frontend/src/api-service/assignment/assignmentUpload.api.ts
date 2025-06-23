import baseApi from "../baseApi";
import type {
	AssignmentPayload,
	CreateAssignmentPayload,
} from "./assignmentUpload.types";

export const assignmentApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		submitAssignment: builder.mutation<{}, AssignmentPayload>({
			query: (payload) => ({
				url: `/assignments/${payload.id}/submit`,
				method: "POST",
				body: payload.formData,
			}),
		}),
		createAssignment: builder.mutation<{}, CreateAssignmentPayload>({
			query: (payload) => ({
				url: `/assignments/session/${payload.session_id}`,
				method: "POST",
				body: payload,
			}),
		}),
	}),
});

export const { useSubmitAssignmentMutation, useCreateAssignmentMutation } =
	assignmentApi;
