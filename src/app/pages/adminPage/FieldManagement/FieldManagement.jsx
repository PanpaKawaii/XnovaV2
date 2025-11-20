import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, ToggleLeft, ToggleRight, Activity, MapPin, Building2, ChevronDown, ChevronUp, Clock, DollarSign, Settings } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchInput } from '../../../components/admincomponents/UI/SearchInput';
import { FilterSelect } from '../../../components/admincomponents/UI/FilterSelect';
import { StatusBadge } from '../../../components/admincomponents/UI/StatusBadge';
import { Button } from '../../../components/admincomponents/UI/Button';
import { fetchData, putData, postData, deleteData } from '../../../../mocks/CallingAPI';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { FieldEditModal } from './FieldEditModal';
import { SlotManagementModal } from './SlotManagementModal';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import './FieldManagement.css';

export const FieldManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fields, setFields] = useState([]);
  const [venues, setVenues] = useState([]);
  const [slots, setSlots] = useState([]);
  const [types, setTypes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingSlots, setBookingSlots] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [venueFilter, setVenueFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedField, setExpandedField] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [highlightedFieldId, setHighlightedFieldId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

  // Set venue filter and field highlight from URL query parameters
  useEffect(() => {
    const venueIdFromUrl = searchParams.get('venueId');
    const fieldIdFromUrl = searchParams.get('fieldId');
    
    if (venueIdFromUrl) {
      setVenueFilter(venueIdFromUrl);
    }
    
    if (fieldIdFromUrl) {
      const fieldId = parseInt(fieldIdFromUrl);
      setHighlightedFieldId(fieldId);
      setExpandedField(fieldId);
      
      // Scroll to field after a short delay to ensure rendering
      setTimeout(() => {
        const fieldElement = document.getElementById(`field-${fieldId}`);
        if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedFieldId(null);
      }, 3000);
    }
  }, [searchParams]);

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, [user, refreshKey]);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const fetchAllData = async () => {
    setLoading(true);
    const token = user?.token || null;
    
    try {
      // Fetch data from API endpoints
      const [fieldsResponse, venuesResponse, slotsResponse, typesResponse, bookingsResponse] = await Promise.all([
        fetchData('Field', token).catch(() => []),
        fetchData('Venue', token).catch(() => []),
        fetchData('Slot', token).catch(() => []),
        fetchData('Type', token).catch(() => []),
        fetchData('Booking', token).catch(() => []),
      ]);

      // Normalize responses to arrays
      const fieldsData = Array.isArray(fieldsResponse) ? fieldsResponse : (fieldsResponse ? [fieldsResponse] : []);
      const venuesData = Array.isArray(venuesResponse) ? venuesResponse : (venuesResponse ? [venuesResponse] : []);
      const slotsData = Array.isArray(slotsResponse) ? slotsResponse : (slotsResponse ? [slotsResponse] : []);
      const typesData = Array.isArray(typesResponse) ? typesResponse : (typesResponse ? [typesResponse] : []);
      const bookingsData = Array.isArray(bookingsResponse) ? bookingsResponse : (bookingsResponse ? [bookingsResponse] : []);
      
      // Extract booking slots from bookings
      const allBookingSlots = bookingsData.flatMap(booking => 
        (booking.bookingSlots || []).map(bs => ({
          ...bs,
          bookingId: booking.id,
          bookingDate: booking.date,
          bookingStatus: booking.status
        }))
      );
      
      setFields(fieldsData);
      setVenues(venuesData);
      setSlots(slotsData);
      setTypes(typesData);
      setBookings(bookingsData);
      setBookingSlots(allBookingSlots);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle field status
  const handleToggleStatus = (fieldId, currentStatus) => {
    setConfirmAction(() => () => handleToggleStatusInternal(fieldId, currentStatus));
    setShowConfirmModal(true);
  };

  const handleToggleStatusInternal = async (fieldId, currentStatus) => {
    const token = user?.token || null;
    
    try {
      const field = fields.find(f => f.id === fieldId);
      const updatedField = {
        ...field,
        status: currentStatus === 1 ? 0 : 1
      };
      
      await putData(`Field/${fieldId}`, updatedField, token);
      await fetchAllData();
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Error toggling field status:', err);
      setShowConfirmModal(false);
    }
  };

  // Modal handlers
  const handleEditField = (field) => {
    setSelectedField(field);
    setShowEditModal(true);
  };

  const handleManageSlots = (field) => {
    setSelectedField(field);
    setShowSlotModal(true);
  };

  const handleSaveField = async (fieldData) => {
    const token = user?.token || null;
    try {
      if (fieldData.id) {
        // Update existing field
        await putData(`Field/${fieldData.id}`, fieldData, token);
      } else {
        // Create new field
        await postData('Field', fieldData, token);
      }
      await fetchAllData();
      setShowEditModal(false);
      setSelectedField(null);
    } catch (err) {
      console.error('Error saving field:', err);
      throw err;
    }
  };

  const handleSaveSlot = async (slotData) => {
    const token = user?.token || null;
    try {
      if (slotData.id) {
        // Update existing slot
        await putData(`Slot/${slotData.id}`, slotData, token);
      } else {
        // Create new slot
        await postData('Slot', slotData, token);
      }
      await fetchAllData();
    } catch (err) {
      console.error('Error saving slot:', err);
      throw err;
    }
  };

  const handleDeleteSlot = async (slotId) => {
    const token = user?.token || null;
    try {
      await deleteData(`Slot/${slotId}`, token);
      await fetchAllData();
    } catch (err) {
      console.error('Error deleting slot:', err);
      throw err;
    }
  };

  // Helper functions
  const venuesById = useMemo(() => Object.fromEntries(venues.map(v => [v.id, v])), [venues]);
  const typesById = useMemo(() => Object.fromEntries(types.map(t => [t.id, t])), [types]);
  const slotsByFieldId = useMemo(() => slots.reduce((acc, s) => {
    if (!acc[s.fieldId]) acc[s.fieldId] = [];
    acc[s.fieldId].push(s);
    return acc;
  }, {}), [slots]);
  const bookingSlotsBySlotId = useMemo(() => bookingSlots.reduce((acc, bs) => {
    if (!acc[bs.slotId]) acc[bs.slotId] = [];
    acc[bs.slotId].push(bs);
    return acc;
  }, {}), [bookingSlots]);

  const normalize = (s) => (s || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Filter fields
  const filteredFields = useMemo(() => {
    const q = normalize(searchTerm);
    return fields.filter(field => {
      const venue = venuesById[field.venueId];
      const type = typesById[field.typeId];
      const matchesSearch =
        normalize(field.name).includes(q) ||
        normalize(field.description || '').includes(q) ||
        normalize(venue?.name || '').includes(q) ||
        normalize(venue?.location || '').includes(q) ||
        normalize(type?.name || '').includes(q);

      const matchesStatus = !statusFilter || field.status === parseInt(statusFilter);
      const matchesVenue = !venueFilter || field.venueId === parseInt(venueFilter);
      const matchesType = !typeFilter || field.typeId === parseInt(typeFilter);

      return matchesSearch && matchesStatus && matchesVenue && matchesType;
    });
  }, [fields, venuesById, typesById, searchTerm, statusFilter, venueFilter, typeFilter]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5); // HH:mm from HH:mm:ss
  };

  const toggleExpanded = (fieldId) => {
    setExpandedField(expandedField === fieldId ? null : fieldId);
  };

  const handleRefresh = () => setRefreshKey(k => k + 1);

  const getFieldSlots = (fieldId) => (slotsByFieldId[fieldId] || []).filter(slot => slot.status === 1);
  
  const getAllFieldSlots = (fieldId) => slotsByFieldId[fieldId] || [];
  
  const getSlotBookings = (slotId) => bookingSlotsBySlotId[slotId] || [];

  const calculateUtilizationRate = (fieldId) => {
    const fieldSlots = getFieldSlots(fieldId);
    if (fieldSlots.length === 0) return 0;
    
    const bookedSlots = fieldSlots.filter(slot => {
      const slotBookings = getSlotBookings(slot.id);
      return slotBookings.some(bs => bs.bookingStatus === 1); // Active bookings
    }).length;
    
    return Math.round((bookedSlots / fieldSlots.length) * 100);
  };

  const getTotalBookings = (fieldId) => {
    return bookings.filter(b => b.fieldId === fieldId).length;
  };

  const statusOptions = [
    { value: '1', label: 'Hoạt động' },
    { value: '0', label: 'Không hoạt động' }
  ];

  const venueOptions = venues.map(venue => ({
    value: venue.id.toString(),
    label: venue.name
  }));

  const typeOptions = types.map(type => ({
    value: type.id.toString(),
    label: type.name
  }));

  return (
    <div className="ad-field-page">
      {loading && (
        <div className="ad-field-page__loading">Đang tải dữ liệu...</div>
      )}
      {error && (
        <div className="ad-field-page__error">Lỗi: {error}</div>
      )}

      {/* Header */}
      <div className="ad-field-page__header">
        <h1 className="ad-field-page__title">
          Quản lý sân
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={handleRefresh}>
            Làm mới
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => handleEditField(null)}>
            Thêm sân mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="ad-field-page__filters">
        <SearchInput
          placeholder="Tìm kiếm tên sân, venue, loại sân..."
          value={searchInput}
          onChange={setSearchInput}
        />
        <FilterSelect
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Lọc theo trạng thái"
        />
        <FilterSelect
          options={venueOptions}
          value={venueFilter}
          onChange={setVenueFilter}
          placeholder="Lọc theo venue"
        />
        <FilterSelect
          options={typeOptions}
          value={typeFilter}
          onChange={setTypeFilter}
          placeholder="Lọc theo loại sân"
        />
      </div>

      {/* Stats Cards */}
      <div className="ad-field-page__stats">
        <div className="ad-field-page__stat-card">
          <div className="ad-field-page__stat-icon ad-field-page__stat-icon--blue">
            <MapPin className="ad-field-page__icon" />
          </div>
          <div className="ad-field-page__stat-content">
            <p className="ad-field-page__stat-label">Tổng số sân</p>
            <p className="ad-field-page__stat-value">{fields.length}</p>
          </div>
        </div>
        <div className="ad-field-page__stat-card">
          <div className="ad-field-page__stat-icon ad-field-page__stat-icon--green">
            <Activity className="ad-field-page__icon" />
          </div>
          <div className="ad-field-page__stat-content">
            <p className="ad-field-page__stat-label">Đang hoạt động</p>
            <p className="ad-field-page__stat-value">
              {fields.filter(f => f.status === 1).length}
            </p>
          </div>
        </div>
        <div className="ad-field-page__stat-card">
          <div className="ad-field-page__stat-icon ad-field-page__stat-icon--yellow">
            <Clock className="ad-field-page__icon" />
          </div>
          <div className="ad-field-page__stat-content">
            <p className="ad-field-page__stat-label">Tổng số slot</p>
            <p className="ad-field-page__stat-value">
              {slots.filter(s => s.status === 1).length}
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
              {bookings.length}
            </p>
          </div>
        </div>
      </div>

      {/* Fields Grid */}
      <div className="ad-field-page__grid">
        {filteredFields.map((field) => {
          const venue = venuesById[field.venueId];
          const type = typesById[field.typeId];
          const fieldSlots = getFieldSlots(field.id);
          const utilizationRate = calculateUtilizationRate(field.id);
          const totalBookings = getTotalBookings(field.id);
          const isExpanded = expandedField === field.id;
          const isHighlighted = highlightedFieldId === field.id;
          
          // Calculate average price
          const avgPrice = fieldSlots.length > 0 
            ? fieldSlots.reduce((sum, s) => sum + (s.price || 0), 0) / fieldSlots.length 
            : 0;

          return (
            <div 
              key={field.id} 
              id={`field-${field.id}`}
              className={`ad-field-card ${isHighlighted ? 'ad-field-card--highlighted' : ''}`}
            >
              <div className="ad-field-card__header">
                <div className="ad-field-card__info">
                  <h3 className="ad-field-card__name">
                    {field.name}
                  </h3>
                  <p className="ad-field-card__location">
                    <Building2 size={16} /> {venue?.name || 'N/A'}
                  </p>

                  {type && (
                    <p className="ad-field-card__location">
                      <Activity size={16} /> {type.name}
                    </p>
                  )}
                </div>
                <StatusBadge status={field.status === 1 ? 'active' : 'inactive'} type="field" />
              </div>

              <div className="ad-field-card__details">
                <div className="ad-field-card__detail-row">
                  <span className="ad-field-card__detail-label">Giá TB:</span>
                  <span className="ad-field-card__detail-value">
                    {formatCurrency(avgPrice)}
                  </span>
                </div>
                <div className="ad-field-card__detail-row">
                  <span className="ad-field-card__detail-label">Số slot:</span>
                  <span className="ad-field-card__detail-value">
                    {fieldSlots.length} slots
                  </span>
                </div>
                <div className="ad-field-card__detail-row">
                  <span className="ad-field-card__detail-label">Tỷ lệ sử dụng:</span>
                  <span className="ad-field-card__detail-value">
                    {utilizationRate}%
                  </span>
                </div>
                <div className="ad-field-card__detail-row">
                  <span className="ad-field-card__detail-label">Tổng đặt sân:</span>
                  <span className="ad-field-card__detail-value">
                    {totalBookings} lần
                  </span>
                </div>
              </div>

              {/* Utilization Progress Bar */}
              <div className="ad-field-card__progress-wrapper">
                <div className="ad-field-card__progress-bar">
                  <div 
                    className="ad-field-card__progress-fill"
                    style={{ width: `${utilizationRate}%` }}
                  ></div>
                </div>
              </div>

              {field.description && (
                <p className="ad-field-card__description">
                  {field.description}
                </p>
              )}

              {/* Slots Section - Expandable */}
              {getAllFieldSlots(field.id).length > 0 && (
                <div className="ad-field-card__slots">
                  <button 
                    className="ad-field-card__expand-button"
                    onClick={() => toggleExpanded(field.id)}
                  >
                    <span>Xem chi tiết slots ({getAllFieldSlots(field.id).length})</span>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {isExpanded && (
                    <div className="ad-field-card__slots-list">
                      {getAllFieldSlots(field.id).map(slot => {
                        const slotBookings = getSlotBookings(slot.id);
                        // Slot status: 1 = available, 0 = locked/disabled
                        const isAvailable = slot.status === 1;

                        return (
                          <div key={slot.id} className="ad-slot-item">
                            <div className="ad-slot-item__header">
                              <div className="ad-slot-item__time">
                                <Clock size={16} />
                                <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                              </div>
                              <div className={`ad-slot-item__status ${isAvailable ? 'available' : 'locked'}`}>
                                {isAvailable ? 'Hoạt động' : 'Đã khóa'}
                              </div>
                            </div>
                            <div className="ad-slot-item__details">
                              <div className="ad-slot-item__price">
                                <DollarSign size={14} />
                                <span>{formatCurrency(slot.price)}</span>
                              </div>
                              <div className="ad-slot-item__bookings">
                                Đặt: {slotBookings.length} lần
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="ad-field-card__actions">
                <div className="ad-field-card__button-group">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={Edit}
                    onClick={() => handleEditField(field)}
                  >
                    Sửa
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={Settings}
                    onClick={() => handleManageSlots(field)}
                  >
                    Quản lý Slots
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={field.status === 1 ? ToggleRight : ToggleLeft}
                  onClick={() => handleToggleStatus(field.id, field.status)}
                >
                  {field.status === 1 ? 'Tắt' : 'Bật'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFields.length === 0 && (
        <div className="ad-field-page__empty">
          <p>Không tìm thấy sân nào</p>
        </div>
      )}

      {/* Modals */}
      {showEditModal && (
        <FieldEditModal
          field={selectedField}
          types={types}
          venues={venues}
          onClose={() => {
            setShowEditModal(false);
            setSelectedField(null);
          }}
          onSave={handleSaveField}
        />
      )}

      {showSlotModal && selectedField && (
        <SlotManagementModal
          field={selectedField}
          slots={getAllFieldSlots(selectedField.id)}
          onClose={() => {
            setShowSlotModal(false);
            setSelectedField(null);
          }}
          onSave={handleSaveSlot}
          onDelete={handleDeleteSlot}
        />
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        message="Bạn có chắc muốn thay đổi trạng thái sân này?"
        onConfirm={confirmAction}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
