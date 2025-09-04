import { configureStore } from '@reduxjs/toolkit';
import GetanimeDataSlice from './apifetch/GetanimeDataSlice';
import uiReducer from './apifetch/uiSlice';
import authReducer from './apifetch/AuthSlicer';
import userAnimeReducer from './apifetch/userAnime';
import aiChatReducer from './apifetch/aiChatSlice';

export const store = configureStore({
  reducer: {
    AnimeData: GetanimeDataSlice,
    ui: uiReducer,
    auth: authReducer,
    userAnime: userAnimeReducer,
    aiChat: aiChatReducer,
  },
});