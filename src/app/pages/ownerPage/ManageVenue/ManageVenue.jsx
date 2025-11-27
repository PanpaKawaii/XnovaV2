import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Edit, 
  ToggleLeft, 
  ToggleRight, 
  MapPin, 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  Eye,
  Search,
  Filter,
  Trash2,
  List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../hooks/ThemeContext';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { fetchData, putData, deleteData } from '../../../../mocks/CallingAPI.js';
import './ManageVenue.css';

const ManageVenue = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [venues, setVenues] = useState([]);
  const [fields, setFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedVenue, setExpandedVenue] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, [user]);

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
      const [venuesResponse, fieldsResponse] = await Promise.all([
        fetchData('venue', token).catch(() => []),
        fetchData('field', token).catch(() => [])
      ]);

      // Normalize to arrays
      const normalizedVenues = Array.isArray(venuesResponse) ? venuesResponse : [];
      const normalizedFields = Array.isArray(fieldsResponse) ? fieldsResponse : [];

      // Filter owner's venues
      const ownerVenues = normalizedVenues.filter(v => v.userId === user.id);

      setVenues(ownerVenues);
      setFields(normalizedFields);
      setError(null);
    } catch (err) {
      console.error('Error fetching venues data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return status === 1 ? 'status-active' : 'status-inactive';
  };

  const getStatusText = (status) => {
    return status === 1 ? 'Active' : 'Inactive';
  };

  const toggleVenueStatus = async (venueId) => {
    const token = user?.token;
    if (!token) return;

    try {
      const venue = venues.find(v => v.id === venueId);
      const newStatus = venue.status === 1 ? 0 : 1;
      
      const updatedVenue = {
        ...venue,
        status: newStatus
      };

      await putData(`venue/${venueId}`, updatedVenue, token);
      
      // Update local state
      setVenues(prev => prev.map(v => 
        v.id === venueId 
          ? { ...v, status: newStatus }
          : v
      ));
    } catch (err) {
      console.error('Error toggling venue status:', err);
      alert('Không thể thay đổi trạng thái venue. Vui lòng thử lại.');
    }
  };

  const deleteVenue = async (venueId) => {
    const token = user?.token;
    if (!token) return;

    // Check if venue has fields
    const venueFields = fields.filter(f => f.venueId === venueId);
    if (venueFields.length > 0) {
      alert(`Không thể xóa venue này vì còn ${venueFields.length} sân đang hoạt động. Vui lòng xóa tất cả các sân trước.`);
      return;
    }

    if (!window.confirm('Bạn có chắc chắn muốn xóa venue này?')) {
      return;
    }

    try {
      await deleteData(`venue/${venueId}`, token);
      
      // Update local state
      setVenues(prev => prev.filter(v => v.id !== venueId));
    } catch (err) {
      console.error('Error deleting venue:', err);
      alert('Không thể xóa venue. Vui lòng thử lại.');
    }
  };

  const toggleExpanded = (venueId) => {
    setExpandedVenue(expandedVenue === venueId ? null : venueId);
  };

  const getVenueFields = (venueId) => {
    return fields.filter(f => f.venueId === venueId);
  };

  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      const matchesSearch = venue.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           venue.address?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && venue.status === 1) ||
                           (statusFilter === 'inactive' && venue.status === 0);
      return matchesSearch && matchesStatus;
    });
  }, [venues, searchTerm, statusFilter]);

  return (
    <div className="manage-venue-wrapper">
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
              <h1 className="page-title">Manage Venues</h1>
              <p className="page-description">
                View and manage all your venues and their fields.
              </p>
            </div>
            <button className="add-button" onClick={() => navigate('/owner/add-venue')}>
              <Plus size={20} />
              Add New Venue
            </button>
          </div>

          <div className="filter-container">
            <div className="filter-wrapper">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search venues..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="venues-list">
            {filteredVenues.map((venue) => {
              const venueFields = getVenueFields(venue.id);
              const isExpanded = expandedVenue === venue.id;

              return (
                <div key={venue.id} className="venue-card">
                  <div className="venue-header">
                    <div className="venue-info">
                      <div className="venue-title-row">
                        <Building2 className="venue-icon" />
                        <h3 className="venue-name">{venue.name}</h3>
                        <span className={`status-badge ${getStatusClass(venue.status)}`}>
                          {getStatusText(venue.status)}
                        </span>
                      </div>
                      <div className="venue-details">
                        <MapPin className="detail-icon" size={16} />
                        <span className="venue-address">{venue.address}</span>
                      </div>
                      <div className="venue-stats">
                        <span className="stat-item">
                          {venueFields.length} Fields
                        </span>
                        <span className="stat-item">
                          Contact: {venue.contact || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="venue-actions">
                      <button
                        onClick={() => navigate(`/owner/manage-fields?venueId=${venue.id}`)}
                        className="view-fields-button"
                        title="View All Fields"
                      >
                        <List size={20} />
                      </button>
                      <button
                        onClick={() => toggleVenueStatus(venue.id)}
                        className={`toggle-button ${venue.status === 1 ? 'active' : 'inactive'}`}
                        title={venue.status === 1 ? 'Deactivate' : 'Activate'}
                      >
                        {venue.status === 1 ? (
                          <ToggleRight size={20} />
                        ) : (
                          <ToggleLeft size={20} />
                        )}
                      </button>
                      <button
                        onClick={() => navigate(`/owner/edit-venue/${venue.id}`)}
                        className="edit-button"
                        title="Edit"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => deleteVenue(venue.id)}
                        className="delete-button"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button
                        onClick={() => toggleExpanded(venue.id)}
                        className="expand-button"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="venue-fields">
                      <div className="fields-header">
                        <h4>Fields in this Venue</h4>
                        <div className="fields-header-actions">
                          <button
                            onClick={() => navigate(`/owner/manage-fields?venueId=${venue.id}`)}
                            className="view-all-fields-button"
                          >
                            <List size={16} />
                            View All
                          </button>
                          <button
                            onClick={() => navigate(`/owner/add-field?venueId=${venue.id}`)}
                            className="add-field-button"
                          >
                            <Plus size={16} />
                            Add Field
                          </button>
                        </div>
                      </div>
                      {venueFields.length > 0 ? (
                        <div className="fields-grid">
                          {venueFields.map((field) => (
                            <div key={field.id} className="field-item">
                              <div className="field-item-header">
                                <span className="field-name">{field.name}</span>
                                <span className={`field-status ${field.status === 1 ? 'active' : 'inactive'}`}>
                                  {field.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <p className="field-description">{field.description || 'No description'}</p>
                              <div className="field-actions">
                                <button
                                  onClick={() => navigate(`/owner/manage-fields?fieldId=${field.id}`)}
                                  className="view-field-button"
                                >
                                  <Eye size={14} />
                                  View Details
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-fields">
                          <p>No fields in this venue yet.</p>
                          <button
                            onClick={() => navigate(`/owner/add-field?venueId=${venue.id}`)}
                            className="add-first-field-button"
                          >
                            Add First Field
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredVenues.length === 0 && (
            <div className="no-venues-container">
              <div className="no-venues-icon">
                <Building2 size={64} />
              </div>
              <h3 className="no-venues-title">No venues found</h3>
              <p className="no-venues-description">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first venue.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => navigate('/owner/add-venue')}
                  className="add-first-venue-button"
                >
                  <Plus size={20} />
                  Add First Venue
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageVenue;
