export interface Field {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  available: boolean;
  size: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

export interface Booking {
  id: string;
  fieldId: string;
  date: string;
  timeSlot: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  location: string;
  bio: string;
  rating: number;
}

export interface Match {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  playersNeeded: number;
  currentPlayers: number;
  skillLevel: string;
  price: number;
  organizer: Player;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}