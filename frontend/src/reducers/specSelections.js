import { createSlice } from '@reduxjs/toolkit';

const specSelectionsSlice = createSlice({
    name: 'spec-selections',
    initialState: {
        selectedSpecs: [],
        isFiltered: false,
    },
    reducers: {
        update(state, action) {
            const { directoryCount, fileCount, selectedItems } = action.payload;

            state.selectedSpecs = selectedItems;

            state.isFiltered =
                selectedItems.length &&
                directoryCount + fileCount !== selectedItems.length;
        },
    },
});

export const { update } = specSelectionsSlice.actions;
export default specSelectionsSlice.reducer;
