import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Fixed incorrect double quotes

const initialState = {
  societies: [], 
  status: 'idle',  
  error: null,
  success: false,
};

// Async thunk to create a new society
export const createSociety = createAsyncThunk('society/createSociety', async (societyData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/add-society`, societyData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create society');
  }
});

// Async thunk to fetch societies
export const fetchSocieties = createAsyncThunk('society/fetchSocieties', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/societies`); // Corrected route
    return res.data.societies; // Return the societies array from the response
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch societies');
  }
});

export const deleteSociety = createAsyncThunk('society/deleteSociety', async (societyId, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`${API_URL}/societies/${societyId}`); // Corrected route
    return societyId; // Return the deleted society ID
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete society');
  }
});

export const editDescription = createAsyncThunk('society/editDescription', async ({ id, description }, { rejectWithValue }) => {
  try {
    const res = await axios.patch(`${API_URL}/societies/${id}`, { description }); // Corrected route
    return res.data.society; // Return the updated society
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to edit description');
  }
});

// Thunk to update society rating
export const updateSocietyRating = createAsyncThunk('society/updateSocietyRating', async (id, { rejectWithValue }) => {
  try {
    console.log('Updating society rating for ID:', id);
    const response = await axios.put(`${API_URL}/societies/${id}/rating`);
    console.log('Society rating updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating society rating:', error);
    return rejectWithValue(error.response?.data || 'Error updating society rating');
  }
});

const societySlice = createSlice({
  name: 'society',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSociety.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.success = false;
      })
      .addCase(createSociety.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.success = true;
        state.societies.push(action.payload); // Add the new society to the state
      })
      .addCase(fetchSocieties.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSocieties.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.societies = action.payload; // Update societies with fetched data
      })
      .addCase(fetchSocieties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteSociety.fulfilled, (state, action) => {
        state.societies = state.societies.filter(society => society._id !== action.payload); // Remove deleted society
      })
      .addCase(deleteSociety.rejected, (state, action) => {
        state.error = action.payload; // Handle delete error
      })
      .addCase(editDescription.fulfilled, (state, action) => {
        const index = state.societies.findIndex(society => society._id === action.payload._id);
        if (index !== -1) {
          state.societies[index] = action.payload; // Update the edited society
        }
      })
      .addCase(editDescription.rejected, (state, action) => {
        state.error = action.payload; // Handle edit error
      })
      .addCase(updateSocietyRating.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateSocietyRating.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedSociety = action.payload;
        state.societies = state.societies.map((society) =>
          society._id === updatedSociety._id ? updatedSociety : society
        );
      })
      .addCase(updateSocietyRating.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = societySlice.actions;
export default societySlice.reducer;

