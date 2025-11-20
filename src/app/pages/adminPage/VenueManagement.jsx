import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Edit, ToggleLeft, ToggleRight, MapPin, Building2, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { SearchInput } from '../../components/admincomponents/UI/SearchInput';
import { FilterSelect } from '../../components/admincomponents/UI/FilterSelect';
import { StatusBadge } from '../../components/admincomponents/UI/StatusBadge';
import { Button } from '../../components/admincomponents/UI/Button';
import { fetchData, postData, putData, deleteData } from '../../../mocks/CallingAPI';
import { useAuth } from '../../hooks/AuthContext/AuthContext';
import './VenueManagement.css';

export const VenueManagement = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [venues, setVenues] = useState([]);
  const [fields, setFields] = useState([]);
  const [owners, setOwners] = useState([]);
  const [slots, setSlots] = useState([]);
  const [images, setImages] = useState([]);
  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedVenue, setExpandedVenue] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Set owner filter from URL query parameter
  useEffect(() => {
    const ownerIdFromUrl = searchParams.get('ownerId');
    if (ownerIdFromUrl) {
      setOwnerFilter(ownerIdFromUrl);
    }
  }, [searchParams]);

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, [user, refreshKey]);

  // Debounce search input -> searchTerm
  useEffect(() => {
    const id = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const fetchAllData = async () => {
    setLoading(true);
    const token = user?.token || null;
    
    try {
      // Fetch in parallel with per-endpoint fallback
      const [venuesResponse, fieldsResponse, usersResponse, slotsResponse, imagesResponse] = await Promise.all([
        fetchData('Venue', token).catch(() => []),
        fetchData('Field', token).catch(() => []),
        fetchData('User', token).catch(() => []),
        fetchData('Slot', token).catch(() => []),
        fetchData('Image', token).catch(() => []),
      ]);

      const venuesData = Array.isArray(venuesResponse) ? venuesResponse : (venuesResponse ? [venuesResponse] : []);
      const fieldsData = Array.isArray(fieldsResponse) ? fieldsResponse : (fieldsResponse ? [fieldsResponse] : []);
      const usersData = Array.isArray(usersResponse) ? usersResponse : (usersResponse ? [usersResponse] : []);
      const slotsData = Array.isArray(slotsResponse) ? slotsResponse : (slotsResponse ? [slotsResponse] : []);
      const imagesData = Array.isArray(imagesResponse) ? imagesResponse : (imagesResponse ? [imagesResponse] : []);
      
      setVenues(venuesData);
      setFields(fieldsData);
      setOwners(usersData);
      setSlots(slotsData);
      setImages(imagesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle venue status
  const handleToggleStatus = async (venueId, currentStatus) => {
    const token = user?.token || null;
    
    try {
      if (typeof window !== 'undefined' && !window.confirm('Bạn có chắc muốn thay đổi trạng thái venue này?')) {
        return;
      }
      const venue = venues.find(v => v.id === venueId);
      const updatedVenue = {
        ...venue,
        status: currentStatus === 1 ? 0 : 1
      };
      
      await putData(`Venue/${venueId}`, updatedVenue, token);
      await fetchAllData(); // Refresh data
    } catch (err) {
      console.error('Error toggling venue status:', err);
      alert('Không thể thay đổi trạng thái venue');
    }
  };

  // Helpers for better performance
  const ownersById = useMemo(() => Object.fromEntries(owners.map(o => [o.id, o])), [owners]);
  const imagesByVenueId = useMemo(() => images.reduce((acc, img) => {
    if (!acc[img.venueId]) acc[img.venueId] = [];
    acc[img.venueId].push(img);
    return acc;
  }, {}), [images]);
  const fieldsByVenueId = useMemo(() => fields.reduce((acc, f) => {
    if (!acc[f.venueId]) acc[f.venueId] = [];
    acc[f.venueId].push(f);
    return acc;
  }, {}), [fields]);
  const slotsByFieldId = useMemo(() => slots.reduce((acc, s) => {
    if (!acc[s.fieldId]) acc[s.fieldId] = [];
    acc[s.fieldId].push(s);
    return acc;
  }, {}), [slots]);

  const normalize = (s) => (s || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Filter venues (memoized)
  const filteredVenues = useMemo(() => {
    const q = normalize(searchTerm);
    return venues.filter(venue => {
      const owner = ownersById[venue.userId];
      const matchesSearch =
        normalize(venue.name).includes(q) ||
        normalize(venue.location).includes(q) ||
        normalize(owner?.name || owner?.email || '').includes(q);

      const matchesStatus = !statusFilter || venue.status === parseInt(statusFilter);
      const matchesOwner = !ownerFilter || venue.userId === parseInt(ownerFilter);

      return matchesSearch && matchesStatus && matchesOwner;
    });
  }, [venues, ownersById, searchTerm, statusFilter, ownerFilter]);

  // Get venue fields
  const getVenueFields = (venueId) => fieldsByVenueId[venueId] || [];

  // Get venue images
  const getVenueImages = (venueId) => (imagesByVenueId[venueId] || []).filter(img => img.status === 1);

  // Get field slots
  const getFieldSlots = (fieldId) => (slotsByFieldId[fieldId] || []).filter(slot => slot.status === 1);

  // Get owner info
  const getOwnerInfo = (userId) => ownersById[userId];

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Toggle expanded venue
  const toggleExpanded = (venueId) => {
    setExpandedVenue(expandedVenue === venueId ? null : venueId);
  };

  const handleRefresh = () => setRefreshKey(k => k + 1);

  const handleExportCsv = useCallback(() => {
    // Build CSV rows
    const header = ['VenueId','VenueName','Location','Owner','Phone','FieldsCount','ActiveFields','CreatedAt'];
    const rows = filteredVenues.map(v => {
      const owner = getOwnerInfo(v.userId);
      const vFields = getVenueFields(v.id);
      const activeFields = vFields.filter(f => f.status === 1).length;
      return [
        v.id,
        (v.name || '').replaceAll('"', '""'),
        (v.location || '').replaceAll('"', '""'),
        ((owner?.name || owner?.email || 'N/A').replaceAll('"','""')),
        v.phone || '',
        vFields.length,
        activeFields,
        v.currentDate ? new Date(v.currentDate).toISOString() : ''
      ];
    });

    const csv = [header, ...rows]
      .map(cols => cols.map(val => `"${val}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'venues.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredVenues]);

  // Get unique owners for filter
  const uniqueOwners = [...new Set(venues.map(v => v.userId))]
    .map(userId => owners.find(o => o.id === userId))
    .filter(Boolean);

  const statusOptions = [
    { value: '1', label: 'Hoạt động' },
    { value: '0', label: 'Không hoạt động' }
  ];

  const ownerOptions = uniqueOwners.map(owner => ({
    value: owner.id.toString(),
    label: owner.name || owner.email
  }));

  return (
    <div className="ad-venue-page">
      {loading && (
        <div className="ad-owner-page__loading">Đang tải dữ liệu...</div>
      )}
      {error && (
        <div className="ad-venue-page__error">Lỗi: {error}</div>
      )}

      {/* Header */}
      <div className="ad-venue-page__header">
        <h1 className="ad-venue-page__title">
          Quản lý Venue
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={handleRefresh}>
            Làm mới
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => alert('Form thêm Venue sẽ được triển khai sau') }>
            Thêm Venue mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="ad-venue-page__filters">
        <SearchInput
          placeholder="Tìm kiếm tên venue, địa điểm, chủ sở hữu..."
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
          options={ownerOptions}
          value={ownerFilter}
          onChange={setOwnerFilter}
          placeholder="Lọc theo chủ sở hữu"
        />
        <Button variant="secondary" size="sm" onClick={handleExportCsv}>
          Xuất danh sách
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="ad-venue-page__stats">
        <div className="ad-venue-page__stat-card">
          <div className="ad-venue-page__stat-icon ad-venue-page__stat-icon--blue">
            <Building2 className="ad-venue-page__icon" />
          </div>
          <div className="ad-venue-page__stat-content">
            <p className="ad-venue-page__stat-label">Tổng số Venue</p>
            <p className="ad-venue-page__stat-value">{venues.length}</p>
          </div>
        </div>
        <div className="ad-venue-page__stat-card">
          <div className="ad-venue-page__stat-icon ad-venue-page__stat-icon--green">
            <Building2 className="ad-venue-page__icon" />
          </div>
          <div className="ad-venue-page__stat-content">
            <p className="ad-venue-page__stat-label">Đang hoạt động</p>
            <p className="ad-venue-page__stat-value">
              {venues.filter(v => v.status === 1).length}
            </p>
          </div>
        </div>
        <div className="ad-venue-page__stat-card">
          <div className="ad-venue-page__stat-icon ad-venue-page__stat-icon--yellow">
            <MapPin className="ad-venue-page__icon" />
          </div>
          <div className="ad-venue-page__stat-content">
            <p className="ad-venue-page__stat-label">Tổng số sân</p>
            <p className="ad-venue-page__stat-value">
              {fields.length}
            </p>
          </div>
        </div>
        <div className="ad-venue-page__stat-card">
          <div className="ad-venue-page__stat-icon ad-venue-page__stat-icon--purple">
            <User className="ad-venue-page__icon" />
          </div>
          <div className="ad-venue-page__stat-content">
            <p className="ad-venue-page__stat-label">Chủ sở hữu</p>
            <p className="ad-venue-page__stat-value">
              {uniqueOwners.length}
            </p>
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="ad-venue-page__grid">
        {filteredVenues.map((venue) => {
          const venueFields = getVenueFields(venue.id);
          const venueImages = getVenueImages(venue.id);
          const owner = getOwnerInfo(venue.userId);
          const isExpanded = expandedVenue === venue.id;
          
          return (
            <div key={venue.id} className="ad-venue-card">
              {/* Venue Header with Image */}
              <div className="ad-venue-card__image-container">
                <img 
                  src={venueImages.length > 0 ? venueImages[0].name : 'https://i.pinimg.com/736x/30/e8/00/30e8005d937ed7f5eefd42a31761860e.jpg'} 
                  alt={venue.name}
                  className="ad-venue-card__image"
                />
                <div className="ad-venue-card__image-overlay">
                  <StatusBadge status={venue.status === 1 ? 'active' : 'inactive'} type="venue" />
                </div>
              </div>

              <div className="ad-venue-card__header">
                <div className="ad-venue-card__info">
                  <h3 className="ad-venue-card__name">
                    {venue.name}
                  </h3>
                  <p className="ad-venue-card__location">
                    <MapPin size={16} /> {venue.location}
                  </p>
                </div>
              </div>

              <div className="ad-venue-card__details">
                <div className="ad-venue-card__detail-row">
                  <span className="ad-venue-card__detail-label">Chủ sở hữu:</span>
                  <span className="ad-venue-card__detail-value">
                    {owner?.name || owner?.email || 'N/A'}
                  </span>
                </div>
                <div className="ad-venue-card__detail-row">
                  <span className="ad-venue-card__detail-label">Số điện thoại:</span>
                  <span className="ad-venue-card__detail-value">
                    {venue.contact || 'N/A'}
                  </span>
                </div>
                <div className="ad-venue-card__detail-row">
                  <span className="ad-venue-card__detail-label">Số sân:</span>
                  <span className="ad-venue-card__detail-value">
                    {venueFields.length} sân
                  </span>
                </div>
                {/* Ngày tạo removed */}
              </div>

              {venue.description && (
                <p className="ad-venue-card__description">
                  {venue.description}
                </p>
              )}

              {/* Fields Section - Expandable */}
              {venueFields.length > 0 && (
                <div className="ad-venue-card__fields">
                  <button 
                    className="ad-venue-card__expand-button"
                    onClick={() => toggleExpanded(venue.id)}
                  >
                    <span>Xem danh sách sân ({venueFields.length})</span>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {isExpanded && (
                    <div className="ad-venue-card__fields-list">
                      {venueFields.map(field => {
                        const fieldSlots = getFieldSlots(field.id);
                        const avgPrice = fieldSlots.length > 0 
                          ? fieldSlots.reduce((sum, s) => sum + (s.price || 0), 0) / fieldSlots.length 
                          : 0;

                        return (
                          <div key={field.id} className="ad-field-item">
                            <div className="ad-field-item__header">
                              <h4 className="ad-field-item__name">{field.name}</h4>
                              <StatusBadge 
                                status={field.status === 1 ? 'active' : 'inactive'} 
                                type="field" 
                              />
                            </div>
                            <div className="ad-field-item__details">
                              <div className="ad-field-item__detail">
                                <span className="ad-field-item__label">Giá TB:</span>
                                <span className="ad-field-item__value">
                                  {formatCurrency(avgPrice)}/giờ
                                </span>
                              </div>
                              <div className="ad-field-item__detail">
                                <span className="ad-field-item__label">Số slot:</span>
                                <span className="ad-field-item__value">
                                  {fieldSlots.length} slots
                                </span>
                              </div>
                            </div>
                            {field.description && (
                              <p className="ad-field-item__description">
                                {field.description}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="ad-venue-card__actions">
                <div className="ad-venue-card__button-group">
                  <Button variant="ghost" size="sm" icon={Edit}>
                    Sửa
                  </Button>
                  <Button variant="ghost" size="sm" icon={MapPin}>
                    Xem sân
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={venue.status === 1 ? ToggleRight : ToggleLeft}
                  onClick={() => handleToggleStatus(venue.id, venue.status)}
                >
                  {venue.status === 1 ? 'Tắt' : 'Bật'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVenues.length === 0 && (
        <div className="ad-venue-page__empty">
          <p>Không tìm thấy venue nào</p>
        </div>
      )}
    </div>
  );
};

export default VenueManagement;
