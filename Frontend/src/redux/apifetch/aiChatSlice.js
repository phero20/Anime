import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const fetchChatHistory = createAsyncThunk(
  'aiChat/fetchChatHistory',
  async (token) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/ai/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Filter out empty messages and ensure timestamps are ISO strings for serialization
      const messages = response.data.messages
        .filter(msg => msg && msg.content && msg.content.trim()) // Filter out empty messages
        .map(msg => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp).toISOString() : new Date().toISOString(),
          id: msg._id || msg.id || `msg-${Date.now()}-${Math.random()}`
        }));

      return messages;
    } catch (error) {
      console.error('FetchChatHistory error:', error);
      throw new Error('Failed to fetch chat history');
    }
  }
);

export const clearChatHistory = createAsyncThunk(
  'aiChat/clearChatHistory',
  async (token) => {
    try {
      console.log(token)
      await axios.delete(
        `${backendUrl}/api/ai/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return true;
    } catch (error) {
      console.error('ClearChatHistory error:', error);
      throw new Error('Failed to clear chat history');
    }
  }
);

// Async thunk for sending chat message to AI
export const sendChatMessage = createAsyncThunk(
  'aiChat/sendChatMessage',
  async ({ message, history, token }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/ai/chat`,
        { message, history },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Ensure we return a valid response structure
      if (response.data && typeof response.data === 'object') {
        return response.data;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('SendChatMessage error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
      throw new Error(errorMessage);
    }
  }
);

const initialState = {
  messages: [],
  loading: false,
  error: null,
  isTyping: false,
  chatHistory: []
};

const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    // Add a user message to chat
    addUserMessage: (state, action) => {
      const now = new Date();
      const timestamp = now.toISOString();
      const newMessage = {
        id: `temp-user-${Date.now()}`, // Temporary ID until server responds
        role: 'user',
        content: action.payload,
        timestamp,
        date: timestamp.split('T')[0]
      };
      state.messages.push(newMessage);
    },

    // Add AI response to chat
    addAiMessage: (state, action) => {
      const now = new Date();
      const timestamp = now.toISOString();
      const newMessage = {
        id: `temp-assistant-${Date.now()}`, // Temporary ID until server responds
        role: 'assistant',
        content: action.payload,
        timestamp,
        date: timestamp.split('T')[0],
        isTyping: true
      };
      state.messages.push(newMessage);
    },

    // Clear all messages
    clearMessages: (state) => {
      state.messages = [];
      state.chatHistory = [];
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },

    
    loadChatHistory: (state, action) => {
      state.messages = action.payload;
      state.chatHistory = action.payload;
    },

    
    updateLastMessage: (state, action) => {
      if (state.messages.length > 0) {
        const lastMessage = state.messages[state.messages.length - 1];
        if (lastMessage.role === 'assistant') {
          lastMessage.content = action.payload;
        }
      }
    },


    finishTyping: (state, action) => {
      const messageId = action.payload;
      const message = state.messages.find(msg => msg.id === messageId);
      if (message) {
        message.isTyping = false;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch chat history cases
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        state.chatHistory = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Clear chat history cases
      .addCase(clearChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearChatHistory.fulfilled, (state) => {
        state.loading = false;
        state.messages = [];
        state.chatHistory = [];
      })
      .addCase(clearChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Send chat message cases
      .addCase(sendChatMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.isTyping = true;

        // Add user message immediately when request starts
        const now = new Date();
        const timestamp = now.toISOString();
        const date = timestamp.split('T')[0];

        // Add user message with temporary ID
        state.messages.push({
          id: `temp-user-${Date.now()}`,
          role: 'user',
          content: action.meta.arg.message,
          timestamp,
          date,
          isTyping: false
        });
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.isTyping = false;
        
        // Get messages from response
        const { reply, messages } = action.payload;
        const lastMessage = state.messages[state.messages.length - 1];

        if (messages) {
          // Update the last user message with server-provided ID
          const { assistant: assistantMessage } = messages;
          
          // Add only the AI response with typing effect
          state.messages.push({
            ...assistantMessage,
            timestamp: new Date(assistantMessage.timestamp).toISOString(),
            isTyping: true // Mark as typing to trigger typewriter effect
          });
        } else {
          // Fallback if server didn't return messages (error case)
          const now = new Date();
          const timestamp = now.toISOString();
          const date = timestamp.split('T')[0];
          
          // Add only the AI response
          state.messages.push({
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: reply || 'Sorry, I could not generate a response.',
            timestamp,
            date,
            isTyping: true
          });
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.isTyping = false;
        // Ensure error is always a string
        state.error = typeof action.error === 'string' 
          ? action.error 
          : action.error?.message || 'An error occurred while sending the message';
      });
  }
});

// Export actions
export const {
  addUserMessage,
  addAiMessage,
  clearMessages,
  clearError,
  setTyping,
  loadChatHistory,
  updateLastMessage,
  finishTyping
} = aiChatSlice.actions;

// Export selectors
export const selectMessages = (state) => state.aiChat.messages;
export const selectChatLoading = (state) => state.aiChat.loading;
export const selectChatError = (state) => state.aiChat.error;
export const selectIsTyping = (state) => state.aiChat.isTyping;
export const selectChatHistory = (state) => state.aiChat.chatHistory;

export default aiChatSlice.reducer;
