import React, { useState } from 'react';
import { UserPlus, Edit, Lock, Unlock, Activity, Building, FileText, DollarSign } from 'lucide-react';
import { SearchInput } from '../../components/admincomponents/UI/SearchInput';
import { FilterSelect } from '../../components/admincomponents/UI/FilterSelect';
import { StatusBadge } from '../../components/admincomponents/UI/StatusBadge';
import { Button } from '../../components/admincomponents/UI/Button';
import './FieldOwnerManagement.css';

// Inlined field owners
const mockFieldOwners = [
  {
    id: 'FO001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@sportfield.com',
    phone: '0901234567',
    businessName: 'Sân Thể Thao An Phát',
    businessLicense: 'GP001234567',
    registrationDate: '2024-01-10',
    status: 'active',
    fieldsCount: 5,
    commissionRate: 15,
    totalRevenue: 45000000,
    userType: 'fieldOwner'
  },
  {
    id: 'FO002',
    name: 'Trần Minh Tuấn',
    email: 'tuan.tran@sportcenter.com',
    phone: '0912345678',
    businessName: 'Trung Tâm Thể Thao Tuấn Minh',
    businessLicense: 'GP002345678',
    registrationDate: '2024-02-15',
    status: 'active',
    fieldsCount: 8,
    commissionRate: 12,
    totalRevenue: 68000000,
    userType: 'fieldOwner'
  },
  {
    id: 'FO003',
    name: 'Lê Thị Hương',
    email: 'huong.le@fieldsport.com',
    phone: '0923456789',
    businessName: 'Sân Vận Động Hương Lê',
    businessLicense: 'GP003456789',
    registrationDate: '2024-03-01',
    status: 'pending',
    fieldsCount: 3,
    commissionRate: 18,
    totalRevenue: 22000000,
    userType: 'fieldOwner'
  }
];

export const FieldOwnerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  const filteredFieldOwners = mockFieldOwners.filter(owner => {
    const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         owner.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         owner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || owner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' },
    { value: 'pending', label: 'Chờ duyệt' }
  ];

  return (
    <div className="ad-owner-page">
      {/* Header */}
      <div className="ad-owner-page__header">
        <h1 className="ad-owner-page__title">
          Quản lý chủ sân
        </h1>
        <Button variant="primary" icon={UserPlus}>
          Thêm chủ sân
        </Button>
      </div>

      {/* Filters */}
      <div className="ad-owner-page__filters">
        <SearchInput
          placeholder="Tìm kiếm tên hoặc doanh nghiệp..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <FilterSelect
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Lọc theo trạng thái"
        />
        <div className="ad-owner-page__actions">
          <Button variant="secondary" size="sm">
            Xuất danh sách
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ad-owner-page__stats">
        <div className="ad-owner-page__stat-card">
          <div className="ad-owner-page__stat-icon ad-owner-page__stat-icon--blue">
            <Building className="ad-owner-page__icon" />
          </div>
          <div className="ad-owner-page__stat-content">
            <p className="ad-owner-page__stat-label">Tổng chủ sân</p>
            <p className="ad-owner-page__stat-value">{mockFieldOwners.length}</p>
          </div>
        </div>
        <div className="ad-owner-page__stat-card">
          <div className="ad-owner-page__stat-icon ad-owner-page__stat-icon--green">
            <Activity className="ad-owner-page__icon" />
          </div>
          <div className="ad-owner-page__stat-content">
            <p className="ad-owner-page__stat-label">Đang hoạt động</p>
            <p className="ad-owner-page__stat-value">
              {mockFieldOwners.filter(o => o.status === 'active').length}
            </p>
          </div>
        </div>
        <div className="ad-owner-page__stat-card">
          <div className="ad-owner-page__stat-icon ad-owner-page__stat-icon--yellow">
            <FileText className="ad-owner-page__icon" />
          </div>
          <div className="ad-owner-page__stat-content">
            <p className="ad-owner-page__stat-label">Chờ duyệt</p>
            <p className="ad-owner-page__stat-value">
              {mockFieldOwners.filter(o => o.status === 'pending').length}
            </p>
          </div>
        </div>
        <div className="ad-owner-page__stat-card">
          <div className="ad-owner-page__stat-icon ad-owner-page__stat-icon--purple">
            <DollarSign className="ad-owner-page__icon" />
          </div>
          <div className="ad-owner-page__stat-content">
            <p className="ad-owner-page__stat-label">Tổng doanh thu</p>
            <p className="ad-owner-page__stat-value">
              {formatCurrency(mockFieldOwners.reduce((sum, o) => sum + o.totalRevenue, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Field Owners Table */}
      <div className="ad-owner-table">
        <div className="ad-owner-table__wrapper">
          <table className="ad-owner-table__table">
            <thead className="ad-owner-table__head">
              <tr>
                <th className="ad-owner-table__th">Chủ sân</th>
                <th className="ad-owner-table__th">Doanh nghiệp</th>
                <th className="ad-owner-table__th">Liên hệ</th>
                <th className="ad-owner-table__th">Số sân</th>
                <th className="ad-owner-table__th">Hoa hồng</th>
                <th className="ad-owner-table__th">Doanh thu</th>
                <th className="ad-owner-table__th">Trạng thái</th>
                <th className="ad-owner-table__th">Hành động</th>
              </tr>
            </thead>
            <tbody className="ad-owner-table__body">
              {filteredFieldOwners.map((owner) => (
                <tr key={owner.id} className="ad-owner-table__row">
                  <td className="ad-owner-table__td">
                    <div className="ad-owner-table__owner">
                      <div className="ad-owner-table__avatar">
                        <span className="ad-owner-table__avatar-text">
                          {owner.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ad-owner-table__owner-info">
                        <div className="ad-owner-table__owner-name">
                          {owner.name}
                        </div>
                        <div className="ad-owner-table__owner-id">
                          ID: {owner.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="ad-owner-table__td">
                    <div className="ad-owner-table__business-name">
                      {owner.businessName}
                    </div>
                    <div className="ad-owner-table__business-license">
                      GP: {owner.businessLicense}
                    </div>
                  </td>
                  <td className="ad-owner-table__td">
                    <div className="ad-owner-table__contact-email">
                      {owner.email}
                    </div>
                    <div className="ad-owner-table__contact-phone">
                      {owner.phone}
                    </div>
                  </td>
                  <td className="ad-owner-table__td">
                    <span className="ad-owner-table__badge">
                      {owner.fieldsCount} sân
                    </span>
                  </td>
                  <td className="ad-owner-table__td">
                    {owner.commissionRate}%
                  </td>
                  <td className="ad-owner-table__td ad-owner-table__td--price">
                    {formatCurrency(owner.totalRevenue)}
                  </td>
                  <td className="ad-owner-table__td">
                    <StatusBadge status={owner.status} type="user" />
                  </td>
                  <td className="ad-owner-table__td">
                    <div className="ad-owner-table__button-group">
                      <Button variant="ghost" size="sm" icon={Edit}>
                        Sửa
                      </Button>
                      {owner.status === 'pending' && (
                        <Button variant="primary" size="sm">
                          Duyệt
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={owner.status === 'active' ? Lock : Unlock}
                      >
                        {owner.status === 'active' ? 'Khóa' : 'Mở'}
                      </Button>
                      <Button variant="ghost" size="sm" icon={Activity}>
                        Chi tiết
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
