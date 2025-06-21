import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LayoutProps } from "../../components/layout/Layout";

const initialState: LayoutProps = {};

const layoutSlice = createSlice({
    name: "layout",
    initialState,
    reducers: {
        setLayoutProps: (
            state: LayoutProps,
            action: PayloadAction<LayoutProps>
        ) => {
            state.title = action.payload.title;
        },
    },
});

export const getLayoutProps = (state: any) => state.layout;
export const { setLayoutProps } = layoutSlice.actions;
export default layoutSlice.reducer;
