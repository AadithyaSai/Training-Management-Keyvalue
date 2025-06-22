import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../api-service/users/user.type";
import {
    PoolUserRoleType,
    type PoolUserRole,
} from "../../pages/createUserPool/CreateUserPool";

export interface TrainingDetails {
    id?: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

export interface TrainingUserList {
    trainers: Array<User>;
    moderators: Array<User>;
    candidates: Array<User>;
}

export interface TrainingSliceState extends TrainingDetails {
    members: TrainingUserList;
}

const initialState: TrainingSliceState = {
    id: 0,
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
            state.id = action.payload.id;
            state.title = action.payload.title;
            state.description = action.payload.description;
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        },

        addUsersToPool: (
            state: TrainingSliceState,
            action: PayloadAction<TrainingUserList>
        ) => {
            state.members = {
                trainers: [...action.payload.trainers],
                moderators: [...action.payload.moderators],
                candidates: [...action.payload.candidates],
            };
        },

        addUsersWithRoleToPool: (
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
            state.id = initialState.id;
            state.title = initialState.title;
            state.description = initialState.description;
            state.startDate = initialState.startDate;
            state.endDate = initialState.endDate;
            state.members = { ...initialState.members };
        },
    },
});

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

export const {
    addTrainingDetails,
    addUsersToPool,
    addUsersWithRoleToPool,
    clearTrainingDetails,
} = trainingSlice.actions;

export default trainingSlice.reducer;
