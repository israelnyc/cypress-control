import { createSlice } from '@reduxjs/toolkit';

const connectionStatusSlice = createSlice({
    name: 'server-status',
    initialState: {
        isServerConnected: false,
        isSocketConnected: false,
    },
    reducers: {
        setServerConnected(state, action) {
            state.isServerConnected = action.payload;
        },
        setSocketConnected(state, action) {
            state.isSocketConnected = action.payload;
        },
    },
});

export const {
    setServerConnected,
    setSocketConnected,
} = connectionStatusSlice.actions;

export default connectionStatusSlice.reducer;
