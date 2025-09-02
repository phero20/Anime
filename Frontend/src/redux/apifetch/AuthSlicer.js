import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { use } from 'react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

// Async thunk for delete user
export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (token) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/auth/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Delete user failed';
    }
  }
);

// Thunk for updating user profile (username)
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ token, username, userId }) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/auth/update`,
        { username, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
          throw error.response?.data?.message || 'Update user failed';
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
      // Sign in cases
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

      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // Don't clear user state on delete failure - let user try again
      })
      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const token = state.user?.token;  // Preserve token
        let updatedUser = action.payload?.data ?? action.payload;
        state.user = { ...updatedUser, token };  // Merge token with updated user
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
