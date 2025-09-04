import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeSection: 'home',
    showauthmodel: false,
  },
  reducers: {
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    setShowAuthModel: (state, action) => {
      state.showauthmodel = action.payload;
    },
  },
});

export const { setActiveSection, setShowAuthModel } = uiSlice.actions;
export default uiSlice.reducer;