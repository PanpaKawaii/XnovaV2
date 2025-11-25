import React from 'react';
import clsx from 'clsx';
import './StatusBadge.css';

export const StatusBadge = ({ status, type = 'booking' }) => {
  const getStatusText = () => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Đang chờ';
      case 'cancelled': return 'Đã hủy';
      case 'completed': return 'Hoàn tất';
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'paid': return 'Đã thanh toán';
      case 'failed': return 'Thất bại';
      default: return status;
    }
  };

  return (
    <span className={clsx(
      'ad-status-badge',
      `ad-status-badge--${type}`,
      `ad-status-badge--${status}`
    )}>
      {getStatusText()}
    </span>
  );
};
