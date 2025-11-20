import React, { useEffect, useMemo, useState } from 'react';
import { UserPlus, Edit, Lock, Unlock, Activity } from 'lucide-react';
import { SearchInput } from '../../../components/admincomponents/UI/SearchInput';
import { FilterSelect } from '../../../components/admincomponents/UI/FilterSelect';
import { StatusBadge } from '../../../components/admincomponents/UI/StatusBadge';
import { Button } from '../../../components/admincomponents/UI/Button';
import { fetchData } from '../../../../mocks/CallingAPI.js';
import { useAuth } from '../../../hooks/AuthContext/AuthContext.jsx';
import './UserManagement.css';

const normalizeText = (value) => (value ?? '').toString().trim().toLowerCase();

const hasCustomerRole = (record) => {
  const directRole = normalizeText(record.role || record.userType || record.type || record.description);
  if (['customer', 'khách hàng', 'khach hang'].includes(directRole)) return true;
  if (Array.isArray(record.roles)) {
    return record.roles.some((role) => {
      const roleName = normalizeText(role?.name || role);
      return ['customer', 'khách hàng', 'khach hang'].includes(roleName);
    });
  }
  return false;
};

const mapUserStatus = (value) => {
  if (value === null || value === undefined) return 'inactive';
  if (typeof value === 'string') {
    const normalized = normalizeText(value);
    if (['1', 'active', 'true', 'hoạt động', 'hoat dong', 'enabled'].includes(normalized)) return 'active';
    if (['0', 'inactive', 'false', 'disabled', 'banned', 'khoá', 'khoa'].includes(normalized)) return 'inactive';
    if (['pending', 'đang chờ', 'dang cho'].includes(normalized)) return 'pending';
  }
  if (value === 1 || value === true) return 'active';
  if (value === 0 || value === false) return 'inactive';
  return 'pending';
};

const pickRegistrationDate = (record) => (
  record.registrationDate ||
  record.createdAt ||
  record.createdDate ||
  record.dateCreated ||
  record.created_on ||
  null
);

const parseDateSafe = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = parseDateSafe(value);
  return date ? date.toLocaleDateString('vi-VN') : '-';
};

const mapApiUserToCustomer = (record, index) => {
  const bookingsArray = Array.isArray(record.bookings) ? record.bookings : null;
  const bookingsCount = bookingsArray ? bookingsArray.length : Number(record.bookingCount ?? record.bookingsCount ?? 0) || 0;

  return {
    id: String(record.id ?? record.userId ?? record.email ?? `customer-${index}`),
    name: record.name || record.fullName || record.username || 'Khách hàng',
    email: record.email || 'Không có email',
    phone: record.phoneNumber || record.phone || '-',
    image: record.image || record.avatar || record.photo || null,
    registrationDate: pickRegistrationDate(record),
    status: mapUserStatus(record.status ?? record.isActive ?? record.state),
    bookingsCount
  };
};

export const UserManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    let isMounted = true;

    const loadCustomers = async () => {
      if (!user?.token) {
        setCustomers([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetchData('User', user.token);
        const dataArray = Array.isArray(response)
          ? response
          : (response ? [response] : []);

        const customerRecords = dataArray
          .filter(hasCustomerRole)
          .map((record, index) => mapApiUserToCustomer(record, index));

        if (isMounted) {
          setCustomers(customerRecords);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Không thể tải danh sách khách hàng');
          setCustomers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesSearch = !normalizedSearch ||
        customer.name.toLowerCase().includes(normalizedSearch) ||
        customer.email.toLowerCase().includes(normalizedSearch);
      const matchesStatus = !statusFilter || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const customerStats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((customer) => customer.status === 'active').length;
    const totalBookings = customers.reduce((sum, customer) => sum + (customer.bookingsCount || 0), 0);
    const now = new Date();
    const newCustomersThisMonth = customers.filter((customer) => {
      const date = parseDateSafe(customer.registrationDate);
      return date && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    return {
      total: totalCustomers,
      active: activeCustomers,
      newThisMonth: newCustomersThisMonth,
      averageBookings: totalCustomers > 0 ? Math.round(totalBookings / totalCustomers) : 0
    };
  }, [customers]);

  const {
    total: totalCustomers,
    active: activeCustomers,
    newThisMonth,
    averageBookings
  } = customerStats;

  const statusOptions = [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' }
  ];

  return (
    <div className="ad-user-page">
      {loading && (
        <div className="ad-owner-page__loading">Đang tải dữ liệu...</div>
      )}
      {error && !loading && (
        <div className="ad-user-page__error">Lỗi: {error}</div>
      )}

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
            <p className="ad-user-page__stat-value">{totalCustomers}</p>
          </div>
        </div>
        <div className="ad-user-page__stat-card">
          <div className="ad-user-page__stat-icon ad-user-page__stat-icon--green">
            <Activity className="ad-user-page__icon" />
          </div>
          <div className="ad-user-page__stat-content">
            <p className="ad-user-page__stat-label">Đang hoạt động</p>
            <p className="ad-user-page__stat-value">
              {activeCustomers}
            </p>
          </div>
        </div>
        {/* Removed 'Khách hàng mới (tháng này)' stat card */}
        <div className="ad-user-page__stat-card">
          <div className="ad-user-page__stat-icon ad-user-page__stat-icon--purple">
            <Activity className="ad-user-page__icon" />
          </div>
          <div className="ad-user-page__stat-content">
            <p className="ad-user-page__stat-label">Trung bình đặt sân/người</p>
            <p className="ad-user-page__stat-value">
              {averageBookings}
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
                {/* Removed 'Ngày đăng ký' column header */}
                <th className="ad-user-table__th">Số lần đặt</th>
                <th className="ad-user-table__th">Trạng thái</th>
                <th className="ad-user-table__th">Hành động</th>
              </tr>
            </thead>
            <tbody className="ad-user-table__body">
              {error && (
                <tr>
                  <td className="ad-user-table__td" colSpan={6} style={{ textAlign: 'center' }}>
                    Không thể tải danh sách khách hàng. {error}
                  </td>
                </tr>
              )}

              {!error && filteredUsers.length === 0 && (
                <tr>
                  <td className="ad-user-table__td" colSpan={6} style={{ textAlign: 'center' }}>
                    Không có khách hàng phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}

              {!error && paginatedUsers.map((user) => (
                <tr key={user.id} className="ad-user-table__row">
                  <td className="ad-user-table__td">
                    <div className="ad-user-table__user">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="ad-user-table__avatar"
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="ad-user-table__avatar">
                          <span className="ad-user-table__avatar-text">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      )}
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
                  {/* Removed 'Ngày đăng ký' column cell */}
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
        {/* Pagination Controls */}
        {!error && filteredUsers.length > itemsPerPage && (
          <div className="ad-user-pagination">
            <div className="ad-user-pagination__info">
              Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} trong tổng số {filteredUsers.length} khách hàng
            </div>
            <div className="ad-user-pagination__controls">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="ad-user-pagination__button"
              >
                Trước
              </button>
              <div className="ad-user-pagination__pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`ad-user-pagination__page ${currentPage === page ? 'ad-user-pagination__page--active' : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="ad-user-pagination__button"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
