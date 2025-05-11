import { configureStore } from '@reduxjs/toolkit';
import societyReducer from './features/society/societySlice.mjs';
import eventReducer from './features/events/eventSlice.mjs';
import authenticatorReducer from './features/Authentication/authenticatorSlice.mjs';
import userReducer from './features/users/userSlice.mjs';


const store = configureStore({
  reducer: {
    society: societyReducer,
    auth: authenticatorReducer,
    events: eventReducer,
    user: userReducer
    
  },
});

export default store;
