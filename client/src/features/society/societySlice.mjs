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
export const createSociety = createAsyncThunk(
  'society/createSociety', 
  async (societyData, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(`${API_URL}/add-society`, societyData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // After successful society creation, create a chat for this society
      const newSociety = res.data;
      
      // Create chat for the new society
      try {
        const chatData = {
          chatId: `society-${newSociety._id}`,
          chatName: newSociety.name,
          chatType: 'society',
          avatar: getAvatarForSociety(newSociety.name),
          members: [
            { userId: 'admin', role: 'admin' },
            { userId: `society-${newSociety._id}`, role: 'society' }
          ]
        };
        
        await axios.post(`http://localhost:5000/api/chat/users`, chatData);
        console.log('Chat created for new society:', newSociety.name);
        
        // Create welcome message in the new chat
        const welcomeMessage = {
          sender: 'admin',
          content: `Welcome ${newSociety.name}! This is your private chat with the admin.`,
          isAdmin: true,
          chatId: `society-${newSociety._id}`
        };
        
        await axios.post(`http://localhost:5000/api/chat/messages`, welcomeMessage);
        
        // Add announcement about new society
        const announcementMessage = {
          sender: 'admin',
          content: `Welcome to our newest society: ${newSociety.name}!`,
          isAdmin: true,
          chatId: 'announcements'
        };
        
        await axios.post(`http://localhost:5000/api/chat/messages`, announcementMessage);
      } catch (error) {
        console.error('Error creating chat for new society:', error);
        // We don't reject the promise here as the society was still created successfully
      }
      
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create society');
    }
  }
);

// Helper function to generate an avatar emoji for the society
function getAvatarForSociety(societyName) {
  const societyType = societyName.toLowerCase();
  
  if (societyType.includes('computer') || societyType.includes('tech') || societyType.includes('programming')) {
    return '💻';
  } else if (societyType.includes('drama') || societyType.includes('theatre') || societyType.includes('acting')) {
    return '🎭';
  } else if (societyType.includes('music') || societyType.includes('band') || societyType.includes('choir')) {
    return '🎵';
  } else if (societyType.includes('science') || societyType.includes('physics')) {
    return '⚛️';
  } else if (societyType.includes('art') || societyType.includes('paint')) {
    return '🎨';
  } else if (societyType.includes('sport') || societyType.includes('athletic')) {
    return '🏆';
  } else if (societyType.includes('debate') || societyType.includes('speech')) {
    return '🎙️';
  } else if (societyType.includes('book') || societyType.includes('literature') || societyType.includes('reading')) {
    return '📚';
  } else if (societyType.includes('math') || societyType.includes('mathematics')) {
    return '🔢';
  } else if (societyType.includes('game') || societyType.includes('gaming')) {
    return '🎮';
  }
  
  // Default emoji
  return '🏛️';
}

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

