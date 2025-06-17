import baseApi from "../baseApi";
import type { User } from "../users/users.type";
import type {
  addMembersPayload,
  TrainingDetailsPayload,
} from "./training.types";

export const trainingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrainingList: builder.query({
      query: () => ({ url: "/trainings", method: "GET" }),
    }),
    getTrainingById: builder.query<TrainingDetailsPayload, { id: number }>({
      query: (payload) => ({
        url: `/trainings/1`,
        method: "GET",
      }),
    }),
    createTraining: builder.mutation<{}, TrainingDetailsPayload>({
      query: (payload) => ({
        url: "/trainings",
        method: "POST",
        body: payload,
      }),
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
  useGetTrainingByIdQuery,
  useCreateTrainingMutation,
  useAddMembersMutation,
} = trainingApi;
