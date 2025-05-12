import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    
    // Add fallback behaviors for specific endpoints
    if (error.config?.url?.includes('/api/chat')) {
      console.log('Chat API error - returning fallback data');
      // You could return mock data here if needed
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
