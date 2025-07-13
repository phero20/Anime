import { configureStore } from '@reduxjs/toolkit';
import GetanimeDataSlice from './apifetch/GetanimeDataSlice';
import uiReducer from './apifetch/uiSlice';
import authReducer from './apifetch/AuthSlicer';

export const store = configureStore({
  reducer: {
    AnimeData: GetanimeDataSlice,
    ui: uiReducer,
    auth: authReducer,
  },
});