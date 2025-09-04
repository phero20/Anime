import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
      const newMessage = {
        id: Date.now(),
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString()
      };
      state.messages.push(newMessage);
      state.chatHistory.push(newMessage);
    },

    // Add AI response to chat
    addAiMessage: (state, action) => {
      const newMessage = {
        id: Date.now(),
        role: 'assistant',
        content: action.payload,
        timestamp: new Date().toISOString()
      };
      state.messages.push(newMessage);
      state.chatHistory.push(newMessage);
    },

    // Clear all messages
    clearMessages: (state) => {
      state.messages = [];
      state.chatHistory = [];
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set typing indicator
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },

    // Load chat history
    loadChatHistory: (state, action) => {
      state.messages = action.payload;
      state.chatHistory = action.payload;
    },

    // Update last message (for streaming responses)
    updateLastMessage: (state, action) => {
      if (state.messages.length > 0) {
        const lastMessage = state.messages[state.messages.length - 1];
        if (lastMessage.role === 'assistant') {
          lastMessage.content = action.payload;
        }
      }
    },

    // Mark message as finished typing
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
      // Send chat message cases
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isTyping = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.isTyping = false;
        
        // Ensure we have a valid reply
        const reply = action.payload?.reply || action.payload?.message || 'Sorry, I could not generate a response.';
        
        // Add AI response to messages
        const aiMessage = {
          id: Date.now(),
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
          isTyping: true // Mark as typing to trigger typewriter effect
        };
        state.messages.push(aiMessage);
        state.chatHistory.push(aiMessage);
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.isTyping = false;
        state.error = action.error.message;
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
