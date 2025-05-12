import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Fetch all events
export const getAllEvents = createAsyncThunk(
  'events/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

// Fetch events (alternative endpoint)
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

// Fetch all societies
export const getAllSocieties = createAsyncThunk(
  'events/getSocieties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/societies`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch societies');
    }
  }
);

// Fetch all venues
export const getAllVenues = createAsyncThunk(
  'events/getVenues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/venues`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch venues');
    }
  }
);

// Fetch event by ID
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

// Create a new event
export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      console.log('Sending event data to server:', JSON.stringify(eventData));

      // Validate data before sending
      if (!eventData.eventName || !eventData.description || 
          !eventData.date || !eventData.time || 
          !eventData.venue || !eventData.societyId) {
        console.error('Missing required fields in client validation:', { 
          eventName: !eventData.eventName,
          description: !eventData.description, 
          date: !eventData.date,
          time: !eventData.time,
          venue: !eventData.venue,
          societyId: !eventData.societyId
        });
        return rejectWithValue('Missing required fields in form data');
      }

      // Ensure data types are correct and only include valid fields
      const formattedData = {
        eventName: eventData.eventName,
        description: eventData.description,
        date: new Date(eventData.date).toISOString(),
        time: eventData.time,
        venue: eventData.venue,
        budget: Number(eventData.budget),
        sponsorship: Number(eventData.sponsorship) || 0,
        societyId: eventData.societyId,
        status: eventData.status || 'pending'
      };

      const token = localStorage.getItem('auth_token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        }
      };

      const response = await axios.post(`${API_URL}/events`, formattedData, config);
      console.log('Response from server:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create event error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to create event'
      );
    }
  }
);

// Update event status
export const updateEventStatus = createAsyncThunk(
  'events/updateEventStatus',
  async ({ eventId, statusData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        }
      };

      const response = await axios.put(`${API_URL}/events/${eventId}/status`, statusData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event status');
    }
  }
);

const initialState = {
  events: [], // Ensure this is initialized as an empty array
  societies: [],
  venues: [],
  currentEvent: null,
  status: 'idle',
  error: null,
  success: false,
};

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
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Get all events
      .addCase(getAllEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
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

      // Fetch societies
      .addCase(getAllSocieties.fulfilled, (state, action) => {
        state.societies = action.payload;
      })

      // Fetch venues
      .addCase(getAllVenues.fulfilled, (state, action) => {
        state.venues = action.payload;
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
        const { id, ...statusData } = action.payload;

        // Find the event and update its status
        const eventIndex = state.events.findIndex(event => event._id === id);
        if (eventIndex !== -1) {
          state.events[eventIndex] = {
            ...state.events[eventIndex],
            ...statusData
          };
        }
        if (state.currentEvent && state.currentEvent._id === id) {
          state.currentEvent = {
            ...state.currentEvent,
            ...statusData
          };
        }
      })
      .addCase(updateEventStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetStatus, clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;