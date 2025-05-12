import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Authentication/authenticatorSlice.mjs';
import societyReducer from '../features/society/societySlice.mjs';
import eventsReducer from '../features/events/eventSlice.mjs';
import chatUsersReducer from '../features/chat/chatUsersSlice.mjs';
import chatMessagesReducer from '../features/chat/chatMessagesSlice.mjs';
import reportReducer from '../features/reports/reportSlice.mjs';
import themeReducer from '../features/theme/themeSlice.mjs';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    society: societyReducer,
    events: eventsReducer,
    chatUsers: chatUsersReducer,
    chatMessages: chatMessagesReducer,
    reports: reportReducer,
    theme: themeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;