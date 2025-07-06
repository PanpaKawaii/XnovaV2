// API Service for handling HTTP requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Example service methods
export const userService = {
  login: (credentials: { email: string; password: string }) =>
    ApiService.post('/auth/login', credentials),
  
  register: (userData: { email: string; password: string; name: string }) =>
    ApiService.post('/auth/register', userData),
  
  getProfile: () => ApiService.get('/user/profile'),
};

export const bookingService = {
  createBooking: (bookingData: any) =>
    ApiService.post('/bookings', bookingData),
  
  getBookings: () => ApiService.get('/bookings'),
  
  getBookingById: (id: string) => ApiService.get(`/bookings/${id}`),
};
