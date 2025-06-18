import baseApi from "../baseApi";
import type { MaterialPayload } from "./uploadMaterial.types";

export const materialApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
     
        createMaterial: builder.mutation<{},MaterialPayload>({
            query: (payload) => ({
                url: "/material",
                method: "POST",
                body: payload,
            }),
        }),
    }),
});

export const {
   useCreateMaterialMutation
} = materialApi;