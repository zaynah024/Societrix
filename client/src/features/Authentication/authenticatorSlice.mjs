import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
  authenticator: false,
  userType: "admin", // Default user type
  user: null
};

const authenticatorSlice = createSlice({
  name: 'authenticator',
  initialState,
  reducers: {
    // Toggle authentication state 
    toggleAuthentication: (state) => {
      state.authenticator = !state.authenticator;
    },
    // Set authentication to specific state
    setAuthentication: (state, action) => {
      state.authenticator = action.payload;
    },
    // Set user type (admin or society)
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    // Set user data
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // Login action (combines setting auth, user and type)
    login: (state, action) => {
      state.authenticator = true;
      state.user = action.payload.user || null;
      state.userType = action.payload.userType || "admin";
    },
    // Logout action
    logout: (state) => {
      state.user = null;
      state.authenticator = false;
      state.userType = "admin"; // Reset to default
    }
  }
});

export const { 
  toggleAuthentication, 
  setAuthentication, 
  setUserType, 
  setUser,
  login,
  logout
} = authenticatorSlice.actions;

export default authenticatorSlice.reducer;
