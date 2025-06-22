import { configureStore } from '@reduxjs/toolkit';
import GetanimeDataSlice from './apifetch/GetanimeDataSlice';
import uiReducer from './apifetch/uiSlice';

export const store = configureStore({
  reducer: {
    AnimeData: GetanimeDataSlice,
    ui: uiReducer,
  },
});