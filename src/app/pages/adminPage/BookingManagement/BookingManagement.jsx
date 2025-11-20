import React, { useState, useEffect, useMemo } from 'react';
import { Eye, X, Send, Calendar as CalendarIcon } from 'lucide-react';
import { SearchInput } from '../../../components/admincomponents/UI/SearchInput';
import { FilterSelect } from '../../../components/admincomponents/UI/FilterSelect';
import { StatusBadge } from '../../../components/admincomponents/UI/StatusBadge';
import { Button } from '../../../components/admincomponents/UI/Button';
import { fetchData } from '../../../../mocks/CallingAPI.js';
import { useAuth } from '../../../hooks/AuthContext/AuthContext.jsx';
import BookingDetailModal from './BookingDetailModal.jsx';
import './BookingManagement.css';

export const BookingManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Raw data states
  const [bookingsRaw, setBookingsRaw] = useState([]); // Booking
  const [bookingSlots, setBookingSlots] = useState([]); // BookingSlot
  const [slots, setSlots] = useState([]); // Slot
  const [fields, setFields] = useState([]); // Field
  const [users, setUsers] = useState([]); // User
  const [types, setTypes] = useState([]); // Type (field categories)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const token = user.token;
        // Fetch in parallel. Some endpoints may not exist; handle failures gracefully.
        const [bookingsResp, bookingSlotsResp, slotsResp, fieldsResp, usersResp, typesResp] = await Promise.all([
          fetchData('Booking', token).catch(() => []),
          fetchData('BookingSlot', token).catch(() => []),
          fetchData('Slot', token).catch(() => []),
          fetchData('Field', token).catch(() => []),
          fetchData('User', token).catch(() => []),
          fetchData('Type', token).catch(() => [])
        ]);

        setBookingsRaw(Array.isArray(bookingsResp) ? bookingsResp : (bookingsResp ? [bookingsResp] : []));
        setBookingSlots(Array.isArray(bookingSlotsResp) ? bookingSlotsResp : (bookingSlotsResp ? [bookingSlotsResp] : []));
        setSlots(Array.isArray(slotsResp) ? slotsResp : (slotsResp ? [slotsResp] : []));
        setFields(Array.isArray(fieldsResp) ? fieldsResp : (fieldsResp ? [fieldsResp] : []));
        setUsers(Array.isArray(usersResp) ? usersResp : (usersResp ? [usersResp] : []));
  setTypes(Array.isArray(typesResp) ? typesResp : (typesResp ? [typesResp] : []));
      } catch (err) {
        setError(err.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const mapBookingStatus = (s) => {
    // Backend codes assumption: 1=Upcoming/Confirmed, 2=Pending, 3=Cancelled, 4=Completed
    if (s === 1 || s === '1') return 'confirmed';
    if (s === 2 || s === '2') return 'pending';
    if (s === 3 || s === '3') return 'cancelled';
    if (s === 4 || s === '4') return 'completed';
    return 'pending';
  };

  const usersById = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);
  const fieldsById = useMemo(() => new Map(fields.map(f => [f.id, f])), [fields]);
  const slotsById = useMemo(() => new Map(slots.map(s => [s.id, s])), [slots]);
  const typesById = useMemo(() => new Map(types.map(t => [t.id, t])), [types]);
  const bookingSlotsByBooking = useMemo(() => {
    const map = new Map();
    bookingSlots.forEach(bs => {
      if (!map.has(bs.bookingId)) map.set(bs.bookingId, []);
      map.get(bs.bookingId).push(bs);
    });
    return map;
  }, [bookingSlots]);

  const enrichedBookings = useMemo(() => {
    return bookingsRaw.map(bk => {
      const bsList = bookingSlotsByBooking.get(bk.id) || [];
      // Attach slot details
      const detailedSlots = bsList.map(bs => ({ ...bs, slot: slotsById.get(bs.slotId) || null }))
        .sort((a, b) => (a.slot?.startTime || '').localeCompare(b.slot?.startTime || ''));
      const firstSlot = detailedSlots[0]?.slot;
      const durationHours = (detailedSlots.length * 30) / 60; // 30 mins per slot assumption
      const priceSum = detailedSlots.reduce((sum, s) => sum + (Number(s.slot?.price) || 0), 0);
  const field = fieldsById.get(bk.fieldId);
      const userInfo = usersById.get(bk.userId);
      const userName = userInfo?.name || userInfo?.fullName || userInfo?.username || `User ${bk.userId}`;
  const fieldTypeId = field?.typeId ?? field?.fieldTypeId;
  const fieldTypeName = fieldTypeId ? (typesById.get(fieldTypeId)?.name || '—') : (field?.type || field?.sportType || '—');

      // Payment status heuristic
      let paymentStatus = 'pending';
      if (Array.isArray(bk.payments) && bk.payments.length > 0) {
        const paidAmount = bk.payments.reduce((sum, p) => sum + (typeof p.amount === 'number' ? p.amount : 0), 0);
        if (paidAmount >= priceSum && priceSum > 0) paymentStatus = 'paid';
        else if (paidAmount > 0) paymentStatus = 'partial';
      }

      return {
        id: bk.id,
        userId: bk.userId,
        userName,
        fieldId: bk.fieldId,
        fieldName: field?.name || '—',
  fieldType: fieldTypeName,
        date: bk.date || bk.createdAt || null,
        time: firstSlot?.startTime || '—',
        duration: durationHours,
        status: mapBookingStatus(bk.status),
        price: priceSum,
        paymentStatus,
      };
    });
  }, [bookingsRaw, bookingSlotsByBooking, slotsById, fieldsById, usersById]);

  const filteredBookings = enrichedBookings.filter(booking => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = booking.userName.toLowerCase().includes(term) || booking.fieldName.toLowerCase().includes(term);
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedBooking(null);
  };

  const statusOptions = [
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'pending', label: 'Đang chờ' },
    { value: 'cancelled', label: 'Đã hủy' },
    { value: 'completed', label: 'Hoàn tất' }
  ];

  return (
    <div className="ad-booking-page">
      {loading && (
        <div className="ad-owner-page__loading">Đang tải dữ liệu...</div>
      )}
      {error && (
        <div className="ad-booking-page__error">Lỗi: {error}</div>
      )}

      {/* Header */}
      <div className="ad-booking-page__header">
        <h1 className="ad-booking-page__title">
          Quản lý đặt sân
        </h1>
        <div className="ad-booking-page__view-toggle">
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('table')}
            size="sm"
          >
            Bảng
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('calendar')}
            size="sm"
            icon={CalendarIcon}
          >
            Lịch
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="ad-booking-page__filters">
        <SearchInput
          placeholder="Tìm kiếm người dùng hoặc sân..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <FilterSelect
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Lọc theo trạng thái"
        />
        <div className="ad-booking-page__actions">
          <Button variant="primary" size="sm">
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        /* Table View */
        <div className="ad-booking-table">
          <div className="ad-booking-table__wrapper">
            <table className="ad-booking-table__table">
              <thead className="ad-booking-table__head">
                <tr>
                  <th className="ad-booking-table__th">Tên người dùng</th>
                  <th className="ad-booking-table__th">Sân</th>
                  <th className="ad-booking-table__th">Ngày & Giờ</th>
                  <th className="ad-booking-table__th">Trạng thái</th>
                  <th className="ad-booking-table__th">Giá</th>
                  <th className="ad-booking-table__th">Hành động</th>
                </tr>
              </thead>
              <tbody className="ad-booking-table__body">
                {paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="ad-booking-table__row">
                    <td className="ad-booking-table__td">
                      <div className="ad-booking-table__user">
                        <div className="ad-booking-table__user-name">
                          {booking.userName}
                        </div>
                        <div className="ad-booking-table__user-type">
                          {booking.fieldType}
                        </div>
                      </div>
                    </td>
                    <td className="ad-booking-table__td">
                      {booking.fieldName}
                    </td>
                    <td className="ad-booking-table__td">
                      <div className="ad-booking-table__datetime">
                        <div className="ad-booking-table__date">
                          {formatDate(booking.date)}
                        </div>
                        <div className="ad-booking-table__time">
                          {booking.time} ({booking.duration}h)
                        </div>
                      </div>
                    </td>
                    <td className="ad-booking-table__td">
                      <div className="ad-booking-table__badges">
                        <StatusBadge status={booking.status} type="booking" />
                        <StatusBadge status={booking.paymentStatus} type="payment" />
                      </div>
                    </td>
                    <td className="ad-booking-table__td ad-booking-table__td--price">
                      {formatCurrency(booking.price)}
                    </td>
                    <td className="ad-booking-table__td">
                      <div className="ad-booking-table__button-group">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={Eye}
                          onClick={() => handleViewBooking(booking)}
                        >
                          Xem
                        </Button>
                        {/* Hủy button removed as requested */}
                        <Button variant="secondary" size="sm" icon={Send}>
                          Gửi TB
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="ad-booking-pagination">
              <div className="ad-booking-pagination__info">
                Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredBookings.length)} trong tổng số {filteredBookings.length} đặt sân
              </div>
              <div className="ad-booking-pagination__controls">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="ad-booking-pagination__button"
                >
                  Trước
                </button>
                <div className="ad-booking-pagination__pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`ad-booking-pagination__page ${currentPage === page ? 'ad-booking-pagination__page--active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="ad-booking-pagination__button"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Calendar View */
        <div className="ad-booking-calendar">
          <div className="ad-booking-calendar__placeholder">
            <CalendarIcon className="ad-booking-calendar__icon" />
            <h3 className="ad-booking-calendar__title">
              Chế độ xem lịch
            </h3>
            <p className="ad-booking-calendar__description">
              Tính năng xem lịch đặt sân sẽ được triển khai trong phiên bản tiếp theo
            </p>
          </div>
        </div>
      )}
      
      {/* Booking Detail Modal */}
      <BookingDetailModal 
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        booking={selectedBooking}
      />
    </div>
  );
};
