import React, { useState } from 'react';
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

const ManageFields = ({ fields }) => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fieldsData, setFieldsData] = useState(fields);

  const getStatusClass = (status) => {
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

  const filteredFields = fieldsData.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || field.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="manage-fields-wrapper">
      <div className="header-section">
        <div className="title-container">
          <h1 className="page-title">
            Manage Fields
          </h1>
          <p className="page-description">
            View and manage all your sports fields and their settings.
          </p>
        </div>
        <button className="add-button">
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
        </div>
      </div>

      <div className="fields-grid">
        {filteredFields.map((field) => (
          <div key={`manage-fields-${field.id}`} className="field-card">
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
                  ${field.pricePerHour}/hour
                </span>
              </div>
            </div>

            <div className="revenue-section">
              <span className="revenue-amount">
                ${field.revenue.toLocaleString()}
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
              <button className="edit-button">
                <Edit className="action-icon" />
                Edit
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
    </div>
  );
};

export default ManageFields;