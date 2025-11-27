// // API Service for handling HTTP requests
// // Strategy:
// // - In development, use proxy via '/api/*' prefix
// // - In production, use absolute base URL from environment if provided
// const IS_DEV = import.meta?.env?.MODE !== 'production';
// const API_BASE_URL = IS_DEV
//   ? '/api' // Use proxy in development
//   : (import.meta.env.VITE_API_URL || import.meta.env.VITE_REACT_APP_API_URL || '').trim();
// export class ApiService {
//   static async request(endpoint, options = {}) {
//     // Ensure endpoint starts with / for proper concatenation
//     const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
//     const url = API_BASE_URL
//       ? `${API_BASE_URL}${cleanEndpoint}`
//       : cleanEndpoint;
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       // Helpful debug: log method and URL in dev
//       if (import.meta?.env?.MODE !== 'production') {
//         // eslint-disable-next-line no-console
//         console.debug(`[ApiService] ${config.method || 'GET'} ${url}`);
//       }

//       const response = await fetch(url, config);

//       if (!response.ok) {
//         // Try to read error body for better diagnostics
//         let body = '';
//         try {
//           body = await response.text();
//         } catch (_) {}
//         throw new Error(`HTTP ${response.status}: ${body?.slice(0, 300)}`);
//       }

//       // Some endpoints may return empty body
//       const text = await response.text();
//       return text ? JSON.parse(text) : null;
//     } catch (error) {
//       console.error('API request failed:', error);
//       throw error;
//     }
//   }

//   static async get(endpoint) {
//     return this.request(endpoint, { method: 'GET' });
//   }

//   static async post(endpoint, data) {
//     return this.request(endpoint, {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   static async put(endpoint, data) {
//     return this.request(endpoint, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   }

//   static async delete(endpoint) {
//     return this.request(endpoint, { method: 'DELETE' });
//   }
// }

// // Example service methods
// export const userService = {
//   login: (credentials) =>
//     ApiService.post('/auth/login', credentials),
  
//   register: (userData) =>
//     ApiService.post('/auth/register', userData),
  
//   getProfile: () => ApiService.get('/user/profile'),
// };

// export const bookingService = {
//   createBooking: (bookingData) =>
//     ApiService.post('/bookings', bookingData),
  
//   getBookings: () => ApiService.get('/bookings'),
  
//   getBookingById: (id) => ApiService.get(`/bookings/${id}`),
  
//   getBookingsByUserId: (userId) => ApiService.get(`/bookings/user/${userId}`),
  
//   createInvitation: (invitationData) =>
//     ApiService.post('/invitations', invitationData),
  
//   getInvitations: () => ApiService.get('/invitations'),
  
//   getInvitationById: (id) => ApiService.get(`/invitations/${id}`),
  
//   getInvitationsByUserId: (userId) => ApiService.get(`/invitations/user/${userId}`),
// };
