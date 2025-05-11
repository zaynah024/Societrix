import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API calls - match format with societySlice
const API_URL = 'http://localhost:5000/api';

// Get all events
export const getAllEvents = createAsyncThunk(
  'events/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      return response.data; // Return the data directly
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

// Get event by ID
export const getEventById = createAsyncThunk(
  'events/getById',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/events/${eventId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
  }
);

// Create new event
export const createEvent = createAsyncThunk(
  'events/create',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/events`, eventData, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

// Update event status
export const updateEventStatus = createAsyncThunk(
  'events/updateStatus',
  async ({ eventId, statusData }, { rejectWithValue }) => {
    try {
      // statusData now can include status, rejectReason, and budget
      const response = await axios.put(`${API_URL}/events/${eventId}/status`, statusData, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event status');
    }
  }
);

// Initial state - match structure with societySlice
const initialState = {
  events: [],
  currentEvent: null,
  status: 'idle',
  error: null,
  success: false
};

// Create the slice
const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.success = false;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all events
      .addCase(getAllEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Make sure we handle both array and single object responses
        state.events = action.payload;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error('Failed to load events:', action.payload);
      })
      
      // Get event by ID
      .addCase(getEventById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentEvent = action.payload;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.success = false;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.success = true;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update event status
      .addCase(updateEventStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the event in the events array
        const index = state.events.findIndex(event => event._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        // Also update currentEvent if it's the same event
        if (state.currentEvent && state.currentEvent._id === action.payload._id) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(updateEventStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { resetStatus, clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;
