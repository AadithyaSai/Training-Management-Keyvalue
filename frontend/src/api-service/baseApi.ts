import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ApiTagType = {
    TRAINING: "TRAINING",
    SESSION: "SESSION",
    USER: "USER"
} as const;

const baseApi = createApi({
    reducerPath: "baseApi",
    tagTypes: [ApiTagType.TRAINING, ApiTagType.SESSION, ApiTagType.USER],
    baseQuery: fetchBaseQuery({
        baseUrl:
            "http://localhost:3000",
            // "https://training-management-keyvalue-production.up.railway.app",
            // "https://5877-2402-3a80-1e03-24fd-73d0-e114-de9-c491.ngrok-free.app/",
        prepareHeaders: (headers) => {
            headers.set("ngrok-skip-browser-warning", "true")
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token.trim()}`);
            }
            return headers;
        },
    }),
    refetchOnMountOrArgChange: false,  // false to reduce unnecessary refetches
    refetchOnReconnect: true,
    endpoints: () => ({}),
});

export default baseApi;
