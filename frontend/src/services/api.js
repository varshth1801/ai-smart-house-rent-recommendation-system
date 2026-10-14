import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smart_rent_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      localStorage.removeItem('smart_rent_token');
      localStorage.removeItem('smart_rent_user');
    }
    return Promise.reject(error);
  }
);

// --- Auth Endpoints ---
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// --- User Profile & Favorites ---
export const getMyProfile = () => api.get('/users/me');
export const updateProfile = (data) => api.put('/users/profile', data);
export const getFavorites = () => api.get('/users/favorites');
export const toggleFavorite = (propertyId) => api.post(`/users/favorites/${propertyId}`);

// --- Properties ---
export const getProperties = (params) => api.get('/properties', { params });
export const getPropertyById = (id) => api.get(`/properties/${id}`);
export const getCities = () => api.get('/properties/cities');
export const getLandlordProperties = (landlordId) => api.get(`/properties/landlord/${landlordId}`);
export const createProperty = (data) => api.post('/properties', data);
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data);
export const deleteProperty = (id) => api.delete(`/properties/${id}`);

// --- Reviews ---
export const getPropertyReviews = (propertyId) => api.get(`/properties/${propertyId}/reviews`);
export const addPropertyReview = (propertyId, data) => api.post(`/properties/${propertyId}/reviews`, data);

// --- AI Capabilities ---
export const getAiRecommendations = (data) => api.post('/ai/recommendations', data);
export const predictRentalPrice = (data) => api.post('/ai/predict-price', data);
export const searchNaturalLanguage = (query) => api.post('/ai/natural-search', { query });
export const chatWithAi = (data) => api.post('/ai/chat', data);
export const compareProperties = (propertyIds) => api.post('/ai/compare', { propertyIds });

// --- Bookings & Rental Inquiries ---
export const createBooking = (data) => api.post('/bookings', data);
export const getTenantBookings = () => api.get('/bookings/tenant');
export const getLandlordBookings = () => api.get('/bookings/landlord');
export const updateBookingStatus = (id, data) => api.patch(`/bookings/${id}/status`, data);

// --- Notifications ---
export const getNotifications = () => api.get('/notifications');
export const getUnreadNotificationCount = () => api.get('/notifications/unread-count');
export const markNotificationAsRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsAsRead = () => api.patch('/notifications/read-all');

// --- Admin ---
export const getAdminStats = () => api.get('/admin/stats');

export default api;
