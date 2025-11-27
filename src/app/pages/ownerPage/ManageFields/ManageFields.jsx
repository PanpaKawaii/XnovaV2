import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  DollarSign,
  Search,
  Filter,
  Settings,
  Plus
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../hooks/ThemeContext';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { fetchData, putData, deleteData, postData } from '../../../../mocks/CallingAPI.js';
import { FieldEditModal } from './components/FieldEditModal';
import { SlotManagementModal } from './components/SlotManagementModal';

import './ManageFields.css';

const ManageFields = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [venueFilter, setVenueFilter] = useState('all');
  const [fieldsData, setFieldsData] = useState([]);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [types, setTypes] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedFieldId, setHighlightedFieldId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, [user]);

  useEffect(() => {
    // Get fieldId and venueId from URL params
    const fieldIdFromUrl = searchParams.get('fieldId');
    const venueIdFromUrl = searchParams.get('venueId');
    
    if (venueIdFromUrl) {
      setVenueFilter(venueIdFromUrl);
    }
    
    if (fieldIdFromUrl) {
      const fieldId = parseInt(fieldIdFromUrl);
      setHighlightedFieldId(fieldId);
      
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
  }, [searchParams, fieldsData]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = user?.token;
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch data in parallel
      const [fieldsResponse, venuesResponse, bookingsResponse, typesResponse, slotsResponse] = await Promise.all([
        fetchData('field', token).catch(() => []),
        fetchData('venue', token).catch(() => []),
        fetchData('booking', token).catch(() => []),
        fetchData('type', token).catch(() => []),
        fetchData('slot', token).catch(() => [])
      ]);

      // Normalize to arrays
      const normalizedFields = Array.isArray(fieldsResponse) ? fieldsResponse : [];
      const normalizedVenues = Array.isArray(venuesResponse) ? venuesResponse : [];
      const normalizedBookings = Array.isArray(bookingsResponse) ? bookingsResponse : [];
      const normalizedTypes = Array.isArray(typesResponse) ? typesResponse : [];
      const normalizedSlots = Array.isArray(slotsResponse) ? slotsResponse : [];

      // Filter owner's venues and fields
      const ownerVenues = normalizedVenues.filter(v => v.userId === user.id);
      const ownerVenueIds = ownerVenues.map(v => v.id);
      const ownerFields = normalizedFields.filter(f => ownerVenueIds.includes(f.venueId));

      // Calculate bookings and revenue for each field
      const fieldsWithStats = ownerFields.map(field => {
        const fieldBookings = normalizedBookings.filter(b => b.fieldId === field.id);
        const bookingCount = fieldBookings.length;
        
        let totalRevenue = 0;
        fieldBookings.forEach(booking => {
          if (Array.isArray(booking.payments)) {
            booking.payments.forEach(payment => {
              if (typeof payment.amount === 'number') {
                totalRevenue += payment.amount;
              }
            });
          }
        });

        // Find venue for location
        const venue = ownerVenues.find(v => v.id === field.venueId);

        return {
          ...field,
          bookings: bookingCount,
          revenue: totalRevenue,
          location: venue?.address || venue?.location || 'N/A',
          pricePerHour: field.price || 0,
          status: field.status === 1 ? 'Active' : field.status === 0 ? 'Hidden' : 'Under Maintenance',
          isVisible: field.status === 1
        };
      });

      setFieldsData(fieldsWithStats);
      setVenues(ownerVenues);
      setBookings(normalizedBookings);
      setTypes(normalizedTypes);
      setSlots(normalizedSlots);
      setError(null);
    } catch (err) {
      console.error('Error fetching fields data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Under Maintenance': return 'status-maintenance';
      case 'Hidden': return 'status-hidden';
      default: return 'status-default';
    }
  };

  const toggleFieldVisibility = async (fieldId) => {
    const token = user?.token;
    if (!token) return;

    try {
      const field = fieldsData.find(f => f.id === fieldId);
      const newStatus = field.status === 'Active' ? 0 : 1;
      
      const updatedField = {
        ...field,
        status: newStatus
      };

      await putData(`field/${fieldId}`, updatedField, token);
      
      // Update local state
      setFieldsData(prev => prev.map(f => 
        f.id === fieldId 
          ? { 
              ...f, 
              status: newStatus === 1 ? 'Active' : 'Hidden',
              isVisible: newStatus === 1 
            }
          : f
      ));
    } catch (err) {
      console.error('Error toggling field visibility:', err);
      alert('Không thể thay đổi trạng thái sân. Vui lòng thử lại.');
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
      // Ensure status is a number
      const normalizedFieldData = {
        ...fieldData,
        status: typeof fieldData.status === 'number' ? fieldData.status : (fieldData.status === 'Active' ? 1 : 0),
        typeId: parseInt(fieldData.typeId),
        venueId: parseInt(fieldData.venueId)
      };

      if (fieldData.id) {
        // Update existing field
        await putData(`field/${fieldData.id}`, normalizedFieldData, token);
      } else {
        // Create new field
        await postData('field', normalizedFieldData, token);
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
        await putData(`slot/${slotData.id}`, slotData, token);
      } else {
        // Create new slot
        await postData('slot', slotData, token);
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
      await deleteData(`slot/${slotId}`, token);
      await fetchAllData();
    } catch (err) {
      console.error('Error deleting slot:', err);
      throw err;
    }
  };

  const deleteField = async (fieldId) => {
    const token = user?.token;
    if (!token) return;

    if (!window.confirm('Bạn có chắc chắn muốn xóa sân này?')) {
      return;
    }

    try {
      await deleteData(`field/${fieldId}`, token);
      
      // Update local state
      setFieldsData(prev => prev.filter(field => field.id !== fieldId));
    } catch (err) {
      console.error('Error deleting field:', err);
      alert('Không thể xóa sân. Vui lòng thử lại.');
    }
  };

  const filteredFields = fieldsData.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || field.status === statusFilter;
    const matchesVenue = venueFilter === 'all' || field.venueId === parseInt(venueFilter);
    return matchesSearch && matchesStatus && matchesVenue;
  });

  return (
    <div className="manage-fields-wrapper">
      {loading && (
        <div className="reports-loading">Đang tải dữ liệu...</div>
      )}

      {error && (
        <div className="reports-error">Lỗi: {error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="header-section">
            <div className="title-container">
              <h1 className="page-title">
                Manage Fields
              </h1>
              <p className="page-description">
                View and manage all your sports fields and their settings.
              </p>
            </div>
            <button className="add-button" onClick={() => navigate('/owner/add-field')}>
              <Plus size={20} />
              Add New Field
            </button>
          </div>

          <div className="filter-container">
            <div className="filter-wrapper">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="status-container">
                <Filter className="filter-icon" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="status-select"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
              <div className="status-container">
                <Filter className="filter-icon" />
                <select
                  value={venueFilter}
                  onChange={(e) => setVenueFilter(e.target.value)}
                  className="status-select"
                >
                  <option value="all">All Venues</option>
                  {venues.map(venue => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="fields-grid">
            {filteredFields.map((field) => (
              <div 
                key={`manage-fields-${field.id}`} 
                id={`field-${field.id}`}
                className={`field-card ${highlightedFieldId === field.id ? 'highlighted' : ''}`}
              >
                <div className="field-header">
                  <h3 className="field-name">
                    {field.name}
                  </h3>
                  <span className={`status-badge ${getStatusClass(field.status)}`}>
                    {field.status}
                  </span>
                </div>
                
                <div className="field-info">
                  <div className="info-item">
                    <MapPin className="info-icon" />
                    <span className="info-text">
                      {field.location}
                    </span>
                  </div>
                  <div className="info-item">
                    <Calendar className="info-icon" />
                    <span className="info-text">
                      {field.bookings} bookings
                    </span>
                  </div>
                  <div className="info-item">
                    <DollarSign className="info-icon" />
                    <span className="info-text">
                      {field.pricePerHour.toLocaleString()}đ/hour
                    </span>
                  </div>
                </div>

                <div className="revenue-section">
                  <span className="revenue-amount">
                    {field.revenue.toLocaleString()}đ
                  </span>
                  <span className="revenue-label">
                    Total Revenue
                  </span>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={() => toggleFieldVisibility(field.id)}
                    className={`visibility-button ${field.isVisible ? 'visibility-visible' : 'visibility-hidden'}`}
                  >
                    {field.isVisible ? (
                      <>
                        <Eye className="action-icon" />
                        Hide
                      </>
                    ) : (
                      <>
                        <EyeOff className="action-icon" />
                        Show
                      </>
                    )}
                  </button>
                  <button 
                    className="edit-button"
                    onClick={() => handleEditField(field)}
                  >
                    <Edit className="action-icon" />
                    Edit
                  </button>
                  <button
                    className="settings-button"
                    onClick={() => handleManageSlots(field)}
                  >
                    <Settings className="action-icon" />
                    Slots
                  </button>
                  <button
                    onClick={() => deleteField(field.id)}
                    className="delete-button"
                  >
                    <Trash2 className="action-icon" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFields.length === 0 && (
            <div className="no-fields-container">
              <div className="no-fields-icon">
                🏟️
              </div>
              <h3 className="no-fields-title">
                No fields found
              </h3>
              <p className="no-fields-description">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </>
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
          slots={slots.filter(s => s.fieldId === selectedField.id)}
          onClose={() => {
            setShowSlotModal(false);
            setSelectedField(null);
          }}
          onSave={handleSaveSlot}
          onDelete={handleDeleteSlot}
        />
      )}
    </div>
  );
};

export default ManageFields;