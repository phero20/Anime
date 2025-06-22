import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const fetchAnimeData = createAsyncThunk(
  'AnimeData/fetchAnimeData',
  async () => {
    const response = await axios.get(backendUrl+'/api/anime/getdata');
    return response.data;
  }
);


const GetanimeDataSlice = createSlice({
  name: 'AnimeData',
  initialState: {
    AnimeData: null,
    TrendingAnime: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimeData.fulfilled, (state, action) => {
        state.loading = false;
        state.AnimeData = action.payload;
      })
      .addCase(fetchAnimeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export default GetanimeDataSlice.reducer;