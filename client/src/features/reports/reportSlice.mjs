import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Fetch completed events for a specific society using email
export const fetchCompletedEvents = createAsyncThunk(
  'reports/fetchCompletedEvents',
  async (email, { rejectWithValue }) => {
    try {
      // Handle case where email is undefined or null
      if (!email) {
        return rejectWithValue('Society email is required');
      }

      // Ensure this matches the backend route
      const response = await axios.get(`${API_URL}/events/completed/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching completed events:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch completed events');
    }
  }
);

// Fetch reports for a specific society using email
export const fetchSocietyReports = createAsyncThunk(
  'reports/fetchSocietyReports',
  async (email, { rejectWithValue }) => {
    try {
      // Handle case where email is undefined or null
      if (!email) {
        return rejectWithValue('Society email is required');
      }

      // Make the actual API call
      const response = await axios.get(`${API_URL}/reports/society/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching society reports:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch society reports');
    }
  }
);

// Submit a new event report
export const submitEventReport = createAsyncThunk(
  'reports/submitEventReport',
  async (reportData, { rejectWithValue }) => {
    try {
      // Exclude `submissionDate` and `rating` from the payload
      const { submissionDate, rating, ...payload } = reportData;

      const response = await axios.post(`${API_URL}/reports`, payload);
      return response.data;
    } catch (error) {
      console.error('Error submitting report:', error);
      return rejectWithValue(error.response?.data || 'Failed to submit report');
    }
  }
);

// Add the missing updateReportRating function
export const updateReportRating = createAsyncThunk(
  'reports/updateReportRating',
  async ({ id, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/reports/${id}/rating`, { rating });
      return response.data;
    } catch (error) {
      console.error('Error updating report rating:', error);
      return rejectWithValue(error.response?.data || 'Failed to update report rating');
    }
  }
);

// Mock data for development - kept for reference but not used by default
const mockEvents = [
  {
    _id: 'evt001',
    eventName: 'Annual Tech Symposium',
    date: new Date(2023, 6, 15),
    venue: 'Main Auditorium',
    description: 'Annual technology symposium featuring guest speakers and workshops',
    estimatedAttendees: 120,
    status: 'completed',
    societyId: 'soc001'
  },
  {
    _id: 'evt002',
    eventName: 'Art Exhibition',
    date: new Date(2023, 7, 22),
    venue: 'Gallery Hall',
    description: 'Exhibition of student artwork from the semester',
    estimatedAttendees: 85,
    status: 'completed',
    societyId: 'soc001'
  },
  {
    _id: 'evt003',
    eventName: 'Coding Competition',
    date: new Date(2023, 8, 5),
    venue: 'Computer Lab',
    description: 'Annual coding competition with prizes for winners',
    estimatedAttendees: 50,
    status: 'completed',
    societyId: 'soc001'
  }
];

const mockReports = [
  {
    _id: 'rep001',
    eventId: 'evt001',
    eventName: 'Annual Tech Symposium',
    eventDate: new Date(2023, 6, 15),
    submissionDate: new Date(2023, 6, 20),
    summary: 'The tech symposium was a great success with high attendance',
    attendees: 115,
    achievements: 'Successfully connected students with industry professionals',
    challenges: 'Audio equipment had some issues during the main presentation',
    feedback: 'Participants gave positive feedback about the workshops',
    rating: 4,
    photos: [
      { data: 'https://placehold.co/600x400/png', name: 'symposium1.jpg' },
      { data: 'https://placehold.co/600x400/png', name: 'symposium2.jpg' }
    ]
  }
];

const initialState = {
  events: [],
  reports: [],
  loading: false,
  error: null
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    // Add a reducer to handle direct state updates (for optimistic updates)
    setReports: (state, action) => {
      state.reports = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch completed events
      .addCase(fetchCompletedEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchCompletedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch society reports
      .addCase(fetchSocietyReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocietyReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchSocietyReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Submit report
      .addCase(submitEventReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitEventReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = [...state.reports, action.payload];
      })
      .addCase(submitEventReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add cases for updateReportRating
      .addCase(updateReportRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReportRating.fulfilled, (state, action) => {
        state.loading = false;
        // Update the report in the reports array
        const index = state.reports.findIndex(report => report._id === action.payload._id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      .addCase(updateReportRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setReports } = reportSlice.actions;
export default reportSlice.reducer;
