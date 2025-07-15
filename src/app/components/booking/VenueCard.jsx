import React from 'react';
import { MapPin, Wifi, Car, Camera, Star, Snowflake, Droplets } from 'lucide-react';
import './VenueCard.css';

const VenueCard = ({ venue, selectedDate, selectedTimeSlot, onBook }) => {

  // Helper function to format time from 00:00:00 to 00:00
  const formatTime = (timeString) => {
    if (!timeString) return '';
    // If time is in format "00:00:00", extract only "00:00"
    if (timeString.includes(':')) {
      const parts = timeString.split(':');
      if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`;
      }
    }
    return timeString;
  };

  // Helper function to format time range
  const formatTimeRange = (timeRange) => {
    if (!timeRange || !timeRange.includes('-')) return timeRange;
    
    const [startTime, endTime] = timeRange.split('-');
    const formattedStart = formatTime(startTime);
    const formattedEnd = formatTime(endTime);
    
    return `${formattedStart}-${formattedEnd}`;
  };

  const getAmenityIcon = (amenity) => {
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

  const getAmenityLabel = (amenity) => {
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
  let availableSlots = [];
  let dayAvailability = null;
  
  if (selectedDate && venue.availability && venue.availability.length > 0) {
    dayAvailability = venue.availability.find(avail => avail.date === selectedDate);
    if (dayAvailability && dayAvailability.timeSlots) {
      availableSlots = dayAvailability.timeSlots
        .filter(slot => slot.isAvailable)
        .map(slot => ({
          time: slot.time, // Keep original format for filtering
          displayTime: formatTimeRange(slot.time), // Format for display
          price: slot.price || venue.basePrice || 0
        }));
    }
  }

  // Filter by selectedTimeSlot if provided
  if (selectedTimeSlot && selectedTimeSlot !== 'Mọi khung giờ' && availableSlots.length > 0) {
    if (selectedTimeSlot.includes('-')) {
      // Handle time range (e.g., "06:00-09:00")
      const [rangeStart, rangeEnd] = selectedTimeSlot.split('-');
      const formattedRangeStart = formatTime(rangeStart);
      const formattedRangeEnd = formatTime(rangeEnd);
      
      availableSlots = availableSlots.filter(slot => {
        if (slot.time && slot.time.includes('-')) {
          const [slotStart] = slot.time.split('-');
          const formattedSlotStart = formatTime(slotStart);
          return formattedSlotStart >= formattedRangeStart && formattedSlotStart < formattedRangeEnd;
        }
        return false;
      });
    } else {
      // Handle specific time - match by start time
      const formattedSelectedTime = formatTime(selectedTimeSlot);
      availableSlots = availableSlots.filter(slot => {
        if (slot.time && slot.time.includes('-')) {
          const [slotStart] = slot.time.split('-');
          const formattedSlotStart = formatTime(slotStart);
          return formattedSlotStart === formattedSelectedTime;
        }
        const formattedSlotTime = formatTime(slot.time);
        return formattedSlotTime === formattedSelectedTime;
      });
    }
  }

  // If no slots are available after filtering, don't render the card
  if (selectedDate && availableSlots.length === 0) {
    return null;
  }

  // Use basePrice as the current price
  const currentPrice = venue.basePrice || 0;

  // Get price range from available slots
  const priceRange = availableSlots.length > 0 ? 
    availableSlots.map(slot => slot.price).filter(price => price > 0) : [currentPrice];
  
  // Fallback to currentPrice if no valid prices found
  const validPrices = priceRange.length > 0 ? priceRange : [currentPrice];
  
  const minPrice = Math.min(...validPrices);
  const maxPrice = Math.max(...validPrices);
  const showPriceRange = minPrice !== maxPrice;

  return (
    <div className="venue-card">
      <div className="venue-card__content">
        {/* Image Section */}
        <div className="venue-card__image-container">
          <img
            src="https://i.pinimg.com/736x/30/e8/00/30e8005d937ed7f5eefd42a31761860e.jpg"
            alt={venue.name}
            className="venue-card__image"
          />
          <div className="venue-card__badge">
            {venue.type}
          </div>
          <div className="venue-card__rating">
            <Star size={12} className="venue-card__rating-star" />
            <span className="venue-card__rating-text">{venue.rating}</span>
            <span className="venue-card__rating-reviews">({venue.reviews})</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="venue-card__info">
          {/* Header Info */}
          <div>
            <div className="venue-card__header">
              <div style={{ flex: 1 }}>
                <h3 className="venue-card__title">{venue.name}</h3>
                <div className="venue-card__location">
                  <MapPin size={12} className="venue-card__location-icon" />
                  <span className="venue-card__location-text">{venue.location} • {venue.distance}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {venue.description && (
              <p className="venue-card__description">
                {venue.description}
              </p>
            )}

            {/* Amenities */}
            <div className="venue-card__amenities">
              {venue.amenities.slice(0, 4).map((amenity, index) => (
                <div key={index} className="venue-card__amenity">
                  {getAmenityIcon(amenity)}
                  <span>{getAmenityLabel(amenity)}</span>
                </div>
              ))}
              {venue.amenities.length > 4 && (
                <span className="venue-card__amenity-more">
                  +{venue.amenities.length - 4} khác
                </span>
              )}
            </div>

            {/* Available Slots - Enhanced Display (Max 3 slots) */}
            {selectedDate && availableSlots.length > 0 && (
              <div className="venue-card__slots">
                <div className="venue-card__slots-container">
                  {availableSlots.slice(0, 3).map((slot, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => onBook?.(venue.id, selectedDate, slot.time)}
                        className="venue-card__slot-button"
                      >
                        <div className="venue-card__slot-time">{slot.displayTime}</div>
                        <div className="venue-card__slot-price">
                          {(slot.price / 1000).toFixed(0)},000đ
                        </div>
                      </button>
                    );
                  })}
                  {availableSlots.length > 3 && (
                    <button
                      onClick={() => onBook?.(venue.id, selectedDate)}
                      className="venue-card__slot-more"
                    >
                      <div className="venue-card__slot-more-text">
                        +{availableSlots.length - 3} khác
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Section */}
          <div className="venue-card__actions">
            {/* Price Section */}
            <div className="venue-card__price">
              {showPriceRange ? (
                <div className="venue-card__price-text">
                  {(minPrice / 1000).toFixed(0)},000đ - {(maxPrice / 1000).toFixed(0)},000đ
                  <span className="venue-card__price-unit">/giờ</span>
                </div>
              ) : (
                <div className="venue-card__price-text">
                  {(currentPrice / 1000).toFixed(0)},000đ
                  <span className="venue-card__price-unit">/giờ</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => onBook?.(venue.id, selectedDate, selectedTimeSlot)}
              className="venue-card__book-button"
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
