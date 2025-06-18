import baseApi, { ApiTagType } from "../baseApi";
import type { addMembersPayload } from "./training.types";

export const trainingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrainingList: builder.query({
      query: () => ({ url: "/trainings", method: "GET" }),
      providesTags: [ApiTagType.TRAINING],
    }),

    getTrainingById: builder.query({
      query: (payload) => ({
        url: `/trainings/${payload.id}`,
        method: "GET",
      }),
      providesTags: [ApiTagType.TRAINING],
    }),

    createTraining: builder.mutation({
      query: (payload) => ({
        url: "/trainings",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [ApiTagType.TRAINING],
    }),

    updateTraining: builder.mutation({
      query: (payload) => ({
        url: `/trainings/${payload.id}`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: [ApiTagType.TRAINING],
    }),

    deleteTraining: builder.mutation({
      query: (payload) => ({
        url: `/trainings/${payload.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [ApiTagType.TRAINING],
    }),
    addMembers: builder.mutation<void, addMembersPayload>({
      query: (payload) => {
        return {
          url: `/trainings/${payload.trainingId}/members`,
          method: "POST",
          body: { members: payload.members },
        };
      },
    }),
  }),
});

export const {
  useGetTrainingListQuery,
  useCreateTrainingMutation,
  useAddMembersMutation,
  useGetTrainingByIdQuery,
  useUpdateTrainingMutation,
  useDeleteTrainingMutation,
} = trainingApi;
