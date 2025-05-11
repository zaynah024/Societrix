import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Update API URL to match server configuration
const API_URL = 'http://localhost:5000/api/chat/messages';

// Default messages for when API is unavailable
const defaultMessages = {
  'announcements': [
    {
      messageId: 1,
      sender: 'admin',
      content: 'Welcome to Societrix! This is the announcements channel.',
      timestamp: new Date().toISOString(),
      isAdmin: true,
      chatId: 'announcements'
    }
  ],
  'society-1': [
    {
      messageId: 1,
      sender: 'admin',
      content: 'Hello Computer Science Society!',
      timestamp: new Date().toISOString(),
      isAdmin: true,
      chatId: 'society-1'
    }
  ]
};

// Async thunks
export const fetchMessages = createAsyncThunk(
  'chatMessages/fetchMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      console.log(`Fetching messages for chat: ${chatId}`);
      const response = await axios.get(`${API_URL}/${chatId}`);
      console.log('Messages fetched:', response.data);
      // If no messages from API, use default messages
      return response.data.length > 0 ? response.data : (defaultMessages[chatId] || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Return default messages for this chat if available
      return defaultMessages[chatId] || [];
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chatMessages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      console.log('Sending message to API:', messageData);
      const response = await axios.post(API_URL, messageData);
      console.log('API response for message:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error.response || error);
      return rejectWithValue(error.response?.data || 'Failed to send message');
    }
  }
);

const chatMessagesSlice = createSlice({
  name: 'chatMessages',
  initialState: {
    messages: {
      announcements: defaultMessages.announcements || []
    },
    status: 'idle',
    error: null
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = {};
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state, action) => {
        state.status = 'loading';
        // Initialize empty array for this chat if it doesn't exist
        const chatId = action.meta.arg;
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Store messages by chat ID, ensuring it's an array
        const chatId = action.meta.arg;
        const messages = Array.isArray(action.payload) ? action.payload : [];
        state.messages[chatId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        
        // Set default messages for the chat if available
        const chatId = action.meta.arg;
        if (defaultMessages[chatId]) {
          state.messages[chatId] = defaultMessages[chatId];
        }
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.status = 'sending';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add the new message to the appropriate chat
        const { chatId } = action.payload;
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }
        
        // Check if the message already exists to avoid duplicates
        const existingMessageIndex = state.messages[chatId].findIndex(msg => 
          (msg._id && msg._id === action.payload._id) || 
          (msg.messageId && msg.messageId === action.payload.messageId && msg.chatId === action.payload.chatId)
        );
        
        if (existingMessageIndex >= 0) {
          // Update existing message
          state.messages[chatId][existingMessageIndex] = action.payload;
        } else {
          // Add new message
          state.messages[chatId].push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearMessages } = chatMessagesSlice.actions;

export default chatMessagesSlice.reducer;
