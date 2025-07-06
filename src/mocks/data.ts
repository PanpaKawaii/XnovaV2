// Mock data for development and testing
export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'player',
    avatar: '/avatars/john.jpg',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'coach',
    avatar: '/avatars/jane.jpg',
  },
];

export const mockBookings = [
  {
    id: '1',
    userId: '1',
    courtId: 'court-1',
    date: '2025-07-06',
    time: '14:00',
    duration: 60,
    status: 'confirmed',
    sport: 'tennis',
  },
  {
    id: '2',
    userId: '2',
    courtId: 'court-2',
    date: '2025-07-07',
    time: '16:00',
    duration: 90,
    status: 'pending',
    sport: 'badminton',
  },
];

export const mockCourts = [
  {
    id: 'court-1',
    name: 'Tennis Court 1',
    sport: 'tennis',
    location: 'Building A',
    capacity: 4,
    pricePerHour: 50,
    image: '/courts/tennis-1.jpg',
  },
  {
    id: 'court-2',
    name: 'Badminton Court 1',
    sport: 'badminton',
    location: 'Building B',
    capacity: 4,
    pricePerHour: 40,
    image: '/courts/badminton-1.jpg',
  },
];
