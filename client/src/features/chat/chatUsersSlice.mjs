import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Update API URL to match server configuration
const API_URL = 'http://localhost:5000/api/chat/users';

// Default chat data for when API is not available
const defaultChats = [
  {
    chatId: 'announcements',
    chatName: 'Announcements',
    chatType: 'announcements',
    avatar: '📢',
    members: [{ userId: 'admin', role: 'admin' }]
  },
  {
    chatId: 'society-1',
    chatName: 'Computer Science Society',
    chatType: 'society',
    avatar: '💻',
    members: [
      { userId: 'admin', role: 'admin' },
      { userId: 'society-1', role: 'society' }
    ]
  }
];

// Async thunks
export const fetchChats = createAsyncThunk(
  'chatUsers/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching chats...');
      const response = await axios.get(API_URL);
      console.log('Chats fetched:', response.data);
      return response.data.length > 0 ? response.data : defaultChats;
    } catch (error) {
      console.error('Error fetching chats:', error);
      // Return default chats if API fails
      return defaultChats;
    }
  }
);

export const createChat = createAsyncThunk(
  'chatUsers/createChat',
  async (chatData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, chatData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create chat');
    }
  }
);

const chatUsersSlice = createSlice({
  name: 'chatUsers',
  initialState: {
    chats: [],
    activeChat: 'announcements',
    unreadCounts: {},
    status: 'idle',
    error: null
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
      // Clear unread count when a chat becomes active
      if (state.unreadCounts[action.payload]) {
        state.unreadCounts[action.payload] = 0;
      }
    },
    markChatAsRead: (state, action) => {
      state.unreadCounts[action.payload] = 0;
    },
    incrementUnread: (state, action) => {
      const { chatId } = action.payload;
      if (chatId !== state.activeChat) { // Only increment if it's not the active chat
        state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
      }
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
        // Ensure action.payload is an array
        const chats = Array.isArray(action.payload) ? action.payload : [];
        state.chats = chats;
        
        // Ensure we always have the 'announcements' chat
        // First check if state.chats is an array
        if (Array.isArray(state.chats)) {
          // Then check if 'announcements' chat exists
          const hasAnnouncements = state.chats.some(chat => 
            chat && chat.chatId === 'announcements'
          );
          
          if (!hasAnnouncements) {
            state.chats.unshift({
              chatId: 'announcements',
              chatName: 'Announcements',
              chatType: 'announcements',
              avatar: '📢',
              members: [{ userId: 'admin', role: 'admin' }]
            });
          }
        } else {
          // If state.chats is not an array, initialize it with default chats
          state.chats = [
            {
              chatId: 'announcements',
              chatName: 'Announcements',
              chatType: 'announcements',
              avatar: '📢',
              members: [{ userId: 'admin', role: 'admin' }]
            }
          ];
        }
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        // Set fallback chats on error
        state.chats = defaultChats;
      })
      // Create chat
      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.push(action.payload);
      });
  }
});

export const { setActiveChat, markChatAsRead, incrementUnread } = chatUsersSlice.actions;

export default chatUsersSlice.reducer;
