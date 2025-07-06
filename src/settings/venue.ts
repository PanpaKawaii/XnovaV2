export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  price?: number;
}

export interface VenueAvailability {
  date: string;
  timeSlots: TimeSlot[];
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  distance: string;
  image: string;
  rating: number;
  reviews: number;
  basePrice: number;
  price?: number; // For backward compatibility
  amenities: string[];
  type: string;
  description?: string;
  availability: VenueAvailability[];
  availableSlots?: string[]; // For backward compatibility
}

export interface BookingFilters {
  selectedDate: string;
  maxPrice: number;
  venueType: string;
  location: string;
  amenities: string[];
  rating: number;
  timeSlot: string;
}