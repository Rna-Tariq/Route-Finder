import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchHistory: []
};

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        addToHistory: (state, action) => {
            state.searchHistory = [action.payload, ...state.searchHistory].slice(0, 10);
        },
        setHistory: (state, action) => {
            state.searchHistory = action.payload;
        }
    }
});

export const { addToHistory, setHistory } = historySlice.actions;

export default historySlice.reducer;