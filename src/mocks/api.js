// Mock API responses for development
import { mockUsers, mockBookings, mockCourts } from './data.js';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // User endpoints
  auth: {
    login: async (credentials) => {
      await delay(1000);
      const user = mockUsers.find(u => u.email === credentials.email);
      if (user && credentials.password === 'password') {
        return { success: true, user, token: 'mock-jwt-token' };
      }
      throw new Error('Invalid credentials');
    },
    
    register: async (userData) => {
      await delay(1000);
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        avatar: '/avatars/default.jpg',
      };
      return { success: true, user: newUser };
    },
  },

  // Booking endpoints
  bookings: {
    getAll: async () => {
      await delay(500);
      return mockBookings;
    },
    
    create: async (bookingData) => {
      await delay(1000);
      const newBooking = {
        id: Date.now().toString(),
        ...bookingData,
        status: 'pending',
      };
      return newBooking;
    },
  },

  // Court endpoints
  courts: {
    getAll: async () => {
      await delay(500);
      return mockCourts;
    },
    
    getById: async (id) => {
      await delay(300);
      const court = mockCourts.find(c => c.id === id);
      if (!court) throw new Error('Court not found');
      return court;
    },
  },
};
