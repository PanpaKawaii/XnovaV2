import React, { useState, useMemo } from 'react';
import { Filter, Search, Calendar, Clock, Target, X, ChevronDown, Star } from 'lucide-react';
import VenueCard from '../components/VenueCard';
import BookingSummaryModal from '../components/BookingSummaryModal';
import WeatherWidget from '../components/WeatherWidget';
import MapWidget from '../components/MapWidget';
import { venues } from '../../mocks/venueData';
import { getTodayDate } from '../hooks/dateUtils';
import './BookingPageV2.css';

const BookingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [preSelectedTimeSlot, setPreSelectedTimeSlot] = useState('');
  const [sortBy, setSortBy] = useState('relevant');
  
  const [filters, setFilters] = useState({
    selectedDate: getTodayDate(),
    maxPrice: 1000000,
    venueType: 'Cầu lông',
    location: '',
    amenities: [],
    rating: 0,
    timeSlot: ''
  });

  const locations = ['Tất cả khu vực', 'Quận 1', 'Quận 2', 'Quận 3', 'Quận 7', 'Quận Bình Thạnh'];
  const timeSlots = ['Mọi khung giờ', '06:00-09:00', '09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00', '21:00-24:00'];
  
  const amenityOptions = [
    { id: 'wifi', label: 'WiFi miễn phí', icon: '📶' },
    { id: 'parking', label: 'Bãi đỗ xe', icon: '🚗' },
    { id: 'camera', label: 'Camera an ninh', icon: '📹' },
    { id: 'ac', label: 'Điều hòa', icon: '❄️' },
    { id: 'free-water', label: 'Nước miễn phí', icon: '💧' }
  ];

  const filteredVenues = useMemo(() => {
    let filteredResults = venues.filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           venue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           venue.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !filters.location || filters.location === 'Tất cả khu vực' || 
                             venue.location.includes(filters.location);
      const matchesAmenities = filters.amenities.length === 0 || 
                              filters.amenities.every(amenity => venue.amenities.includes(amenity));
      const matchesRating = venue.rating >= filters.rating;

      const dayAvailability = venue.availability.find(avail => avail.date === filters.selectedDate);
      if (!dayAvailability) return false;

      const availableSlots = dayAvailability.timeSlots.filter(slot => slot.isAvailable);
      if (availableSlots.length === 0) return false;

      let matchesTimeSlot = true;
      if (filters.timeSlot && filters.timeSlot !== 'Mọi khung giờ') {
        const timeRange = filters.timeSlot.split('-');
        if (timeRange.length === 2) {
          const startTime = timeRange[0];
          const endTime = timeRange[1];
          matchesTimeSlot = availableSlots.some(slot => 
            slot.time >= startTime && slot.time < endTime
          );
        } else {
          matchesTimeSlot = availableSlots.some(slot => slot.time === filters.timeSlot);
        }
      }

      const matchesPrice = availableSlots.some(slot => 
        (slot.price || venue.basePrice) <= filters.maxPrice
      );

      return matchesSearch && matchesLocation && 
             matchesAmenities && matchesRating && matchesTimeSlot && matchesPrice;
    });

    switch (sortBy) {
      case 'price-low':
        filteredResults = filteredResults.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-high':
        filteredResults = filteredResults.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'rating':
        filteredResults = filteredResults.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        filteredResults = filteredResults.sort((a, b) => {
          const distanceA = parseFloat(a.distance.replace(/[^\d.]/g, ''));
          const distanceB = parseFloat(b.distance.replace(/[^\d.]/g, ''));
          return distanceA - distanceB;
        });
        break;
      case 'relevant':
      default:
        break;
    }

    return filteredResults;
  }, [searchTerm, filters, sortBy]);

  const handleVenueBook = (venueId, _selectedDate, selectedTimeSlot) => {
    setSelectedVenue(venueId);
    if (selectedTimeSlot) {
      setPreSelectedTimeSlot(selectedTimeSlot);
    }
    setShowBookingSummary(true);
  };

  const handleCloseBookingSummary = () => {
    setShowBookingSummary(false);
    setSelectedVenue(null);
    setPreSelectedTimeSlot('');
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      selectedDate: getTodayDate(),
      maxPrice: 1000000,
      venueType: 'Cầu lông',
      location: '',
      amenities: [],
      rating: 0,
      timeSlot: ''
    });
    setSearchTerm('');
    setSortBy('relevant');
  };

  const activeFiltersCount = [
    filters.location && filters.location !== 'Tất cả khu vực',
    filters.timeSlot && filters.timeSlot !== 'Mọi khung giờ',
    filters.amenities.length > 0,
    filters.rating > 0,
    filters.maxPrice < 1000000
  ].filter(Boolean).length;

  return (
    <div className="booking-page">
      {/* Hero Section */}
      <section className="booking-page__hero">
        <div className="booking-page__hero-bg"></div>
        <div className="booking-page__hero-content">
          <div className="booking-page__hero-text">
            <h1 className="booking-page__hero-title">
              Đặt Sân Cầu Lông
            </h1>
            <h2 className="booking-page__hero-subtitle">
              NHANH CHÓNG & TIỆN LỢI
            </h2>
            <p className="booking-page__hero-description">
              Tìm và đặt sân cầu lông chất lượng cao trong khu vực của bạn. 
              Hệ thống đặt sân thông minh với thông tin thời gian thực!
            </p>
            
            <div className="booking-page__scroll-indicator">
              <div className="booking-page__scroll-hint">
                <span className="booking-page__scroll-text">🏸 Lướt xuống để bắt đầu đặt sân</span>
              </div>
              <div className="booking-page__scroll-arrow">
                <ChevronDown className="booking-page__scroll-icon" size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="booking-page__container">
        {/* Enhanced Filter Section - 2 Row Layout */}
        <div className="booking-page__filters">
          <div className="booking-page__filters-header">
            <div className="booking-page__filters-title">
              <Filter size={18} className="booking-page__filters-icon" />
              Tìm sân cầu lông phù hợp
            </div>
          </div>
          
          <div className="booking-page__filter-controls">
            <div className="booking-page__filter-row">
              <div className="booking-page__filter-group">
                <label className="booking-page__filter-label">Tìm kiếm</label>
                <div className="booking-page__search-wrapper">
                  <Search size={16} className="booking-page__search-icon" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sân cầu lông..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="booking-page__search-input"
                  />
                </div>
              </div>

              <div className="booking-page__filter-group">
                <label className="booking-page__filter-label">Ngày chơi</label>
                <div className="booking-page__date-wrapper">
                  <Calendar size={16} className="booking-page__date-icon" />
                  <input
                    type="date"
                    value={filters.selectedDate}
                    onChange={(e) => handleFilterChange('selectedDate', e.target.value)}
                    min={getTodayDate()}
                    className="booking-page__date-input"
                  />
                </div>
              </div>

              <div className="booking-page__filter-group">
                <label className="booking-page__filter-label">Khu vực</label>
                <div className="booking-page__select-wrapper">
                  <select
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="booking-page__select"
                  >
                    {locations.map(location => (
                      <option key={location} value={location === 'Tất cả khu vực' ? '' : location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="booking-page__select-arrow" size={14} />
                </div>
              </div>

              <div className="booking-page__filter-group">
                <label className="booking-page__filter-label">Khung giờ</label>
                <div className="booking-page__time-wrapper">
                  <Clock size={16} className="booking-page__time-icon" />
                  <select
                    value={filters.timeSlot || ''}
                    onChange={(e) => handleFilterChange('timeSlot', e.target.value)}
                    className="booking-page__time-select"
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot === 'Mọi khung giờ' ? '' : slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="booking-page__select-arrow" size={14} />
                </div>
              </div>
            </div>

            <div className="booking-page__filter-row">
              <div className="booking-page__filter-group">
                <label className="booking-page__filter-label">Giá (VNĐ/giờ)</label>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="50000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                  className="booking-page__price-range"
                />
                <div className="booking-page__price-labels">
                  <span>50K</span>
                  <span className="booking-page__price-value">
                    {filters.maxPrice === 1000000 ? '1M+' : `${(filters.maxPrice / 1000).toFixed(0)}K`}
                  </span>
                  <span>1M+</span>
                </div>
              </div>

              <div className="booking-page__filter-group">
                <label className="booking-page__filter-label">Đánh giá tối thiểu</label>
                <div className="booking-page__rating-filter">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => handleFilterChange('rating', star === filters.rating ? 0 : star)}
                      className={`booking-page__rating-star ${
                        star <= filters.rating ? 'booking-page__rating-star--active' : ''
                      }`}
                    >
                      <Star size={20} className={star <= filters.rating ? 'booking-page__rating-star-filled' : ''} />
                    </button>
                  ))}
                </div>
                <div className="booking-page__rating-reset">
                  <button
                    onClick={() => handleFilterChange('rating', 0)}
                    className="booking-page__rating-reset-btn"
                  >
                    Bỏ chọn
                  </button>
                </div>
              </div>

              <div className="booking-page__filter-group">
                <label className="booking-page__filter-label">Tiện ích</label>
                <div className="booking-page__amenities-grid">
                  {amenityOptions.map(amenity => (
                    <label
                      key={amenity.id}
                      className={`booking-page__amenity-item ${
                        filters.amenities.includes(amenity.id) ? 'booking-page__amenity-item--active' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity.id)}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        className="booking-page__amenity-checkbox"
                      />
                      <span className="booking-page__amenity-icon">{amenity.icon}</span>
                      <span className="booking-page__amenity-label">{amenity.label.split(' ')[0]}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, amenities: [] }))}
                  className="booking-page__amenities-reset"
                >
                  Bỏ chọn tất cả
                </button>
              </div>

              <div className="booking-page__filter-group">
                <label className="booking-page__filter-label">Sắp xếp theo</label>
                <div className="booking-page__sort-controls">
                  <div className="booking-page__sort-wrapper">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="booking-page__sort-select"
                    >
                      <option value="relevant">🎯 Phù hợp nhất</option>
                      <option value="price-low">💰 Giá thấp → cao</option>
                      <option value="price-high">💎 Giá cao → thấp</option>
                      <option value="rating">⭐ Đánh giá cao nhất</option>
                      <option value="distance">📍 Gần nhất</option>
                    </select>
                    <ChevronDown className="booking-page__sort-arrow" size={14} />
                  </div>
                  {(filters.location || filters.timeSlot || filters.maxPrice < 1000000 || filters.rating > 0 || filters.amenities.length > 0) && (
                    <button 
                      onClick={clearFilters}
                      className="booking-page__clear-filters"
                      title="Xóa tất cả bộ lọc"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="booking-page__content">
          <div className="booking-page__sidebar">
            <div className="booking-page__sidebar-sticky">
              <WeatherWidget />
              <MapWidget 
                venues={filteredVenues.map(venue => ({
                  id: venue.id,
                  name: venue.name,
                  location: venue.location,
                  distance: venue.distance,
                  rating: venue.rating,
                  price: venue.basePrice,
                  type: venue.type,
                  lat: 10.7769 + Math.random() * 0.1,
                  lng: 106.7009 + Math.random() * 0.1
                }))}
                selectedVenue={selectedVenue || undefined}
                onVenueSelect={setSelectedVenue}
              />
            </div>
          </div>

          <div className="booking-page__venues venues-list-section">
            <div className="booking-page__venues-header">
              <div className="booking-page__results-summary">
                <div className="booking-page__results-content">
                  <div className="booking-page__results-icon">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="booking-page__results-date">
                      {new Date(filters.selectedDate).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <div className="booking-page__results-details">
                      {filters.timeSlot && filters.timeSlot !== 'Mọi khung giờ' && (
                        <span className="booking-page__results-time">
                          <Clock size={14} />
                          <span>{filters.timeSlot}</span>
                        </span>
                      )}
                      <span className="booking-page__results-count">
                        <Target size={14} />
                        Tìm thấy <span>{filteredVenues.length}</span> sân cầu lông
                      </span>
                    </div>
                  </div>
                </div>
                <div className="booking-page__results-total">
                  <div className="booking-page__results-number">{filteredVenues.length}</div>
                  <div className="booking-page__results-label">Sân có sẵn</div>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <div className="booking-page__active-filters">
                  <div className="booking-page__active-filters-list">
                    {filters.location && filters.location !== 'Tất cả khu vực' && (
                      <span className="booking-page__active-filter">
                        <span className="booking-page__active-filter-dot"></span>
                        {filters.location}
                        <button
                          onClick={() => handleFilterChange('location', '')}
                          className="booking-page__active-filter-remove"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {filters.timeSlot && filters.timeSlot !== 'Mọi khung giờ' && (
                      <span className="booking-page__active-filter booking-page__active-filter--time">
                        <span className="booking-page__active-filter-dot"></span>
                        {filters.timeSlot}
                        <button
                          onClick={() => handleFilterChange('timeSlot', '')}
                          className="booking-page__active-filter-remove"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {filters.maxPrice < 1000000 && (
                      <span className="booking-page__active-filter booking-page__active-filter--price">
                        <span className="booking-page__active-filter-dot"></span>
                        Dưới {(filters.maxPrice / 1000).toFixed(0)}K
                        <button
                          onClick={() => handleFilterChange('maxPrice', 1000000)}
                          className="booking-page__active-filter-remove"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {filters.rating > 0 && (
                      <span className="booking-page__active-filter booking-page__active-filter--rating">
                        <span className="booking-page__active-filter-dot"></span>
                        {filters.rating}+ ⭐
                        <button
                          onClick={() => handleFilterChange('rating', 0)}
                          className="booking-page__active-filter-remove"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {filters.amenities.map(amenity => {
                      const amenityLabel = amenityOptions.find(a => a.id === amenity)?.label || amenity;
                      const amenityIcon = amenityOptions.find(a => a.id === amenity)?.icon || '';
                      return (
                        <span key={amenity} className="booking-page__active-filter booking-page__active-filter--amenity">
                          <span className="booking-page__active-filter-dot"></span>
                          {amenityIcon} {amenityLabel}
                          <button
                            onClick={() => handleAmenityToggle(amenity)}
                            className="booking-page__active-filter-remove"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="booking-page__venues-header-row">
                <div className="booking-page__venues-title-section">
                  <div className="booking-page__venues-title-icon">
                    <span>🏸</span>
                  </div>
                  <h2 className="booking-page__venues-title">
                    Danh sách sân cầu lông có sẵn
                  </h2>
                </div>
                <div className="booking-page__venues-note">
                  <span>🏸 Lưu ý: Kiểm tra giá và khung giờ trước khi đặt</span>
                </div>
              </div>
            </div>

            <div className="booking-page__venues-grid">
              {filteredVenues.map((venue) => (
                <div key={venue.id} className="booking-page__venue-card">
                  <VenueCard
                    venue={venue}
                    selectedDate={filters.selectedDate}
                    selectedTimeSlot={filters.timeSlot}
                    onBook={handleVenueBook}
                  />
                </div>
              ))}
            </div>

            {filteredVenues.length === 0 && (
              <div className="booking-page__no-results">
                <div className="booking-page__no-results-icon">😔</div>
                <h3 className="booking-page__no-results-title">Không tìm thấy sân cầu lông phù hợp</h3>
                <p className="booking-page__no-results-text">
                  Không có sân cầu lông nào có sẵn cho ngày và khung giờ đã chọn. 
                  Thử chọn ngày khác hoặc điều chỉnh bộ lọc.
                </p>
                <div className="booking-page__no-results-buttons">
                  <button 
                    onClick={() => handleFilterChange('selectedDate', getTodayDate())}
                    className="booking-page__no-results-button booking-page__no-results-button--date"
                  >
                    <Calendar size={16} />
                    Chọn hôm nay
                  </button>
                  <button 
                    onClick={clearFilters}
                    className="booking-page__no-results-button booking-page__no-results-button--clear"
                  >
                    <X size={16} />
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showBookingSummary && selectedVenue && (
        <BookingSummaryModal
          isOpen={showBookingSummary}
          onClose={handleCloseBookingSummary}
          venue={venues.find(v => v.id === selectedVenue)}
          preSelectedDate={filters.selectedDate}
          preSelectedTimeSlot={preSelectedTimeSlot || filters.timeSlot}
        />
      )}

      <button
        onClick={() => {
          const venuesSection = document.querySelector('.venues-list-section');
          if (venuesSection) {
            venuesSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="booking-page__scroll-to-venues"
        title="Xem danh sách sân"
      >
        <div className="booking-page__scroll-button-content">
          <span className="booking-page__scroll-button-emoji">🏟️</span>
          <ChevronDown size={16} className="booking-page__scroll-button-arrow" />
        </div>
        <div className="booking-page__scroll-tooltip">
          Xem danh sách sân
        </div>
      </button>
    </div>
  );
};

export default BookingPage;