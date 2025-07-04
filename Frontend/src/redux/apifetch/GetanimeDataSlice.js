import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Async thunk to fetch all anime data
export const fetchAnimeData = createAsyncThunk(
  'AnimeData/fetchAnimeData',
  async () => {
    const response = await axios.get(`${backendUrl}/api/anime/getdata`);
    return response.data;
  }
);

// Async thunk to fetch paginated category anime data
export const fetchCategoryAnimeData = createAsyncThunk(
  'AnimeData/fetchCategoryAnimeData',
  async ({ name, page }) => {
    const response = await axios.get(`${backendUrl}/api/anime/category/${name}/${page}`);
    return response.data;
  }
);

export const fetchGenreAnimeData = createAsyncThunk(
  'AnimeData/fetchGenreAnimeData',
  async ({ name, page }) => {
    const genre = name.split(' ').join('-');
    const response = await axios.get(`${backendUrl}/api/anime/genre/${genre}/${page}`);
    return response.data;
  }
);

export const fetchCardAnimeData = createAsyncThunk(
  'CardAnimeData/fetchCardAnimeData',
  async (id) => {
    const response = await axios.get(`${backendUrl}/api/anime/animedata/${id}`);
    return response.data;
  }
);

export const fetchProducerAnimeData = createAsyncThunk(
  'AnimeData/fetchProducerAnimeData',
  async ({ name, page }) => {
    const response = await axios.get(`${backendUrl}/api/anime/producer/${name}/${page}`);
    return response.data;
  }
);


export const fetchEpisodesData = createAsyncThunk(
  'AnimeData/fetchEpisodesData',
  async (id) => {
    const response = await axios.get(`${backendUrl}/api/anime/episodes/${id}`);
    return response.data;
  }
);

export const fetchEpisodesServerData = createAsyncThunk(
  'AnimeData/fetchEpisodesServerData',
  async (episodeId) => {
    const response = await axios.post(`${backendUrl}/api/anime/episodes-server`, {
      episodeId: episodeId
    });
    console.log('Episode server response:', response.data);
    return response.data;
  }
);

const initialState = {
  AnimeData: null,
  CategoryAnimeData: null,
  GenreAnimeData : null,
  ProducerAnimeData : null,
  EpisodesData : null,
  EpisodesServerData : null,
  CardAnimeData:null,
  loading: false,
  error: null,
};

const GetanimeDataSlice = createSlice({
  name: 'AnimeData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Handle fetchAnimeData
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

// episdoes

      .addCase(fetchEpisodesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpisodesData.fulfilled, (state, action) => {
        state.loading = false;
        state.EpisodesData = action.payload;
      })
      .addCase(fetchEpisodesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

//episodes server data
       
      .addCase(fetchEpisodesServerData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpisodesServerData.fulfilled, (state, action) => {
        state.loading = false;
        state.EpisodesServerData = action.payload;
      })
      .addCase(fetchEpisodesServerData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Handle fetchCategoryAnimeData
      .addCase(fetchCategoryAnimeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryAnimeData.fulfilled, (state, action) => {
        state.loading = false;
        const { page } = action.meta.arg;
        const newAnimes = action.payload.data?.data?.animes || [];

        if (page === 1) {
          state.CategoryAnimeData = action.payload;
        } else {
          const existingAnimes = state.CategoryAnimeData?.data?.data?.animes || [];
          state.CategoryAnimeData = {
            ...action.payload,
            data: {
              ...action.payload.data,
              data: {
                ...action.payload.data.data,
                animes: [...existingAnimes, ...newAnimes],
              },
            },
          };
        }
      })
      .addCase(fetchCategoryAnimeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })




      .addCase(fetchCardAnimeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCardAnimeData.fulfilled, (state, action) => {
        state.loading = false;
        state.CardAnimeData = action.payload;
      })
      .addCase(fetchCardAnimeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })




      .addCase(fetchGenreAnimeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenreAnimeData.fulfilled, (state, action) => {
        state.loading = false;
        const { page } = action.meta.arg;
        const newAnimes = action.payload.data?.data?.animes || [];

        if (page === 1) {
          state.GenreAnimeData = action.payload;
        } else {
          const existingAnimes = state.GenreAnimeData?.data?.data?.animes || [];
          state.GenreAnimeData = {
            ...action.payload,
            data: {
              ...action.payload.data,
              data: {
                ...action.payload.data.data,
                animes: [...existingAnimes, ...newAnimes],
              },
            },
          };
        }
      })
      .addCase(fetchGenreAnimeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Handle fetchProducerAnimeData
      .addCase(fetchProducerAnimeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducerAnimeData.fulfilled, (state, action) => {
        state.loading = false;
        const { page } = action.meta.arg;
        const newAnimes = action.payload.data?.data?.animes || [];

        if (page === 1) {
          state.ProducerAnimeData = action.payload;
        } else {
          const existingAnimes = state.ProducerAnimeData?.data?.data?.animes || [];
          state.ProducerAnimeData = {
            ...action.payload,
            data: {
              ...action.payload.data,
              data: {
                ...action.payload.data.data,
                animes: [...existingAnimes, ...newAnimes],
              },
            },
          };
        }
      })
      .addCase(fetchProducerAnimeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default GetanimeDataSlice.reducer;
