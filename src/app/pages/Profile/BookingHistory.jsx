// BookingHistory.jsx
import React, { useState } from 'react';
import { Calendar, Filter, MapPin, Clock, DollarSign } from 'lucide-react';
import { useTheme } from '../../hooks/ThemeContext';
import './BookingHistory.css';

const BookingHistory = () => {
  const { isDarkMode } = useTheme();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const bookings = [
  {
    id: '1',
    fieldName: 'Central Park Field',
    date: '2025-07-10',
    time: '14:00',
    duration: '2h',
    price: 80,
    status: 'completed'
  },
  {
    id: '2',
    fieldName: 'Riverside Stadium',
    date: '2025-07-15',
    time: '18:00',
    duration: '1.5h',
    price: 60,
    status: 'upcoming'
  },
  {
    id: '3',
    fieldName: 'City Arena',
    date: '2025-06-20',
    time: '10:00',
    duration: '1h',
    price: 40,
    status: 'cancelled'
  },
  {
    id: '4',
    fieldName: 'Downtown Pitch',
    date: '2025-07-05',
    time: '16:00',
    duration: '2h',
    price: 75,
    status: 'completed'
  },
  {
    id: '5',
    fieldName: 'Alexandria Stadium',
    date: '2025-07-06',
    time: '12:00',
    duration: '2h',
    price: 75,
    status: 'completed'
  },
  {
    id: '6',
    fieldName: 'Mina Jetsica',
    date: '2025-07-06',
    time: '12:00',
    duration: '2h',
    price: 75,
    status: 'completed'
  },
  {
    id: '7',
    fieldName: 'Mina Jetsica',
    date: '2025-07-06',
    time: '12:00',
    duration: '2h',
    price: 75,
    status: 'completed'
  }
];
  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  return (
    <div className={`booking-history${isDarkMode ? ' dark' : ''}`}>
      <div className="header">
        <Calendar className="header-icon" />
        <h3 className="title">
          Booking History
        </h3>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label className="label">
            Filter by Status
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select"
          >
            <option value="all">All Bookings</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="label">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select"
          >
            <option value="date">Date</option>
            <option value="field">Field Name</option>
          </select>
        </div>
      </div>

      {/* Booking Cards */}
      <div className="booking-list-container">
        <div className="booking-list">
          {sortedBookings.map((booking) => (
            <div
              key={booking.id}
              className="booking-card"
            >
              <div className="card-content">
                <div className="field-info">
                  <div className="field-name">
                    <MapPin className="map-icon" />
                    <h4 className="field-title">
                      {booking.fieldName}
                    </h4>
                  </div>
                  <div className="details">
                    <div className="date">
                      <Calendar className="date-icon" />
                      <span>
                        {new Date(booking.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="time">
                      <Clock className="time-icon" />
                      <span>
                        {booking.time} ({booking.duration})
                      </span>
                    </div>
                  </div>
                </div>
                <div className="price-status">
                  <div className="price">
                    <DollarSign className="dollar-icon" />
                    <span className="price-amount">
                      ${booking.price}
                    </span>
                  </div>
                  <span className={`status ${booking.status}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sortedBookings.length === 0 && (
        <div className="no-bookings">
          <Calendar className="no-bookings-icon" />
          <p>No bookings found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;