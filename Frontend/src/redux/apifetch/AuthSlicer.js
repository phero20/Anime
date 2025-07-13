import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Async thunk for user login
// Async thunk for user sign in
export const signInUser = createAsyncThunk(
  'auth/signInUser',
  async ({ email, password }) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/signin`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Sign in failed';
    }
  }
);

// Async thunk for user signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ username, email, password }) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/signup`, {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Signup failed';
    }
  }
);


// Async thunk for Google authentication
export const googleAuth = createAsyncThunk(
  'auth/googleAuth',
  async (accessToken) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/google`, {
        accessToken
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Google auth failed';
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/logout`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Logout failed';
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  authChecked: false
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set user manually (for immediate state updates)
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },

    // Clear user manually (for immediate state updates)
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Update user profile
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      // In extraReducers:
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Google auth cases
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // Still clear user even if logout request fails
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

// Export actions
export const {
  setUser,
  clearUser,
  clearError,
  setError,
  setLoading,
  updateUserProfile
} = AuthSlice.actions;

// Export selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthChecked = (state) => state.auth.authChecked;

export default AuthSlice.reducer;
