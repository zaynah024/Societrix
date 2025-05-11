import { configureStore } from '@reduxjs/toolkit';
import societyReducer from './features/society/societySlice.mjs';
import authenticatorReducer from './features/Authentication/authenticatorSlice.mjs';
import eventReducer from './features/events/eventSlice.mjs';
import reportReducer from './features/reports/reportSlice.mjs';

const store = configureStore({
  reducer: {
    society: societyReducer,
    auth: authenticatorReducer,
    events: eventReducer,
    reports: reportReducer,
  },
});

export default store;
