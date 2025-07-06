import React from 'react';
import { MapPin, Wifi, Car, Camera, Star, Snowflake, Droplets, Clock, Calendar } from 'lucide-react';
import { Venue } from '../../settings/venue';

interface VenueCardProps {
  venue: Venue;
  selectedDate?: string;
  selectedTimeSlot?: string;
  onBook?: (venueId: string, selectedDate?: string, selectedTimeSlot?: string) => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, selectedDate, selectedTimeSlot, onBook }) => {

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi size={12} />;
      case 'parking':
        return <Car size={12} />;
      case 'camera':
        return <Camera size={12} />;
      case 'ac':
        return <Snowflake size={12} />;
      case 'free-water':
        return <Droplets size={12} />;
      default:
        return null;
    }
  };

  const getAmenityLabel = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return 'WiFi';
      case 'parking':
        return 'Đỗ xe';
      case 'camera':
        return 'Camera';
      case 'ac':
        return 'Điều hòa';
      case 'free-water':
        return 'Nước miễn phí';
      default:
        return amenity;
    }
  };

  // Get available slots for selected date
  let availableSlots: string[] = [];
  let dayAvailability = null;
  
  if (selectedDate) {
    dayAvailability = venue.availability.find(avail => avail.date === selectedDate);
    if (dayAvailability) {
      availableSlots = dayAvailability.timeSlots
        .filter(slot => slot.isAvailable)
        .map(slot => slot.time);
    }
  }

  // Filter by selectedTimeSlot if provided
  if (selectedTimeSlot && selectedTimeSlot !== 'Mọi khung giờ') {
    if (selectedTimeSlot.includes('-')) {
      // Handle time range (e.g., "06:00-09:00")
      const [startTime, endTime] = selectedTimeSlot.split('-');
      availableSlots = availableSlots.filter(slot => slot >= startTime && slot < endTime);
    } else {
      // Handle specific time
      availableSlots = availableSlots.filter(slot => slot === selectedTimeSlot);
    }
  }

  // If no slots are available after filtering, don't render the card
  if (selectedDate && availableSlots.length === 0) {
    return null;
  }

  // Use basePrice as the current price
  const currentPrice = venue.basePrice;

  // Get price range if there are different prices for different time slots
  const priceRange = dayAvailability ? 
    dayAvailability.timeSlots
      .filter(slot => slot.isAvailable && (!selectedTimeSlot || selectedTimeSlot === 'Mọi khung giờ' || availableSlots.includes(slot.time)))
      .map(slot => slot.price || venue.basePrice) : [venue.basePrice];
  
  const minPrice = Math.min(...priceRange);
  const maxPrice = Math.max(...priceRange);
  const showPriceRange = minPrice !== maxPrice;

  return (
    <div className="card hover-scale">
      <div className="flex flex-col gap-3">
        {/* Image Section */}
        <div className="relative">
          <img
            src="https://i.pinimg.com/736x/30/e8/00/30e8005d937ed7f5eefd42a31761860e.jpg"
            alt={venue.name}
            className="w-full h-28 object-cover rounded-lg"
          />
          <div className="absolute top-2 left-2">
            <span className="status-badge status-available text-xs px-2 py-1">
              {venue.type}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center">
              <Star size={12} className="text-yellow-400 fill-current mr-1" />
              <span className="text-white text-xs font-medium">{venue.rating}</span>
              <span className="text-gray-300 text-xs ml-1">({venue.reviews})</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Header Info */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{venue.name}</h3>
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <MapPin size={12} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{venue.location} • {venue.distance}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {venue.description && (
              <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                {venue.description}
              </p>
            )}

            {/* Amenities */}
            <div className="flex items-center flex-wrap gap-2 mb-3">
              {venue.amenities.slice(0, 4).map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-400 text-xs">
                  {getAmenityIcon(amenity)}
                  <span className="ml-1">{getAmenityLabel(amenity)}</span>
                </div>
              ))}
              {venue.amenities.length > 4 && (
                <span className="text-xs text-gray-400">
                  +{venue.amenities.length - 4} khác
                </span>
              )}
            </div>

            {/* Available Slots - Enhanced Display (Max 3 slots) */}
            {selectedDate && availableSlots.length > 0 && (
              <div className="mb-3">
                <div className="flex gap-2">
                  {availableSlots.slice(0, 3).map((slot, index) => {
                    const timeSlot = dayAvailability?.timeSlots.find(ts => ts.time === slot);
                    const slotPrice = timeSlot?.price || venue.basePrice;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => onBook?.(venue.id, selectedDate, slot)}
                        className="bg-gray-800 hover:bg-lime-600 rounded-lg p-2 text-center border border-gray-600 hover:border-lime-500 transition-all hover:scale-105 flex-1"
                      >
                        <div className="text-white text-xs font-medium">{slot}</div>
                        <div className="text-green-400 text-xs">
                          {(slotPrice / 1000).toFixed(0)},000đ
                        </div>
                      </button>
                    );
                  })}
                  {availableSlots.length > 3 && (
                    <button
                      onClick={() => onBook?.(venue.id, selectedDate)}
                      className="bg-gray-800 hover:bg-blue-600 rounded-lg p-2 text-center border border-gray-600 hover:border-blue-500 transition-all hover:scale-105 flex-1"
                    >
                      <div className="text-blue-400 text-xs">
                        +{availableSlots.length - 3} khác
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Section */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            {/* Price Section */}
            <div className="text-left">
              {showPriceRange ? (
                <div className="text-lg font-bold text-green-400">
                  {(minPrice / 1000).toFixed(0)},000đ - {(maxPrice / 1000).toFixed(0)},000đ
                  <span className="text-gray-400 text-xs ml-1">/giờ</span>
                </div>
              ) : (
                <div className="text-lg font-bold text-green-400">
                  {(currentPrice / 1000).toFixed(0)},000đ
                  <span className="text-gray-400 text-xs ml-1">/giờ</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => onBook?.(venue.id, selectedDate, selectedTimeSlot)}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Đặt ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;