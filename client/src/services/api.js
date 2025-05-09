import axios from 'axios';

// This would be set from environment variables in a real app
// For development we can use localhost, for production it would be your server URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (expired token)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
      // In a real app, you might want to redirect to login page here
      // or refresh the token if you have a refresh token mechanism
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      // Still remove token even if logout API fails
      localStorage.removeItem('token');
      throw error;
    }
  },
  
  verifySession: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  forgotPassword: async (email) => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  },
  
  changePassword: async (data) => {
    try {
      await api.post('/auth/change-password', data);
    } catch (error) {
      throw error;
    }
  }
};

// User services
export const userService = {
  getPreferences: async () => {
    try {
      const response = await api.get('/users/preferences');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/users/preferences', preferences);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Society services
export const societyService = {
  create: async (societyData) => {
    try {
      const response = await api.post('/societies', societyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getAll: async () => {
    try {
      const response = await api.get('/societies');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/societies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  update: async (id, data) => {
    try {
      const response = await api.put(`/societies/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      await api.delete(`/societies/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  getMembers: async (id) => {
    try {
      const response = await api.get(`/societies/${id}/members`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getTopSocieties: async () => {
    try {
      const response = await api.get('/societies/top');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Event services
export const eventService = {
  getRequests: async () => {
    try {
      const response = await api.get('/events/requests');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  approveRequest: async (id) => {
    try {
      const response = await api.put(`/events/requests/${id}/approve`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  rejectRequest: async (id, feedback) => {
    try {
      const response = await api.put(`/events/requests/${id}/reject`, { feedback });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getCalendar: async (month, year) => {
    try {
      const response = await api.get('/events/calendar', {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  cancelEvent: async (id, reason) => {
    try {
      const response = await api.put(`/events/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Report services
export const reportService = {
  getAll: async (filter) => {
    try {
      const response = await api.get('/reports', {
        params: { filter }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  rateReport: async (id, rating) => {
    try {
      const response = await api.put(`/reports/${id}/rate`, { rating });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Chat services
export const chatService = {
  getChats: async () => {
    try {
      const response = await api.get('/chats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getMessages: async (chatId) => {
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  sendMessage: async (chatId, content) => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, { content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  markAsRead: async (chatId) => {
    try {
      await api.put(`/chats/${chatId}/read`);
    } catch (error) {
      throw error;
    }
  }
};

// Budget services
export const budgetService = {
  getSummary: async () => {
    try {
      const response = await api.get('/budget');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateBudget: async (eventId, amount) => {
    try {
      const response = await api.put(`/budget/events/${eventId}`, { amount });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Export default for convenience
export default {
  authService,
  userService,
  societyService,
  eventService,
  reportService,
  chatService,
  budgetService
};
