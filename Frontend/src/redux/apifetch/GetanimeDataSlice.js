import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:6789';

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
    return response.data;
  }
);

export const fetchEpisodesStreamLink = createAsyncThunk(
  'AnimeData/fetchEpisodesStreamLink',
  async ({ episodeId, server, category }) => {
  
    const response = await axios.post(`${backendUrl}/api/anime/episodes-stream-links`, {
      episodeId: episodeId,
      server: server,
      category: category,
    });
    return response.data;
  }
);



export const fetchSearchSuggestions = createAsyncThunk(
  'AnimeData/fetchSearchSuggestions',
  async ({ q }) => {
    const response = await axios.get(`${backendUrl}/api/anime/search-suggestions/q=${q}`);
    return response.data;
  }
);


export const fetchSearchResults = createAsyncThunk(
  'AnimeData/fetchSearchResults',
  async ({ q }) => {
    const response = await axios.get(`${backendUrl}/api/anime/search-result/q=${q}`);
    return response.data;
  }
);


// Helper functions for localStorage
const saveEpisodeImageToStorage = (image) => {
  try {
    localStorage.setItem('episodeImage', image);
  } catch (error) {
    // console.error('Failed to save episode image to localStorage:', error);
  }
};

const getEpisodeImageFromStorage = () => {
  try {
    return localStorage.getItem('episodeImage');
  } catch (error) {
    // console.error('Failed to get episode image from localStorage:', error);
    return null;
  }
};

const clearEpisodeImageFromStorage = () => {
  try {
    localStorage.removeItem('episodeImage');
  } catch (error) {
    // console.error('Failed to clear episode image from localStorage:', error);
  }
};

const initialState = {
  AnimeData: null,
  CategoryAnimeData: null,
  GenreAnimeData : null,
  ProducerAnimeData : null,
  SearchResultData:null,
  SearchSuggestionsData:null,
  EpisodesData : null,
  EpisodesServerData : null,
  CardAnimeData:null,
 EpisodeStreamLinks : null,
  EpisodeImage: getEpisodeImageFromStorage(),
  loading: false,
  error: null,
};

const GetanimeDataSlice = createSlice({
  name: 'AnimeData',
  initialState,
  reducers: {
    setEpisodeImage: (state, action) => {
      state.EpisodeImage = action.payload;
      saveEpisodeImageToStorage(action.payload);
    },
    clearEpisodeImage: (state) => {
      state.EpisodeImage = null;
      clearEpisodeImageFromStorage();
    },
    loadEpisodeImageFromStorage: (state) => {
      const storedImage = getEpisodeImageFromStorage();
      if (storedImage) {
        state.EpisodeImage = storedImage;
      }
    },
    clearSearchSuggestions: (state) => {
      state.SearchSuggestionsData = null;
    },
    clearSearchResult: (state)=>{
      state.SearchResultData = null;
    },
    clearCategoryData: (state) => {
      state.CategoryAnimeData = null;
    },
    clearGenreData: (state) => {
      state.GenreAnimeData = null;
    },
  },
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

   //stream links

   .addCase(fetchEpisodesStreamLink.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(fetchEpisodesStreamLink.fulfilled, (state, action) => {
    state.loading = false;
    state.EpisodeStreamLinks = action.payload;
  })
  .addCase(fetchEpisodesStreamLink.rejected, (state, action) => {
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



 //fhanlde card data
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



//hanlde genre
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
      })

      // Handle fetchSearchSuggestions
      .addCase(fetchSearchSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.SearchSuggestionsData = action.payload;
      })
      .addCase(fetchSearchSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.SearchResultData = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

      
  },
});

export const { setEpisodeImage, clearEpisodeImage, loadEpisodeImageFromStorage, clearSearchSuggestions, clearSearchResult, clearCategoryData, clearGenreData } = GetanimeDataSlice.actions;
export default GetanimeDataSlice.reducer;
