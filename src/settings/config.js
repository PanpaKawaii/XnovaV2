// Application configuration and settings
export const appConfig = {
  name: 'XnovaV2',
  version: '1.0.0',
  description: 'Sports Court Booking Platform',
  
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL || import.meta.env.VITE_API_URL || 'https://xnova-5coe.onrender.com/api/',
    timeout: 10000,
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY || 'your_api_key',
  },
  
  // Authentication
  auth: {
    tokenKey: 'xnova_auth_token',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // UI Configuration
  ui: {
    theme: {
      defaultMode: 'light',
      primary: '#3b82f6',
      secondary: '#64748b',
    },
    
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [10, 20, 50, 100],
    },
  },
  
  // Features
  features: {
    enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableNotifications: true,
  },
  
  // Sports Configuration
  sports: [
    { id: 'tennis', name: 'Tennis', icon: '🎾' },
    { id: 'badminton', name: 'Badminton', icon: '🏸' },
    { id: 'basketball', name: 'Basketball', icon: '🏀' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  ],
  
  // Time slots
  timeSlots: [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00',
  ],
};
