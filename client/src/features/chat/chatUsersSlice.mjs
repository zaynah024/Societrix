import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Fetch all chats for the current user
export const fetchChats = createAsyncThunk(
  'chatUsers/fetchChats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const userType = auth.userType || 'society';
      
      // Fix the endpoint to match your server routes
      const response = await axios.get(`${API_URL}/chat/users?userType=${userType}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chats:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to fetch chats');
    }
  }
);

// Create a new chat
export const createChat = createAsyncThunk(
  'chatUsers/createChat',
  async (chatData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/chat/users`, chatData);
      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to create chat');
    }
  }
);

// Set active chat
export const setActiveChat = createAsyncThunk(
  'chatUsers/setActiveChat',
  async (chatId, { dispatch }) => {
    // When changing active chat, mark messages as read
    try {
      dispatch({ type: 'chatUsers/resetUnreadCount', payload: { chatId } });
    } catch (error) {
      console.error('Error setting active chat:', error);
    }
    return chatId;
  }
);

const initialState = {
  chats: [],
  activeChat: 'announcements',
  unreadCounts: {},
  status: 'idle',
  error: null
};

const chatUsersSlice = createSlice({
  name: 'chatUsers',
  initialState,
  reducers: {
    // Add incrementUnreadCount reducer to handle unread messages
    incrementUnreadCount: (state, action) => {
      const { chatId } = action.payload;
      if (!state.unreadCounts[chatId]) {
        state.unreadCounts[chatId] = 0;
      }
      // Only increment if it's not the active chat
      if (state.activeChat !== chatId) {
        state.unreadCounts[chatId]++;
      }
    },
    // Add resetUnreadCount reducer to clear unread counts
    resetUnreadCount: (state, action) => {
      const { chatId } = action.payload;
      state.unreadCounts[chatId] = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch chats
      .addCase(fetchChats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Create chat
      .addCase(createChat.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chats.push(action.payload);
      })
      .addCase(createChat.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Set active chat
      .addCase(setActiveChat.fulfilled, (state, action) => {
        state.activeChat = action.payload;
        // Reset unread count for this chat
        state.unreadCounts[action.payload] = 0;
      });
  }
});

export const { incrementUnreadCount, resetUnreadCount } = chatUsersSlice.actions;
export default chatUsersSlice.reducer;
