import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // If we get a 401 Unauthorized, clear the token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user')
};

// Profile API endpoints
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  getBookings: () => api.get('/profile/bookings'),
  getOrders: () => api.get('/profile/orders'),
  getReviews: () => api.get('/profile/reviews'),
  deleteProfileImage: () => api.delete('/profile/image')
};

// Menu API endpoints
export const menuAPI = {
  getCategories: () => api.get('/categories'),
  getItems: (categoryId = null) => api.get(`/menu-items${categoryId ? `?category=${categoryId}` : ''}`),
  getItem: (id) => api.get(`/menu-items/${id}`),
  addReview: (itemId, data) => api.post(`/reviews`, data)
};

// Booking API endpoints
export const bookingAPI = {
  getTables: () => api.get('/tables'),
  checkAvailability: (data) => api.post('/tables/check-availability', data),
  createBooking: (data) => api.post('/bookings', data),
  getBookings: () => api.get('/bookings'),
  getBooking: (id) => api.get(`/bookings/${id}`),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  cancelBooking: (id) => api.delete(`/bookings/${id}`)
};

// Admin API endpoints
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getBookings: () => api.get('/admin/bookings'),
  updateBookingStatus: (id, status) => api.put(`/admin/bookings/${id}/status`, { status }),
  getMenuItems: () => api.get('/admin/menu-items'),
  createMenuItem: (data) => api.post('/admin/menu-items', data),
  deleteMenuItem: (id) => api.delete(`/admin/menu-items/${id}`)
};

export default api; 
