// API Service for handling HTTP requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
//const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  static async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Example service methods
export const userService = {
  login: (credentials) =>
    ApiService.post('/auth/login', credentials),
  
  register: (userData) =>
    ApiService.post('/auth/register', userData),
  
  getProfile: () => ApiService.get('/user/profile'),
};

export const bookingService = {
  createBooking: (bookingData) =>
    ApiService.post('/bookings', bookingData),
  
  getBookings: () => ApiService.get('/bookings'),
  
  getBookingById: (id) => ApiService.get(`/bookings/${id}`),
  
  getBookingsByUserId: (userId) => ApiService.get(`/bookings/user/${userId}`),
  
  createInvitation: (invitationData) =>
    ApiService.post('/invitations', invitationData),
  
  getInvitations: () => ApiService.get('/invitations'),
  
  getInvitationById: (id) => ApiService.get(`/invitations/${id}`),
  
  getInvitationsByUserId: (userId) => ApiService.get(`/invitations/user/${userId}`),
};
