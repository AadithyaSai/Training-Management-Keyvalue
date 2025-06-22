import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../api-service/users/user.type";
import {
    PoolUserRoleType,
    type PoolUserRole,
} from "../../pages/createUserPool/CreateUserPool";

export interface TrainingDetails {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

export interface TrainingSliceState extends TrainingDetails {
    members: {
        trainers: Array<User>;
        moderators: Array<User>;
        candidates: Array<User>;
    };
}

const initialState: TrainingSliceState = {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    members: {
        trainers: [],
        moderators: [],
        candidates: [],
    },
};

const trainingSlice = createSlice({
    name: "training",
    initialState,
    reducers: {
        addTrainingDetails: (
            state: TrainingSliceState,
            action: PayloadAction<TrainingDetails>
        ) => {
            state.title = action.payload.title;
            state.description = action.payload.description;
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        },

        addUsersToPool: (
            state: TrainingSliceState,
            action: PayloadAction<{ role: PoolUserRole; data: User[] }>
        ) => {
            switch (action.payload.role) {
                case PoolUserRoleType.TRAINER:
                    state.members.trainers = [...action.payload.data];
                    break;
                case PoolUserRoleType.MODERATOR:
                    state.members.moderators = [...action.payload.data];
                    break;
                case PoolUserRoleType.CANDIDATE:
                    state.members.candidates = [...action.payload.data];
                    break;
                default:
                    break;
            }
        },

        clearTrainingDetails: (state: TrainingSliceState) => {
            state.title = initialState.title;
            state.description = initialState.description;
            state.startDate = initialState.startDate;
            state.endDate = initialState.endDate;
            state.members = { ...initialState.members };
        },
    },
});

export const { addTrainingDetails, addUsersToPool, clearTrainingDetails } = trainingSlice.actions;
export const getTrainingDetails = (state: any) => state.training;
export const getPoolUserDetails = (role: PoolUserRole) => {
    return (state: any) => {
        switch (role) {
            case PoolUserRoleType.TRAINER:
                return state.training.members.trainers;
            case PoolUserRoleType.MODERATOR:
                return state.training.members.moderators;
            case PoolUserRoleType.CANDIDATE:
                return state.training.members.candidates;
            default:
                return;
        }
    };
};
export default trainingSlice.reducer;
