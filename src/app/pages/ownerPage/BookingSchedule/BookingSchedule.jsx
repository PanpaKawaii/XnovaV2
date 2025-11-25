import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, MapPin, DollarSign, X } from 'lucide-react';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { fetchData } from '../../../../mocks/CallingAPI';
import './BookingSchedule.css';

const BookingSchedule = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [bookingSlots, setBookingSlots] = useState([]);
  const [slots, setSlots] = useState([]);
  const [fields, setFields] = useState([]);
  const [venues, setVenues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch all data
  useEffect(() => {
    if (user?.token) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = user?.token;

      const [bookingsRes, slotsRes, fieldsRes, venuesRes, usersRes] = await Promise.all([
        fetchData('Booking', token).catch(() => []),
        fetchData('Slot', token).catch(() => []),
        fetchData('Field', token).catch(() => []),
        fetchData('Venue', token).catch(() => []),
        fetchData('User', token).catch(() => [])
      ]);

      // Normalize data
      const bookingsData = Array.isArray(bookingsRes) ? bookingsRes : [];
      const slotsData = Array.isArray(slotsRes) ? slotsRes : [];
      const fieldsData = Array.isArray(fieldsRes) ? fieldsRes : [];
      const venuesData = Array.isArray(venuesRes) ? venuesRes : [];
      const usersData = Array.isArray(usersRes) ? usersRes : [];

      // Filter owner's venues and fields
      const ownerVenues = venuesData.filter(v => v.userId === user.id);
      const ownerVenueIds = ownerVenues.map(v => v.id);
      const ownerFields = fieldsData.filter(f => ownerVenueIds.includes(f.venueId));
      const ownerFieldIds = ownerFields.map(f => f.id);

      // Filter slots belonging to owner's fields
      const ownerSlots = slotsData.filter(s => ownerFieldIds.includes(s.fieldId));
      const ownerSlotIds = ownerSlots.map(s => s.id);

      // Extract booking slots from bookings
      const allBookingSlots = bookingsData.flatMap(booking =>
        (booking.bookingSlots || []).map(bs => ({
          ...bs,
          bookingId: booking.id,
          bookingDate: booking.date,
          bookingStatus: booking.status,
          userId: booking.userId
        }))
      );

      // Filter booking slots that belong to owner's slots
      const ownerBookingSlots = allBookingSlots.filter(bs => ownerSlotIds.includes(bs.slotId));

      setBookings(bookingsData);
      setBookingSlots(ownerBookingSlots);
      setSlots(ownerSlots);
      setFields(ownerFields);
      setVenues(ownerVenues);
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching booking data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Navigate months
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Get days in month
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty slots for days before month starts (adjust for Monday start)
    const startPadding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return bookingSlots.filter(bs => {
      const bookingDate = new Date(bs.bookingDate).toISOString().split('T')[0];
      return bookingDate === dateStr;
    });
  };

  // Check if date is today
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is in current month
  const isCurrentMonth = (date) => {
    if (!date) return false;
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  };

  // Handle date click to show details
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowDetailModal(true);
  };

  // Get slot details
  const getSlotDetails = (slotId) => {
    return slots.find(s => s.id === slotId);
  };

  // Get field details
  const getFieldDetails = (fieldId) => {
    return fields.find(f => f.id === fieldId);
  };

  // Get venue details
  const getVenueDetails = (venueId) => {
    return venues.find(v => v.id === venueId);
  };

  // Get user details
  const getUserDetails = (userId) => {
    return users.find(u => u.id === userId);
  };

  // Get detailed bookings for selected date
  const getDetailedBookingsForDate = () => {
    if (!selectedDate) return [];

    const dateBookings = getBookingsForDate(selectedDate);
    
    return dateBookings.map(bs => {
      const slot = getSlotDetails(bs.slotId);
      const field = slot ? getFieldDetails(slot.fieldId) : null;
      const venue = field ? getVenueDetails(field.venueId) : null;
      const userInfo = getUserDetails(bs.userId);

      return {
        ...bs,
        slot,
        field,
        venue,
        userInfo
      };
    }).sort((a, b) => {
      if (!a.slot || !b.slot) return 0;
      return a.slot.startTime.localeCompare(b.slot.startTime);
    });
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      0: { label: 'Pending', class: 'status-pending' },
      1: { label: 'Confirmed', class: 'status-confirmed' },
      2: { label: 'Completed', class: 'status-completed' },
      3: { label: 'Cancelled', class: 'status-cancelled' }
    };
    return statusMap[status] || statusMap[0];
  };

  const monthDays = getDaysInMonth();
  const detailedBookings = getDetailedBookingsForDate();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (loading) {
    return (
      <div className="booking-schedule-wrapper">
        <div className="reports-loading">Đang tải lịch đặt sân...</div>
      </div>
    );
  }

  return (
    <div className="booking-schedule-wrapper">
      <div className="schedule-header">
        <div className="header-title">
          <Calendar size={32} />
          <div>
            <h1>Booking Schedule</h1>
            <p>Quản lý lịch đặt sân theo tháng</p>
          </div>
        </div>

        <div className="month-navigation">
          <button onClick={goToPreviousMonth} className="nav-button">
            <ChevronLeft size={20} />
            Previous
          </button>
          <button onClick={goToToday} className="today-button">
            Today
          </button>
          <button onClick={goToNextMonth} className="nav-button">
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="month-overview">
        <h2 className="month-title">
          {currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
        </h2>
      </div>

      {/* Week day headers */}
      <div className="calendar-weekdays">
        {weekDays.map((day, index) => (
          <div key={index} className="weekday-header">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-month-grid">
        {monthDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="calendar-day empty" />;
          }

          const dayBookings = getBookingsForDate(day);
          const today = isToday(day);
          const currentMonthDay = isCurrentMonth(day);

          return (
            <div
              key={index}
              className={`calendar-day ${today ? 'today' : ''} ${!currentMonthDay ? 'other-month' : ''} ${dayBookings.length > 0 ? 'has-bookings' : ''}`}
              onClick={() => dayBookings.length > 0 && handleDateClick(day)}
            >
              <div className="day-number">{day.getDate()}</div>
              
              {dayBookings.length > 0 && (
                <div className="day-bookings">
                  <span className="booking-badge">{dayBookings.length}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedDate && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                Bookings for {selectedDate.toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              <button onClick={() => setShowDetailModal(false)} className="close-button">
                <X size={24} />
              </button>
            </div>

            <div className="modal-content">
              {detailedBookings.length > 0 ? (
                <div className="bookings-list">
                  {detailedBookings.map((booking, index) => {
                    const statusInfo = getStatusBadge(booking.bookingStatus);
                    
                    return (
                      <div key={index} className="booking-item">
                        <div className="booking-item-header">
                          <div className="time-info">
                            <Clock size={18} />
                            <span className="time-range">
                              {booking.slot?.startTime} - {booking.slot?.endTime}
                            </span>
                          </div>
                          <span className={`status-badge ${statusInfo.class}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="booking-item-body">
                          <div className="booking-info-row">
                            <MapPin size={16} />
                            <div className="booking-info-text">
                              <span className="info-label">Venue & Field:</span>
                              <span className="info-value">
                                {booking.venue?.name} - {booking.field?.name}
                              </span>
                            </div>
                          </div>

                          <div className="booking-info-row">
                            <User size={16} />
                            <div className="booking-info-text">
                              <span className="info-label">Customer:</span>
                              <span className="info-value">
                                {booking.userInfo?.name || booking.userInfo?.email || 'N/A'}
                              </span>
                            </div>
                          </div>

                          <div className="booking-info-row">
                            <DollarSign size={16} />
                            <div className="booking-info-text">
                              <span className="info-label">Price:</span>
                              <span className="info-value">
                                {formatCurrency(booking.slot?.price || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-bookings-message">
                  <p>Không có booking nào trong ngày này</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSchedule;
