import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getAllEvents = createAsyncThunk(
  "events/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const response = await axios.get("/api/events"); // Adjust the endpoint accordingly
  return response.data;
});

// Fetch societies
export const getAllSocieties = createAsyncThunk(
  "events/getSocieties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/societies`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch societies"
      );
    }
  }
);

// Fetch venues
export const getAllVenues = createAsyncThunk(
  "events/getVenues",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/venues`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch venues"
      );
    }
  }
);

// Create a new event
export const createEvent = createAsyncThunk(
  "events/create",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/events`, eventData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }
);

const initialState = {
  events: [],
  societies: [],
  venues: [],
  currentEvent: null,
  status: "idle",
  error: null,
  success: false,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = action.payload; // Ensure that the event has venue data populated
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.status = "succeeded";
      })
      .addCase(getAllSocieties.fulfilled, (state, action) => {
        state.societies = action.payload;
      })
      .addCase(getAllVenues.fulfilled, (state, action) => {
        state.venues = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
        state.success = true;
      });
  },
});

export const { resetStatus } = eventSlice.actions;
export default eventSlice.reducer;
