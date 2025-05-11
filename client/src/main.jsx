import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store.jsx';
import App from './App.jsx';

// Initialize chat data with default values if needed
import { fetchChats } from './features/chat/chatUsersSlice.mjs';

// Pre-fetch chat data on application start
store.dispatch(fetchChats());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
