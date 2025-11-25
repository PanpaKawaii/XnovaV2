import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Search, Filter, DollarSign, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { fetchData, putData } from '../../../../mocks/CallingAPI';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import './BookingManagement.css';

const BookingManagement = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [bookingSlots, setBookingSlots] = useState([]);
  const [slots, setSlots] = useState([]);
  const [fields, setFields] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (user?.token) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = user?.token;

      const [bookingsRes, slotsRes, fieldsRes, venuesRes] = await Promise.all([
        fetchData('Booking', token).catch(() => []),
        fetchData('Slot', token).catch(() => []),
        fetchData('Field', token).catch(() => []),
        fetchData('Venue', token).catch(() => [])
      ]);

      const bookingsData = Array.isArray(bookingsRes) ? bookingsRes : [];
      const slotsData = Array.isArray(slotsRes) ? slotsRes : [];
      const fieldsData = Array.isArray(fieldsRes) ? fieldsRes : [];
      const venuesData = Array.isArray(venuesRes) ? venuesRes : [];

      // Filter owner's venues and fields
      const ownerVenues = venuesData.filter(v => v.userId === user.id);
      const ownerVenueIds = ownerVenues.map(v => v.id);
      const ownerFields = fieldsData.filter(f => ownerVenueIds.includes(f.venueId));
      const ownerFieldIds = ownerFields.map(f => f.id);

      // Filter slots and bookings
      const ownerSlots = slotsData.filter(s => ownerFieldIds.includes(s.fieldId));
      const ownerSlotIds = ownerSlots.map(s => s.id);

      // Get bookings with owner's slots
      const ownerBookings = bookingsData.filter(booking => 
        booking.bookingSlots?.some(bs => ownerSlotIds.includes(bs.slotId))
      );

      setBookings(ownerBookings);
      setSlots(ownerSlots);
      setFields(ownerFields);
      setVenues(ownerVenues);

      // Extract booking slots
      const allBookingSlots = ownerBookings.flatMap(booking =>
        (booking.bookingSlots || []).map(bs => ({
          ...bs,
          bookingId: booking.id,
          bookingDate: booking.date,
          bookingStatus: booking.status,
          userId: booking.userId
        }))
      );
      setBookingSlots(allBookingSlots);

    } catch (err) {
      console.error('Error fetching booking data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setProcessingId(bookingId);
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;

      // Get fieldId from first booking slot
      const firstSlot = booking.bookingSlots?.[0];
      const slotDetail = firstSlot ? getSlotDetails(firstSlot.slotId) : null;
      const fieldId = slotDetail?.fieldId || 0;

      // Extract slotIds from bookingSlots
      const slotIds = booking.bookingSlots?.map(bs => bs.slotId) || [];

      // Prepare request body matching API structure
      const requestBody = {
        id: booking.id,
        date: booking.date,
        rating: booking.rating || 0,
        feedback: booking.feedback || "",
        currentDate: new Date().toISOString(),
        status: newStatus,
        userId: booking.userId,
        fieldId: fieldId,
        slotIds: slotIds
      };

      await putData(`Booking/${bookingId}`, requestBody, user.token);
      
      // Update local state
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));

      // Update booking slots
      setBookingSlots(bookingSlots.map(bs =>
        bs.bookingId === bookingId ? { ...bs, bookingStatus: newStatus } : bs
      ));

      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }

      // Show success message
      showSuccessNotification(getStatusChangeMessage(newStatus));

    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Please try again.');
    } finally {
      setProcessingId(null);
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  const getStatusChangeMessage = (status) => {
    const messages = {
      0: 'Booking set to Pending',
      1: 'Booking confirmed successfully',
      2: 'Booking completed successfully',
      3: 'Booking cancelled'
    };
    return messages[status] || 'Status updated';
  };

  const showSuccessNotification = (message) => {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const handleConfirmAction = (bookingId, newStatus, actionName) => {
    setConfirmAction({
      bookingId,
      newStatus,
      actionName
    });
    setShowConfirmModal(true);
  };

  const executeAction = () => {
    if (confirmAction) {
      handleStatusChange(confirmAction.bookingId, confirmAction.newStatus);
    }
  };

  const getSlotDetails = (slotId) => slots.find(s => s.id === slotId);
  const getFieldDetails = (fieldId) => fields.find(f => f.id === fieldId);
  const getVenueDetails = (venueId) => venues.find(v => v.id === venueId);
  const getCustomerInfo = (booking) => {
    // Lấy thông tin customer từ booking object nếu có
    return {
      id: booking.userId,
      name: booking.customerName || booking.userName || `Customer #${booking.userId}`,
      email: booking.customerEmail || booking.userEmail || ''
    };
  };

  const getStatusInfo = (status) => {
    // Backend mapping: 1=Confirmed, 2=Pending, 3=Cancelled, 4=Completed
    const statusMap = {
      1: { label: 'Confirmed', class: 'status-confirmed', color: '#3b82f6' },
      2: { label: 'Pending', class: 'status-pending', color: '#f59e0b' },
      3: { label: 'Cancelled', class: 'status-cancelled', color: '#ef4444' },
      4: { label: 'Completed', class: 'status-completed', color: '#10b981' }
    };
    return statusMap[status] || statusMap[2];
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  const isToday = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    return date.toDateString() === today.toDateString();
  };

  const isFutureDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date > today;
  };

  const filteredBookings = bookings.filter(booking => {
    // Search filter
    const customer = getCustomerInfo(booking);
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      booking.id.toString().includes(searchLower);

    // Status filter
    const matchesStatus = statusFilter === 'all' || booking.status === parseInt(statusFilter);

    // Date filter
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = isToday(booking.date);
    } else if (dateFilter === 'upcoming') {
      matchesDate = isFutureDate(booking.date);
    } else if (dateFilter === 'past') {
      matchesDate = !isFutureDate(booking.date) && !isToday(booking.date);
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const getBookingSlotDetails = (booking) => {
    return (booking.bookingSlots || []).map(bs => {
      const slot = getSlotDetails(bs.slotId);
      const field = slot ? getFieldDetails(slot.fieldId) : null;
      const venue = field ? getVenueDetails(field.venueId) : null;
      return { ...bs, slot, field, venue };
    });
  };

  if (loading) {
    return (
      <div className="booking-management-wrapper">
        <div className="reports-loading">Đang tải dữ liệu booking...</div>
      </div>
    );
  }

  return (
    <div className="booking-management-wrapper">
      <div className="management-header">
        <div className="header-title">
          <Calendar size={32} />
          <div>
            <h1>Booking Management</h1>
            <p>Quản lý và xác nhận các booking</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by customer name, email, or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="0">Pending</option>
            <option value="1">Confirmed</option>
            <option value="2">Completed</option>
            <option value="3">Cancelled</option>
          </select>

          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value">{bookings.filter(b => b.status === 2).length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon confirmed">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Confirmed</p>
            <p className="stat-value">{bookings.filter(b => b.status === 1).length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <p className="stat-value">{bookings.filter(b => b.status === 4).length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cancelled">
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Cancelled</p>
            <p className="stat-value">{bookings.filter(b => b.status === 3).length}</p>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Venue/Field</th>
              <th>Slots</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => {
                const customer = getCustomerInfo(booking);
                const slotDetails = getBookingSlotDetails(booking);
                const totalPrice = slotDetails.reduce((sum, sd) => sum + (sd.slot?.price || 0), 0);
                const statusInfo = getStatusInfo(booking.status);

                return (
                  <tr key={booking.id}>
                    <td className="booking-id">#{booking.id}</td>
                    <td>{new Date(booking.date).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className="customer-cell">
                        <User size={16} />
                        <span>{customer.name}</span>
                      </div>
                    </td>
                    <td>
                      {slotDetails[0]?.venue?.name && (
                        <div className="venue-cell">
                          <MapPin size={14} />
                          <span>{slotDetails[0].venue.name} - {slotDetails[0].field?.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="slots-count">{booking.bookingSlots?.length || 0} slots</td>
                    <td className="price-cell">{formatCurrency(totalPrice)}</td>
                    <td>
                      <span className={`status-badge ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleViewDetails(booking)}
                          className="btn-view"
                        >
                          View
                        </button>
                        
                        {/* Confirm button - for Pending bookings */}
                        {booking.status === 2 && (
                          <button
                            onClick={() => handleConfirmAction(booking.id, 1, 'Confirm')}
                            disabled={processingId === booking.id}
                            className="btn-confirm"
                          >
                            {processingId === booking.id ? 'Processing...' : 'Confirm'}
                          </button>
                        )}
                        
                        {/* Complete button - for Confirmed bookings on or after booking date */}
                        {booking.status === 1 && !isFutureDate(booking.date) && (
                          <button
                            onClick={() => handleConfirmAction(booking.id, 4, 'Complete')}
                            disabled={processingId === booking.id}
                            className="btn-complete"
                          >
                            {processingId === booking.id ? 'Processing...' : 'Complete'}
                          </button>
                        )}
                        
                        {/* Cancel button - for Pending or Confirmed bookings */}
                        {(booking.status === 2 || booking.status === 1) && (
                          <button
                            onClick={() => handleConfirmAction(booking.id, 3, 'Cancel')}
                            disabled={processingId === booking.id}
                            className="btn-cancel"
                          >
                            {processingId === booking.id ? 'Processing...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button onClick={() => setShowDetailModal(false)} className="close-button">
                <XCircle size={24} />
              </button>
            </div>

            <div className="modal-content">
              <div className="booking-info-section">
                <h3>General Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Booking ID:</span>
                    <span className="info-value">#{selectedBooking.id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date:</span>
                    <span className="info-value">
                      {new Date(selectedBooking.date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Customer:</span>
                    <span className="info-value">
                      {getCustomerInfo(selectedBooking).name}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className={`status-badge ${getStatusInfo(selectedBooking.status).class}`}>
                      {getStatusInfo(selectedBooking.status).label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="booking-slots-section">
                <h3>Booked Slots</h3>
                {getBookingSlotDetails(selectedBooking).map((slotDetail, index) => (
                  <div key={index} className="slot-detail-card">
                    <div className="slot-time">
                      <Clock size={18} />
                      <span>{slotDetail.slot?.startTime} - {slotDetail.slot?.endTime}</span>
                    </div>
                    <div className="slot-location">
                      <MapPin size={16} />
                      <span>{slotDetail.venue?.name} - {slotDetail.field?.name}</span>
                    </div>
                    <div className="slot-price">
                      <DollarSign size={16} />
                      <span>{formatCurrency(slotDetail.slot?.price || 0)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                {/* Confirm button */}
                {selectedBooking.status === 2 && (
                  <button
                    onClick={() => {
                      handleConfirmAction(selectedBooking.id, 1, 'Confirm');
                      setShowDetailModal(false);
                    }}
                    className="btn-confirm-large"
                    disabled={processingId === selectedBooking.id}
                  >
                    <CheckCircle size={20} />
                    {processingId === selectedBooking.id ? 'Processing...' : 'Confirm Booking'}
                  </button>
                )}
                
                {/* Complete button */}
                {selectedBooking.status === 1 && !isFutureDate(selectedBooking.date) && (
                  <button
                    onClick={() => {
                      handleConfirmAction(selectedBooking.id, 4, 'Complete');
                      setShowDetailModal(false);
                    }}
                    className="btn-complete-large"
                    disabled={processingId === selectedBooking.id}
                  >
                    <CheckCircle size={20} />
                    {processingId === selectedBooking.id ? 'Processing...' : 'Mark as Completed'}
                  </button>
                )}
                
                {/* Cancel button */}
                {(selectedBooking.status === 2 || selectedBooking.status === 1) && (
                  <button
                    onClick={() => {
                      handleConfirmAction(selectedBooking.id, 3, 'Cancel');
                      setShowDetailModal(false);
                    }}
                    className="btn-cancel-large"
                    disabled={processingId === selectedBooking.id}
                  >
                    <XCircle size={20} />
                    {processingId === selectedBooking.id ? 'Processing...' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && confirmAction && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setConfirmAction(null);
          }}
          onConfirm={executeAction}
          title={`${confirmAction.actionName} Booking`}
          message={`Are you sure you want to ${confirmAction.actionName.toLowerCase()} this booking?`}
          confirmText={confirmAction.actionName}
          cancelText="Cancel"
          type={confirmAction.actionName === 'Cancel' ? 'danger' : 'primary'}
        />
      )}
    </div>
  );
};

export default BookingManagement;
