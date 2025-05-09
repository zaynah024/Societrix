import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Added fallback

const initialState = {
  societies: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  success: false, // Tracks success state for creating a society
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
        state.societies.push(action.payload);
        state.success = true;
      })
      .addCase(createSociety.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetStatus } = societySlice.actions;
export default societySlice.reducer;

