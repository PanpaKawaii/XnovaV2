import React, { useEffect, useMemo, useState } from 'react';
import { UserPlus, Edit, Lock, Unlock, Activity, X } from 'lucide-react';
import { SearchInput } from '../../../components/admincomponents/UI/SearchInput';
import { FilterSelect } from '../../../components/admincomponents/UI/FilterSelect';
import { StatusBadge } from '../../../components/admincomponents/UI/StatusBadge';
import { Button } from '../../../components/admincomponents/UI/Button';
import { fetchData, patchData, putData } from '../../../../mocks/CallingAPI.js';
import { useAuth } from '../../../hooks/AuthContext/AuthContext.jsx';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { AlertModal } from '../../../components/ui/AlertModal';
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

  // Map user type, default to 'Regular' if null/undefined
  const getUserType = (type) => {
    if (!type) return 'Regular';
    const normalized = normalizeText(type);
    // Handle both "VIP" and "vip" cases
    if (normalized === 'vip') return 'VIP';
    return 'Regular';
  };

  return {
    id: String(record.id ?? record.userId ?? record.email ?? `customer-${index}`),
    name: record.name || record.fullName || record.username || 'Khách hàng',
    email: record.email || 'Không có email',
    phone: record.phoneNumber || record.phone || '-',
    image: record.image || record.avatar || record.photo || null,
    registrationDate: pickRegistrationDate(record),
    status: mapUserStatus(record.status ?? record.isActive ?? record.state),
    bookingsCount,
    userType: getUserType(record.userType || record.type || record.accountType)
  };
};

export const UserManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: '',
    userType: ''
  });
  const [originalForm, setOriginalForm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

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
      const matchesUserType = !userTypeFilter || customer.userType === userTypeFilter;
      return matchesSearch && matchesStatus && matchesUserType;
    });
  }, [customers, searchTerm, statusFilter, userTypeFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, userTypeFilter]);

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

  const userTypeOptions = [
    { value: 'Regular', label: 'Regular' },
    { value: 'VIP', label: 'VIP' }
  ];

  // Handle edit user
  const handleEditClick = async (customer) => {
    setEditError(null);
    setEditLoading(true);
    setEditModalOpen(true);
    setSelectedUser(customer);
    
    try {
      // Fetch detailed user info from API
      const userDetail = await fetchData(`User/${customer.id}`, user?.token);
      
      const formData = {
        name: userDetail?.name || userDetail?.fullName || userDetail?.username || '',
        email: userDetail?.email || '',
        phone: userDetail?.phone || userDetail?.phoneNumber || userDetail?.contactPhone || '',
        status: customer.status,
        userType: customer.userType
      };
      
      setEditForm(formData);
      setOriginalForm(formData);
    } catch (err) {
      const formData = {
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        status: customer.status,
        userType: customer.userType
      };
      
      setEditForm(formData);
      setOriginalForm(formData);
      setEditError('Không thể tải đầy đủ thông tin. Hiển thị dữ liệu cache.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveUser = async () => {
    if (!selectedUser || !user?.token || !originalForm) return;
    
    setEditLoading(true);
    setEditError(null);
    
    try {
      const token = user.token;
      
      // Build payload with only changed fields
      const changedFields = {};
      
      if (editForm.name !== originalForm.name) {
        changedFields.name = editForm.name;
      }
      
      if (editForm.phone !== originalForm.phone) {
        changedFields.phoneNumber = editForm.phone;
      }
      
      if (editForm.status !== originalForm.status) {
        changedFields.status = editForm.status;
      }
      
      if (editForm.userType !== originalForm.userType) {
        changedFields.userType = editForm.userType;
      }
      
      // Update User info only if there are changes (using PATCH)
      if (Object.keys(changedFields).length > 0) {
        // Fetch current user data to get required fields
        const currentUser = await fetchData(`User/${selectedUser.id}`, token);
        
        // Convert status string to number if changed
        let statusValue = currentUser.status;
        if (changedFields.status) {
          statusValue = changedFields.status === 'active' ? 1 : 0;
        }
        
        // Convert userType to proper format (VIP or empty for Regular)
        let userTypeValue = currentUser.userType || currentUser.type || '';
        if (changedFields.userType) {
          // Convert to proper format: VIP -> "VIP", Regular -> empty/null
          userTypeValue = changedFields.userType === 'VIP' ? 'VIP' : '';
        }
        
        // Build complete payload with all required fields
        const userPayload = {
          id: currentUser.id || selectedUser.id,
          name: changedFields.name || currentUser.name || '',
          email: currentUser.email || editForm.email || '',
          password: currentUser.password || '',
          image: currentUser.image || '',
          role: currentUser.role || 'customer',
          description: currentUser.description || '',
          phoneNumber: changedFields.phoneNumber || currentUser.phoneNumber || currentUser.phone || '',
          point: currentUser.point || 0,
          type: userTypeValue,
          userType: userTypeValue,
          status: statusValue
        };
        
        console.log('🔍 Sending PATCH request to User API:', {
          endpoint: `User/${selectedUser.id}`,
          changedFields: changedFields,
          fullPayload: userPayload
        });
        
        await patchData(`User/${selectedUser.id}`, userPayload, token);
        console.log('✅ Updated User successfully');
        
        // Reload users
        const response = await fetchData('User', token);
        const dataArray = Array.isArray(response) ? response : (response ? [response] : []);
        const customerRecords = dataArray
          .filter(hasCustomerRole)
          .map((record, index) => mapApiUserToCustomer(record, index));
        
        setCustomers(customerRecords);
        
        setAlertMessage('Cập nhật thông tin khách hàng thành công!');
        setShowAlertModal(true);
      } else {
        setAlertMessage('Không có thay đổi nào để cập nhật.');
        setShowAlertModal(true);
      }

      setEditModalOpen(false);
      setSelectedUser(null);
      setOriginalForm(null);
    } catch (err) {
      setEditError(err.message || 'Lỗi cập nhật thông tin khách hàng');
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleStatus = (userId, currentStatus) => {
    setConfirmMessage(`Bạn có chắc muốn ${currentStatus === 'active' ? 'khóa' : 'mở khóa'} khách hàng này?`);
    setConfirmAction(() => () => handleToggleStatusInternal(userId, currentStatus));
    setShowConfirmModal(true);
  };

  const handleToggleStatusInternal = async (userId, currentStatus) => {
    if (!user?.token) return;
    
    try {
      setShowConfirmModal(false);
      
      // Fetch current user data
      const currentUser = await fetchData(`User/${userId}`, user.token);
      const newStatus = currentStatus === 'active' ? 0 : 1;
      
      // Build complete payload
      const userPayload = {
        id: currentUser.id,
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: currentUser.password || '',
        image: currentUser.image || '',
        role: currentUser.role || 'customer',
        description: currentUser.description || '',
        phoneNumber: currentUser.phoneNumber || currentUser.phone || '',
        point: currentUser.point || 0,
        type: currentUser.type || 'customer',
        status: newStatus
      };
      
      await patchData(`User/${userId}`, userPayload, user.token);
      
      // Reload users
      const response = await fetchData('User', user.token);
      const dataArray = Array.isArray(response) ? response : (response ? [response] : []);
      const customerRecords = dataArray
        .filter(hasCustomerRole)
        .map((record, index) => mapApiUserToCustomer(record, index));
      
      setCustomers(customerRecords);
      
      setAlertMessage('Thay đổi trạng thái thành công!');
      setShowAlertModal(true);
    } catch (err) {
      console.error('Error toggling user status:', err);
      setAlertMessage('Lỗi thay đổi trạng thái khách hàng');
      setShowAlertModal(true);
    }
  };

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
        <FilterSelect
          options={userTypeOptions}
          value={userTypeFilter}
          onChange={setUserTypeFilter}
          placeholder="Lọc theo loại người dùng"
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
                <th className="ad-user-table__th">Loại TK</th>
                <th className="ad-user-table__th">Trạng thái</th>
                <th className="ad-user-table__th">Hành động</th>
              </tr>
            </thead>
            <tbody className="ad-user-table__body">
              {error && (
                <tr>
                  <td className="ad-user-table__td" colSpan={7} style={{ textAlign: 'center' }}>
                    Không thể tải danh sách khách hàng. {error}
                  </td>
                </tr>
              )}

              {!error && filteredUsers.length === 0 && (
                <tr>
                  <td className="ad-user-table__td" colSpan={7} style={{ textAlign: 'center' }}>
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
                    <span className={`ad-user-table__user-type ad-user-table__user-type--${user.userType.toLowerCase()}`}>
                      {user.userType}
                    </span>
                  </td>
                  <td className="ad-user-table__td">
                    <StatusBadge status={user.status} type="user" />
                  </td>
                  <td className="ad-user-table__td">
                    <div className="ad-user-table__button-group">
                      <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleEditClick(user)}>
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={user.status === 'active' ? Lock : Unlock}
                        onClick={() => handleToggleStatus(user.id, user.status)}
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

      {/* Edit User Modal */}
      {editModalOpen && selectedUser && (
        <div className="ad-owner-modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="ad-owner-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-owner-modal__header">
              <h2 className="ad-owner-modal__title">Chỉnh sửa thông tin khách hàng</h2>
              <button 
                className="ad-owner-modal__close"
                onClick={() => setEditModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="ad-owner-modal__body">
              {editError && (
                <div className="ad-owner-modal__error">{editError}</div>
              )}

              <div className="ad-owner-modal__form">
                <div className="ad-owner-modal__field">
                  <label className="ad-owner-modal__label">Tên:</label>
                  <input
                    type="text"
                    className="ad-owner-modal__input"
                    value={editForm.name}
                    onChange={(e) => handleEditFormChange('name', e.target.value)}
                  />
                </div>

                <div className="ad-owner-modal__field">
                  <label className="ad-owner-modal__label">Email:</label>
                  <input
                    type="email"
                    className="ad-owner-modal__input"
                    value={editForm.email}
                    readOnly
                    disabled
                    style={{ cursor: 'not-allowed' }}
                  />
                </div>

                <div className="ad-owner-modal__field">
                  <label className="ad-owner-modal__label">Số điện thoại:</label>
                  <input
                    type="text"
                    className="ad-owner-modal__input"
                    value={editForm.phone}
                    onChange={(e) => handleEditFormChange('phone', e.target.value)}
                  />
                </div>

                <div className="ad-owner-modal__field">
                  <label className="ad-owner-modal__label">Trạng thái:</label>
                  <select
                    className="ad-owner-modal__select"
                    value={editForm.status}
                    onChange={(e) => handleEditFormChange('status', e.target.value)}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>

                <div className="ad-owner-modal__field">
                  <label className="ad-owner-modal__label">Loại tài khoản:</label>
                  <select
                    className="ad-owner-modal__select"
                    value={editForm.userType}
                    onChange={(e) => handleEditFormChange('userType', e.target.value)}
                  >
                    <option value="Regular">Regular</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="ad-owner-modal__footer">
              <div className="ad-owner-modal__actions">
                <Button 
                  variant="ghost" 
                  onClick={() => setEditModalOpen(false)}
                  disabled={editLoading}
                >
                  Hủy
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setConfirmMessage('Bạn có chắc muốn cập nhật thông tin khách hàng này?');
                    setConfirmAction(() => handleSaveUser);
                    setShowConfirmModal(true);
                  }}
                  disabled={editLoading}
                >
                  {editLoading ? 'Đang lưu...' : 'Xác nhận cập nhật'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setShowConfirmModal(false)}
      />

      <AlertModal
        isOpen={showAlertModal}
        message={alertMessage}
        onClose={() => setShowAlertModal(false)}
      />
    </div>
  );
};
