import React, { useEffect, useMemo, useState } from 'react';
import { UserPlus, Edit, Lock, Unlock, Activity, Building, FileText, DollarSign, X, ExternalLink } from 'lucide-react';
import { SearchInput } from '../../../components/admincomponents/UI/SearchInput';
import { FilterSelect } from '../../../components/admincomponents/UI/FilterSelect';
import { StatusBadge } from '../../../components/admincomponents/UI/StatusBadge';
import { Button } from '../../../components/admincomponents/UI/Button';
import { fetchData, putData } from '../../../../mocks/CallingAPI.js';
import { useAuth } from '../../../hooks/AuthContext/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './FieldOwnerManagement.css';

// Note: Replaced mock data with real API fetching (User, Field, Booking, BookingSlot, Slot)

export const FieldOwnerManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    commissionRate: '',
    status: ''
  });
  const [originalForm, setOriginalForm] = useState(null); // Store original values for comparison
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // Raw API data
  const [users, setUsers] = useState([]);
  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingSlots, setBookingSlots] = useState([]);
  const [slots, setSlots] = useState([]);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const token = user.token;
        const [usersResp, fieldsResp, bookingsResp, bookingSlotsResp, slotsResp, venuesResp] = await Promise.all([
          fetchData('User', token).catch(() => []),
          fetchData('Field', token).catch(() => []),
          fetchData('Booking', token).catch(() => []),
          fetchData('BookingSlot', token).catch(() => []),
          fetchData('Slot', token).catch(() => []),
          fetchData('Venue', token).catch(() => [])
        ]);

        setUsers(Array.isArray(usersResp) ? usersResp : (usersResp ? [usersResp] : []));
        setFields(Array.isArray(fieldsResp) ? fieldsResp : (fieldsResp ? [fieldsResp] : []));
        setBookings(Array.isArray(bookingsResp) ? bookingsResp : (bookingsResp ? [bookingsResp] : []));
        setBookingSlots(Array.isArray(bookingSlotsResp) ? bookingSlotsResp : (bookingSlotsResp ? [bookingSlotsResp] : []));
        setSlots(Array.isArray(slotsResp) ? slotsResp : (slotsResp ? [slotsResp] : []));
  setVenues(Array.isArray(venuesResp) ? venuesResp : (venuesResp ? [venuesResp] : []));
      } catch (err) {
        setError(err.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const slotsById = useMemo(() => new Map(slots.map(s => [s.id, s])), [slots]);

  const bookingSlotsByBooking = useMemo(() => {
    const map = new Map();
    bookingSlots.forEach(bs => {
      const list = map.get(bs.bookingId) || [];
      list.push(bs);
      map.set(bs.bookingId, list);
    });
    return map;
  }, [bookingSlots]);

  const fieldsByOwner = useMemo(() => {
    const map = new Map();
    fields.forEach(f => {
      const ownerId = f.ownerId ?? f.ownerUserId ?? f.userId ?? f.owner?.id;
      if (!ownerId) return;
      const list = map.get(ownerId) || [];
      list.push(f);
      map.set(ownerId, list);
    });
    return map;
  }, [fields]);

  const venuesByOwner = useMemo(() => {
    const map = new Map();
    venues.forEach(v => {
      const ownerId = v.ownerId ?? v.userId ?? v.ownerUserId ?? v.owner?.id;
      if (!ownerId) return;
      const list = map.get(ownerId) || [];
      list.push(v);
      map.set(ownerId, list);
    });
    return map;
  }, [venues]);

  const isOwnerUser = (u) => {
    const roleCandidate = (u.role || u.userType || u.type || '').toString().toLowerCase();
    if (['owner', 'fieldowner', 'field_owner'].includes(roleCandidate)) return true;
    if (Array.isArray(u.roles)) {
      return u.roles.some(r => ['owner', 'fieldowner', 'field_owner'].includes((r?.name || r).toString().toLowerCase()));
    }
    return false;
  };

  const mapUserStatus = (u) => {
    const s = u.status ?? u.state ?? u.isActive;
    if (s === 'pending' || s === 2 || s === '2') return 'pending';
    if (s === true || s === 'active' || s === 1 || s === '1') return 'active';
    return 'inactive';
  };

  const owners = useMemo(() => {
    // Build list of owners with computed venueCount, fieldsCount (from venues), and revenue
    return users.filter(isOwnerUser).map(u => {
      const ownerVenues = venuesByOwner.get(u.id) || [];
      // Collect embedded fields from venues (each venue may have an array `fields`)
      const embeddedFields = ownerVenues.flatMap(v => Array.isArray(v.fields) ? v.fields : []);
      // Fallback to Field API mapping if venue doesn't expose fields
      const fallbackFields = fieldsByOwner.get(u.id) || [];
      // Merge unique by id
      const allFields = [...embeddedFields, ...fallbackFields.filter(f => !embeddedFields.some(ef => ef.id === f.id))];
      const fieldIds = new Set(allFields.map(f => f.id));

      // Compute revenue from bookings of owner's fields using Slot prices
      let revenue = 0;
      bookings.forEach(bk => {
        if (!fieldIds.has(bk.fieldId)) return;
        const bsList = bookingSlotsByBooking.get(bk.id) || [];
        const priceSum = bsList.reduce((sum, bs) => sum + (Number(slotsById.get(bs.slotId)?.price) || 0), 0);
        const status = bk.status;
        if (status === 4 || status === '4' || status === 'completed' || status === 1 || status === '1' || status === 'confirmed') {
          revenue += priceSum;
        }
      });

  // Contact phone: use venue contact phones joined, fallback to user phone
  // Deduplicate venue contact phones
  const venuePhonesRaw = ownerVenues.map(v => v.phone || v.contactPhone || v.contact || null).filter(Boolean);
  const venuePhones = Array.from(new Set(venuePhonesRaw));
  const phone = venuePhones.length > 0 ? venuePhones.join(', ') : (u.phone || u.phoneNumber || u.contactPhone || '-');
  // Business name: show venue names joined by comma, fallback to user businessName
  const venueNames = ownerVenues.map(v => v.name).filter(Boolean);
  const businessName = venueNames.length > 0 ? venueNames.join(', ') : (u.businessName || u.companyName || u.orgName || '-');
      const commissionRate = u.commissionRate ?? u.commission ?? u.feeRate ?? null;
      const status = mapUserStatus(u);

      return {
        id: u.id,
        name: u.name || u.fullName || u.username || `User ${u.id}`,
        email: u.email || '-',
        phone,
        businessName,
        venueCount: ownerVenues.length,
        fieldsCount: allFields.length,
        commissionRate: commissionRate != null ? Number(commissionRate) : null,
        totalRevenue: revenue,
        status
      };
    });
  }, [users, fieldsByOwner, venuesByOwner, bookings, bookingSlotsByBooking, slotsById]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const filteredFieldOwners = owners.filter(owner => {
    const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         owner.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         owner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || owner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFieldOwners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFieldOwners = filteredFieldOwners.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const statusOptions = [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' },
    { value: 'pending', label: 'Chờ duyệt' }
  ];

  // Handle edit owner - fetch fresh data from API
  const handleEditClick = async (owner) => {
    setEditError(null);
    setEditLoading(true);
    setEditModalOpen(true);
    setSelectedOwner(owner);
    
    try {
      // Fetch detailed owner info from API
      const ownerDetail = await fetchData(`User/${owner.id}`, user?.token);
      
      // Get venue names and phones for business name and contact
      const ownerVenues = venuesByOwner.get(owner.id) || [];
      const venueNames = ownerVenues.map(v => v.name).filter(Boolean);
      const venuePhones = ownerVenues.map(v => v.contact).filter(Boolean);
      const businessNameFromVenues = venueNames.length > 0 ? venueNames.join(', ') : '';
      const phoneFromVenues = venuePhones.length > 0 ? venuePhones.join(', ') : '';
      
      const formData = {
        name: ownerDetail?.name || ownerDetail?.fullName || ownerDetail?.username || '',
        email: ownerDetail?.email || '',
        phone: phoneFromVenues || ownerDetail?.phone || ownerDetail?.phoneNumber || ownerDetail?.contactPhone || '',
        businessName: businessNameFromVenues || ownerDetail?.businessName || ownerDetail?.companyName || ownerDetail?.orgName || '',
        commissionRate: ownerDetail?.commissionRate != null ? ownerDetail.commissionRate : '',
        status: owner.status
      };
      
      setEditForm(formData);
      setOriginalForm(formData); // Save original values for comparison
    } catch (err) {
      // Fallback to existing data if API call fails
      const rawUser = users.find(u => u.id === owner.id);
      const ownerVenues = venuesByOwner.get(owner.id) || [];
      const venueNames = ownerVenues.map(v => v.name).filter(Boolean);
      const venuePhones = ownerVenues.map(v => v.contact).filter(Boolean);
      const businessNameFromVenues = venueNames.length > 0 ? venueNames.join(', ') : '';
      const phoneFromVenues = venuePhones.length > 0 ? venuePhones.join(', ') : '';
      
      const formData = {
        name: rawUser?.name || rawUser?.fullName || rawUser?.username || '',
        email: rawUser?.email || '',
        phone: phoneFromVenues || rawUser?.phone || rawUser?.phoneNumber || rawUser?.contactPhone || '',
        businessName: businessNameFromVenues || rawUser?.businessName || rawUser?.companyName || rawUser?.orgName || '',
        commissionRate: owner.commissionRate != null ? owner.commissionRate : '',
        status: owner.status
      };
      
      setEditForm(formData);
      setOriginalForm(formData); // Save original values for comparison
      setEditError('Không thể tải đầy đủ thông tin. Hiển thị dữ liệu cache.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveOwner = async () => {
    if (!selectedOwner || !user?.token || !originalForm) return;
    
    setEditLoading(true);
    setEditError(null);
    
    try {
      const token = user.token;
      
      // Check if User fields (name, email) changed
      const userFieldsChanged = 
        editForm.name !== originalForm.name || 
        editForm.email !== originalForm.email ||
        editForm.commissionRate !== originalForm.commissionRate ||
        editForm.status !== originalForm.status;
      
      // Check if Venue fields (phone, businessName) changed
      const venueFieldsChanged = 
        editForm.phone !== originalForm.phone || 
        editForm.businessName !== originalForm.businessName;
      
      // Update User info only if name, email, commissionRate, or status changed
      if (userFieldsChanged) {
        const userPayload = {
          name: editForm.name,
          email: editForm.email,
          commissionRate: editForm.commissionRate !== '' ? Number(editForm.commissionRate) : null,
          status: editForm.status
        };
        await putData(`User/${selectedOwner.id}`, userPayload, token);
        console.log('✅ Updated User fields:', userPayload);
      } else {
        console.log('⏭️ Skipped User API - no changes detected');
      }

      // Update Venue info only if phone or businessName changed
      if (venueFieldsChanged) {
        const ownerVenues = venuesByOwner.get(selectedOwner.id) || [];
        
        if (ownerVenues.length > 0) {
          // Split phone and businessName by comma if multiple venues
          const phones = editForm.phone.split(',').map(p => p.trim()).filter(Boolean);
          const businessNames = editForm.businessName.split(',').map(b => b.trim()).filter(Boolean);
          
          // Update each venue
          const venueUpdatePromises = ownerVenues.map(async (venue, index) => {
            const venuePayload = {
              id: venue.id,
              name: businessNames[index] || businessNames[0] || editForm.businessName, // Tên doanh nghiệp
              address: venue.address || '',
              longitude: venue.longitude || '',
              latitude: venue.latitude || '',
              contact: phones[index] || phones[0] || editForm.phone, // Số điện thoại
              status: venue.status || 0,
              userId: venue.userId || selectedOwner.id
            };
            console.log('✅ Updating Venue:', venue.id, venuePayload);
            return putData(`Venue/${venue.id}`, venuePayload, token);
          });

          await Promise.all(venueUpdatePromises);
          console.log('✅ Updated all Venue fields');
        } else {
          console.log('⚠️ No venues found for owner - skipped Venue API');
        }
      } else {
        console.log('⏭️ Skipped Venue API - no changes detected');
      }

      // Reload data only if something was updated
      if (userFieldsChanged || venueFieldsChanged) {
        const [usersResp, venuesResp] = await Promise.all([
          fetchData('User', token).catch(() => []),
          fetchData('Venue', token).catch(() => [])
        ]);
        
        setUsers(Array.isArray(usersResp) ? usersResp : (usersResp ? [usersResp] : []));
        setVenues(Array.isArray(venuesResp) ? venuesResp : (venuesResp ? [venuesResp] : []));
      }

      setEditModalOpen(false);
      setSelectedOwner(null);
      setOriginalForm(null);
    } catch (err) {
      setEditError(err.message || 'Lỗi cập nhật thông tin owner');
    } finally {
      setEditLoading(false);
    }
  };

  const handleViewVenues = () => {
    if (!selectedOwner) return;
    // Navigate to VenueManagement with owner filter
    navigate(`/admin/venues?ownerId=${selectedOwner.id}`);
    setEditModalOpen(false);
  };

  const handleToggleStatus = async (ownerId, currentStatus) => {
    if (!user?.token) return;
    
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await putData(`User/${ownerId}`, { status: newStatus }, user.token);
      
      // Reload users
      const token = user.token;
      const usersResp = await fetchData('User', token).catch(() => []);
      setUsers(Array.isArray(usersResp) ? usersResp : (usersResp ? [usersResp] : []));
    } catch (err) {
      console.error('Error toggling owner status:', err);
      alert('Lỗi thay đổi trạng thái owner');
    }
  };

  const handleApproveOwner = async (ownerId) => {
    if (!user?.token) return;
    
    try {
      await putData(`User/${ownerId}`, { status: 'active' }, user.token);
      
      // Reload users
      const token = user.token;
      const usersResp = await fetchData('User', token).catch(() => []);
      setUsers(Array.isArray(usersResp) ? usersResp : (usersResp ? [usersResp] : []));
    } catch (err) {
      console.error('Error approving owner:', err);
      alert('Lỗi duyệt owner');
    }
  };

  const handleViewDetails = (owner) => {
    // Open edit modal to view details
    handleEditClick(owner);
  };

  return (
    <div className="ad-owner-page">
      {loading && (
        <div className="ad-owner-page__loading">Đang tải dữ liệu...</div>
      )}
      {error && (
        <div className="ad-owner-page__error">Lỗi: {error}</div>
      )}
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
            <p className="ad-owner-page__stat-value">{owners.length}</p>
          </div>
        </div>
        <div className="ad-owner-page__stat-card">
          <div className="ad-owner-page__stat-icon ad-owner-page__stat-icon--green">
            <Activity className="ad-owner-page__icon" />
          </div>
          <div className="ad-owner-page__stat-content">
            <p className="ad-owner-page__stat-label">Đang hoạt động</p>
            <p className="ad-owner-page__stat-value">
              {owners.filter(o => o.status === 'active').length}
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
              {owners.filter(o => o.status === 'pending').length}
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
              {formatCurrency(owners.reduce((sum, o) => sum + (o.totalRevenue || 0), 0))}
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
                  <th className="ad-owner-table__th">Số địa điểm</th>
                  <th className="ad-owner-table__th">Số sân</th>
                <th className="ad-owner-table__th">Hoa hồng</th>
                <th className="ad-owner-table__th">Doanh thu</th>
                <th className="ad-owner-table__th">Trạng thái</th>
                <th className="ad-owner-table__th">Hành động</th>
              </tr>
            </thead>
            <tbody className="ad-owner-table__body">
              {paginatedFieldOwners.map((owner) => (
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
                      </div>
                    </div>
                  </td>
                  <td className="ad-owner-table__td">
                    <div className="ad-owner-table__business-name">
                      {owner.businessName}
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
                      {owner.venueCount} địa điểm
                    </span>
                  </td>
                  <td className="ad-owner-table__td">
                    <span className="ad-owner-table__badge">
                      {owner.fieldsCount} sân
                    </span>
                  </td>
                  <td className="ad-owner-table__td">
                    {owner.commissionRate != null ? `${owner.commissionRate}%` : '-'}
                  </td>
                  <td className="ad-owner-table__td ad-owner-table__td--price">
                    {formatCurrency(owner.totalRevenue)}
                  </td>
                  <td className="ad-owner-table__td">
                    <StatusBadge status={owner.status} type="user" />
                  </td>
                  <td className="ad-owner-table__td">
                    <div className="ad-owner-table__button-group">
                      <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleEditClick(owner)}>
                        Sửa
                      </Button>
                      {owner.status === 'pending' && (
                        <Button variant="primary" size="sm" onClick={() => handleApproveOwner(owner.id)}>
                          Duyệt
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={owner.status === 'active' ? Lock : Unlock}
                        onClick={() => handleToggleStatus(owner.id, owner.status)}
                      >
                        {owner.status === 'active' ? 'Khóa' : 'Mở'}
                      </Button>
                      <Button variant="ghost" size="sm" icon={Activity} onClick={() => handleViewDetails(owner)}>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="ad-owner-pagination">
          <div className="ad-owner-pagination__info">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredFieldOwners.length)} của {filteredFieldOwners.length} kết quả
          </div>
          <div className="ad-owner-pagination__controls">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            
            <div className="ad-owner-pagination__pages">
              <span className="ad-owner-pagination__page-info">
                Trang {currentPage} / {totalPages}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Edit Owner Modal */}
      {editModalOpen && selectedOwner && (
        <div className="ad-owner-modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="ad-owner-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-owner-modal__header">
              <h2 className="ad-owner-modal__title">Chỉnh sửa thông tin Owner</h2>
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

              <div className="ad-owner-modal__stats">
                <div className="ad-owner-modal__stat">
                  <span className="ad-owner-modal__stat-label">Số địa điểm:</span>
                  <span className="ad-owner-modal__stat-value">{selectedOwner.venueCount}</span>
                </div>
                <div className="ad-owner-modal__stat">
                  <span className="ad-owner-modal__stat-label">Số sân:</span>
                  <span className="ad-owner-modal__stat-value">{selectedOwner.fieldsCount}</span>
                </div>
                <div className="ad-owner-modal__stat">
                  <span className="ad-owner-modal__stat-label">Doanh thu:</span>
                  <span className="ad-owner-modal__stat-value">{formatCurrency(selectedOwner.totalRevenue)}</span>
                </div>
              </div>

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
                    onChange={(e) => handleEditFormChange('email', e.target.value)}
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
                  <label className="ad-owner-modal__label">Tên doanh nghiệp:</label>
                  <input
                    type="text"
                    className="ad-owner-modal__input"
                    value={editForm.businessName}
                    onChange={(e) => handleEditFormChange('businessName', e.target.value)}
                  />
                </div>

                <div className="ad-owner-modal__field">
                  <label className="ad-owner-modal__label">Hoa hồng (%):</label>
                  <input
                    type="number"
                    className="ad-owner-modal__input"
                    value={editForm.commissionRate}
                    onChange={(e) => handleEditFormChange('commissionRate', e.target.value)}
                    min="0"
                    max="100"
                    step="0.1"
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
                    <option value="pending">Chờ duyệt</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="ad-owner-modal__footer">
              <Button 
                variant="secondary" 
                icon={ExternalLink}
                onClick={handleViewVenues}
              >
                Xem danh sách Venue
              </Button>
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
                  onClick={handleSaveOwner}
                  disabled={editLoading}
                >
                  {editLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
