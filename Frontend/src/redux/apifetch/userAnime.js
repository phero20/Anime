import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Add to favorites
export const addToFavorites = createAsyncThunk(
  'userAnime/addToFavorites',
  async ({ token, anime }) => {
    try {
      console.log('Sending request to add to favorites:', { token, anime });
      const response = await axios.post(
        `${backendUrl}/api/userAnime/favorites`,
        { anime },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add to favorites');
      }
      return { ...response.data, anime };
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Failed to add to favorites');
    }
  }
);

// Remove from favorites
export const removeFromFavorites = createAsyncThunk(
  'userAnime/removeFromFavorites',
  async ({ animeId, token }) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/userAnime/favorites/${animeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to remove from favorites';
    }
  }
);

// Add to watchlist
export const addToWatchlist = createAsyncThunk(
  'userAnime/addToWatchlist',
  async ({ token, anime }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/userAnime/watchlist`,
        { anime },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return { ...response.data, anime };
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add to watchlist';
    }
  }
);

// Remove from watchlist
export const removeFromWatchlist = createAsyncThunk(
  'userAnime/removeFromWatchlist',
  async ({ animeId, token }) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/userAnime/watchlist/${animeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to remove from watchlist';
    }
  }
);

// Get user's anime lists
export const getUserAnimeLists = createAsyncThunk(
  'userAnime/getUserAnimeLists',
  async (token) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/userAnime/anime-lists`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch anime lists';
    }
  }
);

export const addToHistory = createAsyncThunk(
  'userAnime/addToHistory',
  async ({ episodeId, server,episodeNumber,animeName, category, EpisodeImage, animeId, token }) => {
    try {
      console.log("episodeId",episodeId)
      const response = await axios.post(
        `${backendUrl}/api/userAnime/history`,
        {
          episodeId,
          server,
          episodeNumber,
          animeName,
          category,
          EpisodeImage,
          animeId,
          date: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response)
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add to history';
    }
  }
);


export const getUserHistory = createAsyncThunk(
  'userAnime/getUserHistory',
  async (token) => {
    try {
      console.log(token)
      const response = await axios.get(
        `${backendUrl}/api/userAnime/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response)
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch history';
    }
  }
);



const userAnimeSlice = createSlice({
  name: 'userAnime',
  initialState: {
    favorites: [],
    watchlist: [],
    history: [],
    loading: false,
    error: null
  },
  reducers: {
    clearUserAnimeLists: (state) => {
      state.favorites = [];
      state.watchlist = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get User Anime Lists
      .addCase(getUserAnimeLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAnimeLists.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload.favorites;
        state.watchlist = action.payload.watchlist;
      })
      .addCase(getUserAnimeLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add to Favorites
      .addCase(addToFavorites.fulfilled, (state, action) => {
        const exists = state.favorites.some(anime => anime.id === action.payload.anime.id);
        if (!exists) {
          state.favorites.push(action.payload.anime);
        }
      })

      // Remove from Favorites
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(
          anime => anime.id !== action.payload.animeId
        );
      })

      // Add to Watchlist
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        const exists = state.watchlist.some(anime => anime.id === action.payload.anime.id);
        if (!exists) {
          state.watchlist.push(action.payload.anime);
        }
      })

      // Remove from Watchlist
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.watchlist = state.watchlist.filter(
          anime => anime.id !== action.payload.animeId
        );
      })


      //add to history
      .addCase(addToHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(addToHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(addToHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.data = null;
      })

      // Get History
      .addCase(getUserHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.history || action.payload;
        state.error = null;
      })
      .addCase(getUserHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearUserAnimeLists } = userAnimeSlice.actions;

// Selectors
export const selectFavorites = (state) => state.userAnime.favorites;
export const selectWatchlist = (state) => state.userAnime.watchlist;
export const selectHistory = (state) => state.userAnime.history;
export const selectUserAnimeLoading = (state) => state.userAnime.loading;
export const selectUserAnimeError = (state) => state.userAnime.error;

export default userAnimeSlice.reducer;
