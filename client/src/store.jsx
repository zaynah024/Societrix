import { configureStore } from '@reduxjs/toolkit';
import societyReducer from './features/society/societySlice.mjs';


const store = configureStore({
  reducer: {
    society: societyReducer,
  },
});

export default store;
