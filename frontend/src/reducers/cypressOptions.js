import { createSlice } from '@reduxjs/toolkit';

const cypressOptionsSlice = createSlice({
    name: 'cypress-options-slice',
    initialState: {
        browser: 'electron',
        headed: false,
        headless: true,
        quiet: false,
        reporters: [],
        spec: [],
    },
    reducers: {
        update(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        updateSpecs(state, action) {
            const { directoryCount, fileCount, selectedItems } = action.payload;

            state.spec = selectedItems;

            state.specSelectionsFiltered =
                !!selectedItems.length &&
                directoryCount + fileCount !== selectedItems.length;
        },
    },
});

export const { update, updateSpecs } = cypressOptionsSlice.actions;
export default cypressOptionsSlice.reducer;
