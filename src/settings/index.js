export { appConfig } from './config.js';
export { venueTypes, defaultFilters, commonAmenities } from './venue.js';

// Default values for common data structures
export const defaultField = {
  id: '',
  name: '',
  location: '',
  price: 0,
  image: '',
  available: true,
  size: '',
};

export const defaultTimeSlot = {
  id: '',
  time: '',
  available: true,
  price: 0,
};

export const defaultBooking = {
  id: '',
  fieldId: '',
  date: '',
  timeSlot: '',
  price: 0,
  status: 'pending',
};

export const defaultPlayer = {
  id: '',
  name: '',
  avatar: '',
  skillLevel: 'beginner',
  location: '',
  bio: '',
  rating: 0,
};

export const defaultMatch = {
  id: '',
  title: '',
  date: '',
  time: '',
  location: '',
  playersNeeded: 0,
  currentPlayers: 0,
  skillLevel: '',
  price: 0,
  organizer: null,
};

export const defaultUser = {
  id: '',
  name: '',
  email: '',
  avatar: '',
};
