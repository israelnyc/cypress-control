import { createSlice } from '@reduxjs/toolkit';

const cypressStatusSlice = createSlice({
    name: 'cypress-status',
    initialState: {
        cypressPID: null,
        failed: 0,
        passed: 0,
        isRunning: false,
        isStarting: false,
        currentSpec: {},
        currentSpecFailures: {},
        currentTest: {},
        completedSpecs: [],
        totalSpecs: 0,
        totalSpecsRan: 0,
    },
    reducers: {
        update(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { update } = cypressStatusSlice.actions;
export default cypressStatusSlice.reducer;
