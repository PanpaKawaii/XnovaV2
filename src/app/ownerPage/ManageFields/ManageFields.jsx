// ManageFields.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  DollarSign,
  Search,
  Filter
} from 'lucide-react';
import { useTheme } from '../../hooks/ThemeContext';
import './ManageFields.css';

function ManageFields({ fields }) {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const fieldList = fields || mockFields;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Under Maintenance': return 'status-maintenance';
      case 'Hidden': return 'status-hidden';
      default: return 'status-default';
    }
  };

  const toggleFieldVisibility = (fieldId) => {
    setFieldsData(prev => prev.map(field => 
      field.id === fieldId 
        ? { ...field, isVisible: !field.isVisible }
        : field
    ));
  };

  const deleteField = (fieldId) => {
    setFieldsData(prev => prev.filter(field => field.id !== fieldId));
  };

  const filteredFields = fieldList.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || field.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`manage-fields ${isDark ? 'dark' : 'light'}`}>
      <div className="header">
        <div>
          <h1 className="title">
            Manage Fields
          </h1>
          <p className="subtitle">
            View and manage all your sports fields and their settings.
          </p>
        </div>
        <button className="add-btn">
          Add New Field
        </button>
      </div>

      <div className="filters-card">
        <div className="filters">
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
          <div className="filter-container">
            <Filter className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
        </div>
      </div>

      <div className="fields-grid">
        {filteredFields.map((field) => (
          <div key={field.id} className="field-card">
            <div className="field-header">
              <h3 className="field-name">
                {field.name}
              </h3>
              <span className={`field-status ${getStatusColor(field.status)}`}>
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
                  ${field.pricePerHour}/hour
                </span>
              </div>
            </div>

            <div className="revenue">
              <span className="revenue-amount">
                ${field.revenue.toLocaleString()}
              </span>
              <span className="revenue-label">
                Total Revenue
              </span>
            </div>

            <div className="actions">
              <button
                onClick={() => toggleFieldVisibility(field.id)}
                className={`action-btn visibility ${field.isVisible ? 'hide' : 'show'}`}
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
              <button className="action-btn edit">
                <Edit className="action-icon" />
                Edit
              </button>
              <button
                onClick={() => deleteField(field.id)}
                className="action-btn delete"
              >
                <Trash2 className="action-icon" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFields.length === 0 && (
        <div className="no-results">
          <div className="emoji">
            🏟️
          </div>
          <h3 className="no-results-title">
            No fields found
          </h3>
          <p className="no-results-text">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

ManageFields.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
    status: PropTypes.oneOf(['Active', 'Under Maintenance', 'Hidden']),
    bookings: PropTypes.number,
    revenue: PropTypes.number,
    pricePerHour: PropTypes.number,
    description: PropTypes.string,
    image: PropTypes.string,
    isVisible: PropTypes.bool
  }))
};

// Mock data cho ManageFields
const mockFields = [
  { id: '1', name: 'Premier Field A', location: 'Downtown', status: 'Active', bookings: 45, revenue: 8900, pricePerHour: 80, description: 'Professional grade field with LED lighting', isVisible: true },
  { id: '2', name: 'Champions Ground', location: 'Westside', status: 'Active', bookings: 38, revenue: 7200, pricePerHour: 75, description: 'Newly renovated with artificial turf', isVisible: true },
  { id: '3', name: 'Victory Stadium', location: 'Eastend', status: 'Active', bookings: 32, revenue: 6100, pricePerHour: 70, description: 'Traditional grass field with spectator seating', isVisible: true },
  { id: '4', name: 'Green Park Field', location: 'Northside', status: 'Under Maintenance', bookings: 0, revenue: 0, pricePerHour: 65, description: 'Community field under renovation', isVisible: false },
  { id: '5', name: 'Elite Training Ground', location: 'Central', status: 'Hidden', bookings: 0, revenue: 0, pricePerHour: 90, description: 'High-end training facility', isVisible: false }
];

export default ManageFields;