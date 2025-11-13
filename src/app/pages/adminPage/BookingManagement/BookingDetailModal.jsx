import React from 'react';
import { X, MapPin, Calendar, Clock, User, CreditCard, Phone, Mail } from 'lucide-react';
import './BookingDetailModal.css';

const BookingDetailModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'confirmed': 'Đã xác nhận',
      'pending': 'Đang chờ',
      'cancelled': 'Đã hủy',
      'completed': 'Hoàn tất'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'confirmed': '#10b981',
      'pending': '#f59e0b',
      'cancelled': '#ef4444',
      'completed': '#6366f1'
    };
    return colorMap[status] || '#6b7280';
  };

  const getPaymentStatusText = (status) => {
    const statusMap = {
      'paid': 'Đã thanh toán',
      'pending': 'Chưa thanh toán',
      'partial': 'Thanh toán một phần'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="booking-detail-modal">
      <div className="booking-detail-modal__backdrop" onClick={onClose} />
      <div className="booking-detail-modal__content">
        {/* Header */}
        <div className="booking-detail-modal__header">
          <div className="booking-detail-modal__header-main">
            <h2 className="booking-detail-modal__title">Chi tiết đặt sân</h2>
            <div className="booking-detail-modal__booking-id">
              Mã đặt sân: <strong>#{booking.id}</strong>
            </div>
          </div>
          <button onClick={onClose} className="booking-detail-modal__close">
            <X size={24} />
          </button>
        </div>

        {/* Status Badge */}
        <div className="booking-detail-modal__status-section">
          <div 
            className="booking-detail-modal__status-badge"
            style={{ backgroundColor: getStatusColor(booking.status) }}
          >
            {getStatusText(booking.status)}
          </div>
          <div 
            className="booking-detail-modal__payment-badge"
            style={{ 
              backgroundColor: booking.paymentStatus === 'paid' ? '#10b981' : '#f59e0b',
              opacity: 0.9
            }}
          >
            {getPaymentStatusText(booking.paymentStatus)}
          </div>
        </div>

        {/* Main Content */}
        <div className="booking-detail-modal__body">
          {/* Customer Information */}
          <div className="booking-detail-modal__section">
            <div className="booking-detail-modal__section-header">
              <User size={20} />
              <h3>Thông tin khách hàng</h3>
            </div>
            <div className="booking-detail-modal__info-grid">
              <div className="booking-detail-modal__info-item">
                <span className="booking-detail-modal__info-label">Tên khách hàng:</span>
                <span className="booking-detail-modal__info-value">{booking.userName}</span>
              </div>
              <div className="booking-detail-modal__info-item">
                <span className="booking-detail-modal__info-label">ID khách hàng:</span>
                <span className="booking-detail-modal__info-value">#{booking.userId}</span>
              </div>
            </div>
          </div>

          {/* Field Information */}
          <div className="booking-detail-modal__section">
            <div className="booking-detail-modal__section-header">
              <MapPin size={20} />
              <h3>Thông tin sân</h3>
            </div>
            <div className="booking-detail-modal__info-grid">
              <div className="booking-detail-modal__info-item">
                <span className="booking-detail-modal__info-label">Tên sân:</span>
                <span className="booking-detail-modal__info-value">{booking.fieldName}</span>
              </div>
              <div className="booking-detail-modal__info-item">
                <span className="booking-detail-modal__info-label">Loại sân:</span>
                <span className="booking-detail-modal__info-value">{booking.fieldType}</span>
              </div>
              <div className="booking-detail-modal__info-item">
                <span className="booking-detail-modal__info-label">ID sân:</span>
                <span className="booking-detail-modal__info-value">#{booking.fieldId}</span>
              </div>
            </div>
          </div>

          {/* Booking Time */}
          <div className="booking-detail-modal__section">
            <div className="booking-detail-modal__section-header">
              <Calendar size={20} />
              <h3>Thời gian đặt sân</h3>
            </div>
            <div className="booking-detail-modal__info-grid">
              <div className="booking-detail-modal__info-item booking-detail-modal__info-item--full">
                <span className="booking-detail-modal__info-label">Ngày chơi:</span>
                <span className="booking-detail-modal__info-value">{formatDate(booking.date)}</span>
              </div>
              <div className="booking-detail-modal__info-item">
                <span className="booking-detail-modal__info-label">
                  <Clock size={16} /> Giờ bắt đầu:
                </span>
                <span className="booking-detail-modal__info-value">{booking.time}</span>
              </div>
              <div className="booking-detail-modal__info-item">
                <span className="booking-detail-modal__info-label">Thời lượng:</span>
                <span className="booking-detail-modal__info-value">{booking.duration}h</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="booking-detail-modal__section">
            <div className="booking-detail-modal__section-header">
              <CreditCard size={20} />
              <h3>Thông tin thanh toán</h3>
            </div>
            <div className="booking-detail-modal__info-grid">
              <div className="booking-detail-modal__info-item">
                <span className="booking-detail-modal__info-label">Trạng thái thanh toán:</span>
                <span className="booking-detail-modal__info-value">
                  <span 
                    className="booking-detail-modal__payment-status"
                    style={{ color: booking.paymentStatus === 'paid' ? '#10b981' : '#f59e0b' }}
                  >
                    {getPaymentStatusText(booking.paymentStatus)}
                  </span>
                </span>
              </div>
              <div className="booking-detail-modal__info-item booking-detail-modal__info-item--full">
                <span className="booking-detail-modal__info-label">Tổng tiền:</span>
                <span className="booking-detail-modal__info-value booking-detail-modal__price">
                  {formatCurrency(booking.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="booking-detail-modal__section">
            <div className="booking-detail-modal__section-header">
              <Calendar size={20} />
              <h3>Thông tin bổ sung</h3>
            </div>
            <div className="booking-detail-modal__info-grid">
              <div className="booking-detail-modal__info-item">
                <span className="booking-detail-modal__info-label">Trạng thái đặt sân:</span>
                <span 
                  className="booking-detail-modal__info-value"
                  style={{ color: getStatusColor(booking.status), fontWeight: 600 }}
                >
                  {getStatusText(booking.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="booking-detail-modal__footer">
          <button 
            className="booking-detail-modal__button booking-detail-modal__button--secondary"
            onClick={onClose}
          >
            Đóng
          </button>
          <button 
            className="booking-detail-modal__button booking-detail-modal__button--primary"
            onClick={() => {
              // Handle print or export
              window.print();
            }}
          >
            In thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
