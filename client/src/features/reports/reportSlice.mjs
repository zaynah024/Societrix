import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchSocieties, updateSocietyRating } from '../society/societySlice.mjs';

const API_BASE_URL = 'http://localhost:5000/api/reports'; // Ensure this matches the backend route

// Thunk to fetch all reports
export const fetchReports = createAsyncThunk('reports/fetchReports', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching reports');
  }
});

// Thunk to update report rating  
export const updateReportRating = createAsyncThunk(
  'reports/updateReportRating',
  async ({ id, rating }, { dispatch, getState, rejectWithValue }) => {
    try {
      console.log(`Updating report rating for ID: ${id} with rating: ${rating}`);
      
      // Make the API call to update the report rating
      const response = await axios.put(`${API_BASE_URL}/${id}/rating`, { rating });
      const updatedReport = response.data;
      
      console.log('Report rating update response:', updatedReport);

      // Ensure societyName and eventName are preserved
      const { reports } = getState().reports;
      const existingReport = reports.find((report) => report._id === id);
      if (existingReport) {
        updatedReport.societyName = existingReport.societyName;
        updatedReport.eventName = existingReport.eventName;
      }

      // Get the event to find the society ID
      try {
        const eventResponse = await axios.get(`http://localhost:5000/api/events/${updatedReport.eventId}`);
        const event = eventResponse.data;
        
        if (event && event.societyId) {
          console.log(`Dispatching updateSocietyRating for society ID: ${event.societyId}`);
          // Use updateSocietyRating instead of fetchSocieties
          dispatch(updateSocietyRating(event.societyId));
        } else {
          // Fallback to fetching all societies if we can't get the specific society
          console.log('Event or societyId not found, fetching all societies instead');
          dispatch(fetchSocieties());
        }
      } catch (error) {
        console.error('Error fetching event or updating society rating:', error);
        // Fallback to fetching all societies
        dispatch(fetchSocieties());
      }

      return updatedReport;
    } catch (error) {
      console.error('Error updating report rating:', error);
      return rejectWithValue(error.response?.data || 'Error updating report rating');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    reports: [], // Reports will initially have a rating of 0
    loading: false,
    error: null
  },
  reducers: {
    // Add a reducer to set reports directly (for optimistic updates)
    setReports: (state, action) => {
      state.reports = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update report rating
      .addCase(updateReportRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReportRating.fulfilled, (state, action) => {
        state.loading = false;
        const updatedReport = action.payload;
        state.reports = state.reports.map((report) =>
          report._id === updatedReport._id ? updatedReport : report
        );
      })
      .addCase(updateReportRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setReports } = reportSlice.actions;
export default reportSlice.reducer;
