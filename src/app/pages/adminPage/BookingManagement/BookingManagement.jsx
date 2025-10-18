import React, { useState } from 'react';
import { Eye, X, Send, Calendar as CalendarIcon } from 'lucide-react';
import { SearchInput } from '../../../components/admincomponents/UI/SearchInput';
import { FilterSelect } from '../../../components/admincomponents/UI/FilterSelect';
import { StatusBadge } from '../../../components/admincomponents/UI/StatusBadge';
import { Button } from '../../../components/admincomponents/UI/Button';
import './BookingManagement.css';

// Inlined bookings
const mockBookings = [
  {
    id: 'BK001',
    userId: '1',
    userName: 'Nguyễn Văn An',
    fieldId: 'F001',
    fieldName: 'Sân bóng đá số 1',
    fieldType: 'Bóng đá',
    date: '2024-12-15',
    time: '09:00',
    duration: 2,
    status: 'confirmed',
    price: 200000,
    paymentStatus: 'paid'
  },
  {
    id: 'BK002',
    userId: '2',
    userName: 'Trần Thị Bình',
    fieldId: 'F002',
    fieldName: 'Sân cầu lông A',
    fieldType: 'Cầu lông',
    date: '2024-12-15',
    time: '14:00',
    duration: 1,
    status: 'pending',
    price: 80000,
    paymentStatus: 'pending'
  },
  {
    id: 'BK003',
    userId: '3',
    userName: 'Lê Minh Cường',
    fieldId: 'F003',
    fieldName: 'Sân tennis 1',
    fieldType: 'Tennis',
    date: '2024-12-16',
    time: '16:00',
    duration: 1.5,
    status: 'confirmed',
    price: 150000,
    paymentStatus: 'paid'
  }
];

export const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('table');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.fieldName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'pending', label: 'Đang chờ' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  return (
    <div className="ad-booking-page">
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
                  <th className="ad-booking-table__th">ID đặt sân</th>
                  <th className="ad-booking-table__th">Tên người dùng</th>
                  <th className="ad-booking-table__th">Sân</th>
                  <th className="ad-booking-table__th">Ngày & Giờ</th>
                  <th className="ad-booking-table__th">Trạng thái</th>
                  <th className="ad-booking-table__th">Giá</th>
                  <th className="ad-booking-table__th">Hành động</th>
                </tr>
              </thead>
              <tbody className="ad-booking-table__body">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="ad-booking-table__row">
                    <td className="ad-booking-table__td ad-booking-table__td--id">
                      {booking.id}
                    </td>
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
                        <Button variant="ghost" size="sm" icon={Eye}>
                          Xem
                        </Button>
                        {booking.status === 'confirmed' && (
                          <Button variant="danger" size="sm" icon={X}>
                            Hủy
                          </Button>
                        )}
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
    </div>
  );
};
