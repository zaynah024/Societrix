import { createRoot } from 'react-dom/client'
import './styles/pages/index.css';
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './store';


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
