// AddEditField.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Upload, 
  MapPin, 
  DollarSign, 
  X,
  Save
} from 'lucide-react';
import { useTheme } from '../../hooks/ThemeContext';
import './AddEditField.css';

function AddEditField() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    pricePerHour: '',
    status: 'Active',
    image: null
  });
  const [isDragOver, setIsDragOver ] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  return (
    <div className={`add-edit-field ${isDark ? 'dark' : 'light'}`}>
      <div className="header">
        <div>
          <h1 className="title">
            Add New Field
          </h1>
          <p className="subtitle">
            Create a new sports field and configure its settings.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          className="btn save-btn"
        >
          <Save className="icon mr" />
          Save Field
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="card">
          <h3 className="section-title">
            Basic Information
          </h3>
          <div className="grid">
            <div>
              <label className="label" htmlFor="name">
                Field Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input"
                placeholder="Enter field name"
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="location">
                Location
              </label>
              <div className="input-container">
                <MapPin className="icon" />
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="input with-icon"
                  placeholder="Enter location"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="pricePerHour">
                Price per Hour
              </label>
              <div className="input-container">
                <DollarSign className="icon" />
                <input
                  type="number"
                  id="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: e.target.value }))}
                  className="input with-icon"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="select"
              >
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
          </div>
          <div className="mt">
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="textarea"
              placeholder="Describe the field, its features, and any special requirements..."
            />
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">
            Field Image
          </h3>
          {!formData.image ? (
            <div
              onDragOver={handleDrag}
              onDragEnter={() => setIsDragOver(true)}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
            >
              <Upload className="upload-icon" />
              <p className="upload-title">
                Upload Field Image
              </p>
              <p className="upload-desc">
                Drag and drop an image here, or click to browse
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="btn choose-file"
              >
                Choose File
              </label>
            </div>
          ) : (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Field preview"
                className="preview-img"
              />
              <button
                type="button"
                onClick={removeImage}
                className="remove-btn"
              >
                <X className="icon" />
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

AddEditField.propTypes = {};

export default AddEditField;