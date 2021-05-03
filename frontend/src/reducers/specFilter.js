import { createSlice } from '@reduxjs/toolkit';

const specFilterSlice = createSlice({
    name: 'spec-filter',
    initialState: {
        passing: true,
        failing: true,
    },
    reducers: {
        setPassing(state, action) {
            state.passing = action.payload;
        },
        setFailing(state, action) {
            state.failing = action.payload;
        },
    },
});

export const { setPassing, setFailing } = specFilterSlice.actions;

export default specFilterSlice.reducer;
