// Remove all TypeScript interfaces and just keep the JavaScript exports
export const venueTypes = {
  TENNIS: 'tennis',
  BADMINTON: 'badminton',
  BASKETBALL: 'basketball',
  VOLLEYBALL: 'volleyball',
};

export const defaultFilters = {
  selectedDate: '',
  maxPrice: 1000,
  venueType: '',
  location: '',
  amenities: [],
  rating: 0,
  timeSlot: '',
};

export const commonAmenities = [
  'Parking',
  'Shower',
  'Changing Room',
  'Equipment Rental',
  'Lighting',
  'Air Conditioning',
  'Refreshments',
  'Locker',
];