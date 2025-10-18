import React, { useState } from 'react';
import { Plus, Edit, ToggleLeft, ToggleRight, Activity, MapPin } from 'lucide-react';
import { SearchInput } from '../../components/admincomponents/UI/SearchInput';
import { FilterSelect } from '../../components/admincomponents/UI/FilterSelect';
import { StatusBadge } from '../../components/admincomponents/UI/StatusBadge';
import { Button } from '../../components/admincomponents/UI/Button';
import './FieldManagement.css';

// Inlined fields
const mockFields = [
  {
    id: 'F001',
    name: 'Sân bóng đá số 1',
    type: 'Bóng đá',
    location: 'Quận 1, TP.HCM',
    status: 'active',
    pricePerHour: 100000,
    description: 'Sân bóng đá cỏ tự nhiên, đạt chuẩn FIFA',
    utilizationRate: 75,
    totalBookings: 45
  },
  {
    id: 'F002',
    name: 'Sân cầu lông A',
    type: 'Cầu lông',
    location: 'Quận 3, TP.HCM',
    status: 'active',
    pricePerHour: 80000,
    description: 'Sân cầu lông trong nhà, đầy đủ tiện nghi',
    utilizationRate: 60,
    totalBookings: 32
  },
  {
    id: 'F003',
    name: 'Sân tennis 1',
    type: 'Tennis',
    location: 'Quận 7, TP.HCM',
    status: 'inactive',
    pricePerHour: 120000,
    description: 'Sân tennis ngoài trời, mặt sân bê tông',
    utilizationRate: 40,
    totalBookings: 18
  }
];

export const FieldManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  const filteredFields = mockFields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || field.status === statusFilter;
    const matchesType = !typeFilter || field.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const statusOptions = [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' }
  ];

  const typeOptions = [
    { value: 'Bóng đá', label: 'Bóng đá' },
    { value: 'Cầu lông', label: 'Cầu lông' },
    { value: 'Tennis', label: 'Tennis' }
  ];

  return (
    <div className="ad-field-page">
      {/* Header */}
      <div className="ad-field-page__header">
        <h1 className="ad-field-page__title">
          Quản lý sân
        </h1>
        <Button variant="primary" icon={Plus}>
          Thêm sân mới
        </Button>
      </div>

      {/* Filters */}
      <div className="ad-field-page__filters">
        <SearchInput
          placeholder="Tìm kiếm tên sân hoặc địa điểm..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <FilterSelect
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Lọc theo trạng thái"
        />
        <FilterSelect
          options={typeOptions}
          value={typeFilter}
          onChange={setTypeFilter}
          placeholder="Lọc theo loại sân"
        />
        <Button variant="secondary" size="sm">
          Xuất danh sách
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="ad-field-page__stats">
        <div className="ad-field-page__stat-card">
          <div className="ad-field-page__stat-icon ad-field-page__stat-icon--blue">
            <MapPin className="ad-field-page__icon" />
          </div>
          <div className="ad-field-page__stat-content">
            <p className="ad-field-page__stat-label">Tổng số sân</p>
            <p className="ad-field-page__stat-value">{mockFields.length}</p>
          </div>
        </div>
        <div className="ad-field-page__stat-card">
          <div className="ad-field-page__stat-icon ad-field-page__stat-icon--green">
            <Activity className="ad-field-page__icon" />
          </div>
          <div className="ad-field-page__stat-content">
            <p className="ad-field-page__stat-label">Đang hoạt động</p>
            <p className="ad-field-page__stat-value">
              {mockFields.filter(f => f.status === 'active').length}
            </p>
          </div>
        </div>
        <div className="ad-field-page__stat-card">
          <div className="ad-field-page__stat-icon ad-field-page__stat-icon--yellow">
            <Activity className="ad-field-page__icon" />
          </div>
          <div className="ad-field-page__stat-content">
            <p className="ad-field-page__stat-label">Tỷ lệ sử dụng TB</p>
            <p className="ad-field-page__stat-value">
              {Math.round(mockFields.reduce((sum, f) => sum + f.utilizationRate, 0) / mockFields.length)}%
            </p>
          </div>
        </div>
        <div className="ad-field-page__stat-card">
          <div className="ad-field-page__stat-icon ad-field-page__stat-icon--purple">
            <Activity className="ad-field-page__icon" />
          </div>
          <div className="ad-field-page__stat-content">
            <p className="ad-field-page__stat-label">Tổng đặt sân</p>
            <p className="ad-field-page__stat-value">
              {mockFields.reduce((sum, f) => sum + f.totalBookings, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Fields Grid */}
      <div className="ad-field-page__grid">
        {filteredFields.map((field) => (
          <div key={field.id} className="ad-field-card">
            <div className="ad-field-card__header">
              <div className="ad-field-card__info">
                <h3 className="ad-field-card__name">
                  {field.name}
                </h3>
                <p className="ad-field-card__location">
                  {field.type} • {field.location}
                </p>
              </div>
              <StatusBadge status={field.status} type="field" />
            </div>

            <div className="ad-field-card__details">
              <div className="ad-field-card__detail-row">
                <span className="ad-field-card__detail-label">Giá/giờ:</span>
                <span className="ad-field-card__detail-value">
                  {formatCurrency(field.pricePerHour)}
                </span>
              </div>
              <div className="ad-field-card__detail-row">
                <span className="ad-field-card__detail-label">Tỷ lệ sử dụng:</span>
                <span className="ad-field-card__detail-value">
                  {field.utilizationRate}%
                </span>
              </div>
              <div className="ad-field-card__detail-row">
                <span className="ad-field-card__detail-label">Tổng đặt sân:</span>
                <span className="ad-field-card__detail-value">
                  {field.totalBookings} lần
                </span>
              </div>
            </div>

            {/* Utilization Progress Bar */}
            <div className="ad-field-card__progress-wrapper">
              <div className="ad-field-card__progress-bar">
                <div 
                  className="ad-field-card__progress-fill"
                  style={{ width: `${field.utilizationRate}%` }}
                ></div>
              </div>
            </div>

            <p className="ad-field-card__description">
              {field.description}
            </p>

            <div className="ad-field-card__actions">
              <div className="ad-field-card__button-group">
                <Button variant="ghost" size="sm" icon={Edit}>
                  Sửa
                </Button>
                <Button variant="ghost" size="sm" icon={Activity}>
                  Lịch sử
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                icon={field.status === 'active' ? ToggleRight : ToggleLeft}
              >
                {field.status === 'active' ? 'Tắt' : 'Bật'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
