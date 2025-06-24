import { createSlice } from "@reduxjs/toolkit";
import type { UserRole } from "../../pages/session/components/sessionTypes";
import type { PayloadAction } from "@reduxjs/toolkit";

export type UserStateData = {
    id: number;
    username: string;
    isAdmin: boolean;
    role?: UserRole | null;
}

type UserState = {
    userData: UserStateData;
};

const initialState: UserState = {
    userData: {
        id: 0,
        username: "",
        isAdmin: false,
        role: null,
    }
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state: UserState, action: PayloadAction<UserStateData>) => {
            state.userData = { ...action.payload };
        },
        setUserRole: (state: UserState, action: PayloadAction<UserRole>) => {
            state.userData.role = action.payload;
        },
        removeUser: (state: UserState) => {
            state.userData = { ...initialState.userData };
        },
    },
});

export const getUserDetails = (state: any) => state.user.userData;
export const { setUser, setUserRole, removeUser } = userSlice.actions;
export default userSlice.reducer;
