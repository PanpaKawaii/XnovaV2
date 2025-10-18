import React, { useState } from 'react';
import { UserPlus, Edit, Lock, Unlock, Activity } from 'lucide-react';
import { SearchInput } from '../../components/admincomponents/UI/SearchInput';
import { FilterSelect } from '../../components/admincomponents/UI/FilterSelect';
import { StatusBadge } from '../../components/admincomponents/UI/StatusBadge';
import { Button } from '../../components/admincomponents/UI/Button';
import './UserManagement.css';

// Inlined mock users
const mockUsers = [
  {
    id: '1',
    name: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    phone: '0901234567',
    registrationDate: '2024-01-15',
    status: 'active',
    bookingsCount: 12,
    userType: 'customer'
  },
  {
    id: '2',
    name: 'Lê Minh Cường',
    email: 'cuong.le@email.com',
    phone: '0912345678',
    registrationDate: '2024-02-20',
    status: 'active',
    bookingsCount: 8,
    userType: 'customer'
  },
  {
    id: '3',
    name: 'Phạm Thu Hà',
    email: 'ha.pham@email.com',
    phone: '0923456789',
    registrationDate: '2024-03-10',
    status: 'inactive',
    bookingsCount: 3,
    userType: 'customer'
  },
  {
    id: '4',
    name: 'Võ Đình Nam',
    email: 'nam.vo@email.com',
    phone: '0934567890',
    registrationDate: '2024-03-25',
    status: 'active',
    bookingsCount: 15,
    userType: 'customer'
  }
];

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' }
  ];

  return (
    <div className="ad-user-page">
      {/* Header */}
      <div className="ad-user-page__header">
        <h1 className="ad-user-page__title">
          Quản lý khách hàng
        </h1>
        <Button variant="primary" icon={UserPlus}>
          Thêm khách hàng
        </Button>
      </div>

      {/* Filters */}
      <div className="ad-user-page__filters">
        <SearchInput
          placeholder="Tìm kiếm tên hoặc email..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <FilterSelect
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Lọc theo trạng thái"
        />
        <div className="ad-user-page__actions">
          <Button variant="secondary" size="sm">
            Xuất danh sách
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ad-user-page__stats">
        <div className="ad-user-page__stat-card">
          <div className="ad-user-page__stat-icon ad-user-page__stat-icon--blue">
            <Activity className="ad-user-page__icon" />
          </div>
          <div className="ad-user-page__stat-content">
            <p className="ad-user-page__stat-label">Tổng khách hàng</p>
            <p className="ad-user-page__stat-value">{mockUsers.length}</p>
          </div>
        </div>
        <div className="ad-user-page__stat-card">
          <div className="ad-user-page__stat-icon ad-user-page__stat-icon--green">
            <Activity className="ad-user-page__icon" />
          </div>
          <div className="ad-user-page__stat-content">
            <p className="ad-user-page__stat-label">Đang hoạt động</p>
            <p className="ad-user-page__stat-value">
              {mockUsers.filter(u => u.status === 'active').length}
            </p>
          </div>
        </div>
        <div className="ad-user-page__stat-card">
          <div className="ad-user-page__stat-icon ad-user-page__stat-icon--yellow">
            <Activity className="ad-user-page__icon" />
          </div>
          <div className="ad-user-page__stat-content">
            <p className="ad-user-page__stat-label">Khách hàng mới (tháng này)</p>
            <p className="ad-user-page__stat-value">12</p>
          </div>
        </div>
        <div className="ad-user-page__stat-card">
          <div className="ad-user-page__stat-icon ad-user-page__stat-icon--purple">
            <Activity className="ad-user-page__icon" />
          </div>
          <div className="ad-user-page__stat-content">
            <p className="ad-user-page__stat-label">Trung bình đặt sân/người</p>
            <p className="ad-user-page__stat-value">
              {Math.round(mockUsers.reduce((sum, u) => sum + u.bookingsCount, 0) / mockUsers.length)}
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="ad-user-table">
        <div className="ad-user-table__wrapper">
          <table className="ad-user-table__table">
            <thead className="ad-user-table__head">
              <tr>
                <th className="ad-user-table__th">Tên</th>
                <th className="ad-user-table__th">Email</th>
                <th className="ad-user-table__th">Số điện thoại</th>
                <th className="ad-user-table__th">Ngày đăng ký</th>
                <th className="ad-user-table__th">Số lần đặt</th>
                <th className="ad-user-table__th">Trạng thái</th>
                <th className="ad-user-table__th">Hành động</th>
              </tr>
            </thead>
            <tbody className="ad-user-table__body">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="ad-user-table__row">
                  <td className="ad-user-table__td">
                    <div className="ad-user-table__user">
                      <div className="ad-user-table__avatar">
                        <span className="ad-user-table__avatar-text">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ad-user-table__user-info">
                        <div className="ad-user-table__user-name">
                          {user.name}
                        </div>
                        <div className="ad-user-table__user-role">
                          Khách hàng
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="ad-user-table__td">
                    {user.email}
                  </td>
                  <td className="ad-user-table__td">
                    {user.phone}
                  </td>
                  <td className="ad-user-table__td">
                    {formatDate(user.registrationDate)}
                  </td>
                  <td className="ad-user-table__td">
                    <span className="ad-user-table__badge">
                      {user.bookingsCount} lần
                    </span>
                  </td>
                  <td className="ad-user-table__td">
                    <StatusBadge status={user.status} type="user" />
                  </td>
                  <td className="ad-user-table__td">
                    <div className="ad-user-table__button-group">
                      <Button variant="ghost" size="sm" icon={Edit}>
                        Sửa
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={user.status === 'active' ? Lock : Unlock}
                      >
                        {user.status === 'active' ? 'Khóa' : 'Mở'}
                      </Button>
                      <Button variant="ghost" size="sm" icon={Activity}>
                        Lịch sử
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
