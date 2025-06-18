import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
    name: "popup",
    initialState: {
        value: 0,
    },
    reducers: {
        displayPopup: (state) => {
            state.value += 1;
        },
        hidePopup: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        },
    },
});

export const { displayPopup, hidePopup, incrementByAmount } = popupSlice.actions;
export default popupSlice.reducer;
