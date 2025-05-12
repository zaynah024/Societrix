import { configureStore } from '@reduxjs/toolkit';
import societyReducer from './features/society/societySlice.mjs';
import authenticatorReducer from './features/Authentication/authenticatorSlice.mjs';
import eventReducer from './features/events/eventSlice.mjs';
import reportReducer from './features/reports/reportSlice.mjs';
import chatMessagesReducer from './features/chat/chatMessagesSlice.mjs';
import chatUsersReducer from './features/chat/chatUsersSlice.mjs';
import userReducer from './features/users/userSlice.mjs';

const store = configureStore({
  reducer: {
    society: societyReducer,
    auth: authenticatorReducer,
    events: eventReducer,
    reports: reportReducer,
    chatMessages: chatMessagesReducer,
    chatUsers: chatUsersReducer,
    user: userReducer
  },
});

export default store;
