import React, { useState, useMemo } from 'react';
import { Filter, Search, Calendar, Clock, Target, X, ChevronDown, Star } from 'lucide-react';
import VenueCard from '../components/VenueCard';
import BookingSummaryModal from '../components/BookingSummaryModal';
import WeatherWidget from '../components/WeatherWidget';
import MapWidget from '../components/MapWidget';
import { venues } from '../../mocks/venueData';
import { BookingFilters } from '../../settings/venue';
import { getTodayDate } from '../hooks/dateUtils';

const BookingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [preSelectedTimeSlot, setPreSelectedTimeSlot] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevant');
  
  // Filter states with date as primary filter - removed venueType and showAdvancedFilters
  const [filters, setFilters] = useState<BookingFilters>({
    selectedDate: getTodayDate(),
    maxPrice: 1000000,
    venueType: 'Cầu lông', // Fixed to badminton only
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
      // Search filter
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           venue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           venue.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Basic filters - removed venueType filter since it's fixed to badminton
      const matchesLocation = !filters.location || filters.location === 'Tất cả khu vực' || 
                             venue.location.includes(filters.location);
      const matchesAmenities = filters.amenities.length === 0 || 
                              filters.amenities.every(amenity => venue.amenities.includes(amenity));
      const matchesRating = venue.rating >= filters.rating;

      // Date and time availability filter
      const dayAvailability = venue.availability.find(avail => avail.date === filters.selectedDate);
      if (!dayAvailability) return false;

      const availableSlots = dayAvailability.timeSlots.filter(slot => slot.isAvailable);
      if (availableSlots.length === 0) return false;

      // Time slot filter
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

      // Price filter (check against available slots)
      const matchesPrice = availableSlots.some(slot => 
        (slot.price || venue.basePrice) <= filters.maxPrice
      );

      return matchesSearch && matchesLocation && 
             matchesAmenities && matchesRating && matchesTimeSlot && matchesPrice;
    });

    // Apply sorting
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
        // Keep original order for relevance
        break;
    }

    return filteredResults;
  }, [venues, searchTerm, filters, sortBy]);

  const handleVenueBook = (venueId: string, _selectedDate?: string, selectedTimeSlot?: string) => {
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

  const handleFilterChange = (filterType: keyof BookingFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
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
      venueType: '',
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
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20 pt-20 pb-8">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Đặt Sân Cầu Lông
            </h1>
            <h2 className="text-xl lg:text-2xl font-bold text-gradient mb-6">
              NHANH CHÓNG & TIỆN LỢI
            </h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Tìm và đặt sân cầu lông chất lượng cao trong khu vực của bạn. 
              Hệ thống đặt sân thông minh với thông tin thời gian thực!
            </p>
            
            {/* Scroll Indicator */}
            <div className="flex flex-col items-center mt-8">
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-4">
                <span className="text-white text-sm font-medium">🏸 Lướt xuống để bắt đầu đặt sân</span>
              </div>
              <div className="animate-bounce">
                <ChevronDown className="text-lime-400" size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Enhanced Filter Section - 2 Row Layout */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="flex items-center bg-lime-500 text-black px-3 py-2 rounded-lg font-semibold mr-4">
              <Filter size={18} className="mr-2" />
              Tìm sân cầu lông phù hợp
            </div>
          </div>
          
          {/* 2-Row Filter Layout */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            {/* First Row - Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Tìm kiếm sân cầu lông..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-9 w-full h-10 text-sm bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              {/* Date Selector */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  value={filters.selectedDate}
                  onChange={(e) => handleFilterChange('selectedDate', e.target.value)}
                  className="input-field pl-9 w-full h-10 text-sm bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Location Filter */}
              <div className="relative">
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="input-field w-full h-10 text-sm bg-gray-700 border-gray-600 appearance-none pr-8 text-white"
                >
                  {locations.map(location => (
                    <option key={location} value={location === 'Tất cả khu vực' ? '' : location} className="bg-gray-700 text-white">
                      {location}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>

              {/* Time Slot Filter */}
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={filters.timeSlot}
                  onChange={(e) => handleFilterChange('timeSlot', e.target.value)}
                  className="input-field pl-9 w-full h-10 text-sm bg-gray-700 border-gray-600 appearance-none pr-8 text-white"
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot === 'Mọi khung giờ' ? '' : slot} className="bg-gray-700 text-white">
                      {slot}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>

            {/* Second Row - Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-gray-700">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">Giá (VNĐ/giờ)</label>
                <div className="relative">

                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="50000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>50K</span>
                    <span className="text-lime-400 font-bold">
                      {filters.maxPrice === 1000000 ? '1M+' : `${(filters.maxPrice / 1000).toFixed(0)}K`}
                    </span>
                    <span>1M+</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 ">Đánh giá tối thiểu</label>
                <div className="flex items-center justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleFilterChange('rating', star === filters.rating ? 0 : star)}
                      className={`transition-colors ${
                        star <= filters.rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'
                      }`}
                    >
                      <Star size={20} className={star <= filters.rating ? 'fill-current' : ''} />
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  <button
                    onClick={() => handleFilterChange('rating', 0)}
                    className="text-white text-xs hover:text-gray-300 transition-colors"
                  >
                    Bỏ chọn 
                  </button>
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">Tiện ích</label>
                <div className="grid grid-cols-5 gap-1">
                  {amenityOptions.map(amenity => (
                    <label
                      key={amenity.id}
                      className={`flex flex-col items-center p-1 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                        filters.amenities.includes(amenity.id)
                          ? 'border-lime-500 bg-lime-500/20 text-lime-400'
                          : 'border-gray-600 bg-gray-700/50 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity.id)}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        className="sr-only"
                      />
                      <span className="text-xs mb-0.5">{amenity.icon}</span>
                      <span className="text-xs text-center leading-tight" style={{fontSize: '10px'}}>{amenity.label.split(' ')[0]}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, amenities: [] }))}
                  className="w-full text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Bỏ chọn tất cả
                </button>
              </div>

              {/* Clear Filters & Sort */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">Sắp xếp theo</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input-field text-xs h-10 bg-gray-700 border-gray-600 text-white w-full appearance-none pr-8 pl-3"
                    >
                      <option value="relevant" className="bg-gray-700 text-white">🎯 Phù hợp nhất</option>
                      <option value="price-low" className="bg-gray-700 text-white">💰 Giá thấp → cao</option>
                      <option value="price-high" className="bg-gray-700 text-white">💎 Giá cao → thấp</option>
                      <option value="rating" className="bg-gray-700 text-white">⭐ Đánh giá cao nhất</option>
                      <option value="distance" className="bg-gray-700 text-white">📍 Gần nhất</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                  </div>
                  {(filters.location || filters.timeSlot || filters.maxPrice < 1000000 || filters.rating > 0 || filters.amenities.length > 0) && (
                    <button 
                      onClick={clearFilters}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors flex items-center"
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Weather and Map (25%) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="sticky top-20 space-y-4">
              {/* Weather Widget */}
              <WeatherWidget />
              
              {/* Map Widget */}
              <MapWidget 
                venues={filteredVenues.map(venue => ({
                  id: venue.id,
                  name: venue.name,
                  location: venue.location,
                  distance: venue.distance,
                  rating: venue.rating,
                  price: venue.basePrice,
                  type: venue.type,
                  lat: 10.7769 + Math.random() * 0.1, // Mock coordinates
                  lng: 106.7009 + Math.random() * 0.1 // Mock coordinates
                }))}
                selectedVenue={selectedVenue || undefined}
                onVenueSelect={setSelectedVenue}
              />
            </div>
          </div>

          {/* Right Column - Results & Venues (75%) */}
          <div className="lg:col-span-3">
            {/* Results Summary */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                      <Calendar size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {new Date(filters.selectedDate).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        {filters.timeSlot && filters.timeSlot !== 'Mọi khung giờ' && (
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            <span className="text-green-400 font-medium">{filters.timeSlot}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Target size={14} />
                          <span>Tìm thấy <span className="text-white font-bold">{filteredVenues.length}</span> sân cầu lông</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{filteredVenues.length}</div>
                    <div className="text-xs text-gray-400">Sân có sẵn</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Display - Enhanced */}
            {activeFiltersCount > 0 && (
              <div className="mb-6">

                <div className="flex flex-wrap gap-2">
                  {filters.location && filters.location !== 'Tất cả khu vực' && (
                    <span className="group inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      {filters.location}
                      <button
                        onClick={() => handleFilterChange('location', '')}
                        className="ml-1 p-1 hover:bg-blue-800 rounded-full transition-colors duration-200"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.timeSlot && filters.timeSlot !== 'Mọi khung giờ' && (
                    <span className="group inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      {filters.timeSlot}
                      <button
                        onClick={() => handleFilterChange('timeSlot', '')}
                        className="ml-1 p-1 hover:bg-green-800 rounded-full transition-colors duration-200"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.maxPrice < 1000000 && (
                    <span className="group inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-sm font-medium shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-105">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      Dưới {(filters.maxPrice / 1000).toFixed(0)}K
                      <button
                        onClick={() => handleFilterChange('maxPrice', 1000000)}
                        className="ml-1 p-1 hover:bg-orange-800 rounded-full transition-colors duration-200"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.rating > 0 && (
                    <span className="group inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm font-medium shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-105">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      {filters.rating}+ ⭐
                      <button
                        onClick={() => handleFilterChange('rating', 0)}
                        className="ml-1 p-1 hover:bg-yellow-700 rounded-full transition-colors duration-200"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.amenities.map(amenity => {
                    const amenityLabel = amenityOptions.find(a => a.id === amenity)?.label || amenity;
                    const amenityIcon = amenityOptions.find(a => a.id === amenity)?.icon || '';
                    return (
                      <span key={amenity} className="group inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-sm font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        {amenityIcon} {amenityLabel}
                        <button
                          onClick={() => handleAmenityToggle(amenity)}
                          className="ml-1 p-1 hover:bg-teal-800 rounded-full transition-colors duration-200"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Venues List Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-lime-500 to-green-500 rounded-lg">
                    <span className="text-white font-bold">�</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Danh sách sân cầu lông có sẵn</h3>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-lime-500/10 border border-lime-500/30 rounded-lg px-3 py-2">
                  <span className="text-lime-400 text-sm font-medium">🏸Lưu ý: Kiểm tra giá và khung giờ trước khi đặt </span>
                </div>
              </div>
            </div>

            {/* Venues List - 2 per row layout with compact spacing */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 venues-list-section">
              {filteredVenues.map((venue) => (
                <div key={venue.id} className="w-full">
                  <VenueCard
                    venue={venue}
                    selectedDate={filters.selectedDate}
                    selectedTimeSlot={filters.timeSlot}
                    onBook={handleVenueBook}
                  />
                </div>
              ))}
            </div>

            {/* Empty State - Enhanced */}
            {filteredVenues.length === 0 && (
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="text-8xl mb-4 animate-bounce">�</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Không tìm thấy sân cầu lông phù hợp</h3>
                <p className="text-gray-400 mb-8 text-base max-w-md mx-auto leading-relaxed">
                  Không có sân cầu lông nào có sẵn cho ngày và khung giờ đã chọn. 
                  Thử chọn ngày khác hoặc điều chỉnh bộ lọc.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-sm mx-auto">
                  <button 
                    onClick={() => handleFilterChange('selectedDate', getTodayDate())}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Calendar size={16} />
                    Chọn hôm nay
                  </button>
                  <button 
                    onClick={clearFilters} 
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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

      {/* Booking Summary Modal */}
      {showBookingSummary && selectedVenue && (
        <BookingSummaryModal
          isOpen={showBookingSummary}
          onClose={handleCloseBookingSummary}
          venue={venues.find(v => v.id === selectedVenue)}
          preSelectedDate={filters.selectedDate}
          preSelectedTimeSlot={preSelectedTimeSlot || filters.timeSlot}
        />
      )}

      {/* Scroll to Venues Floating Button */}
      <button
        onClick={() => {
          const venuesSection = document.querySelector('.venues-list-section');
          if (venuesSection) {
            venuesSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="fixed bottom-6 right-6 z-50 group bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-400 hover:to-green-400 text-white p-4 rounded-full shadow-2xl hover:shadow-lime-500/25 transition-all duration-300 transform hover:scale-110 md:hidden"
        title="Xem danh sách sân"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">🏟️</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
        <div className="absolute -top-12 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Xem danh sách sân
        </div>
      </button>
    </div>
  );
};

export default BookingPage;