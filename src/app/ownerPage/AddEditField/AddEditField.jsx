import React, { useState } from 'react';
import { 
  Upload, 
  MapPin, 
  DollarSign, 
  FileText,
  X,
  Save,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../hooks/ThemeContext';
import './AddEditFieldsCss.css';

const AddEditField = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    pricePerHour: '',
    status: 'Active',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Field name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.pricePerHour || parseFloat(formData.pricePerHour) <= 0) {
      newErrors.pricePerHour = 'Valid price per hour is required';
    }
    if (!formData.image) newErrors.image = 'Field image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    // Reset form or show success
    setFormData({
      name: '',
      location: '',
      description: '',
      pricePerHour: '',
      status: 'Active',
      image: null
    });
    setErrors({});
    alert('Field added successfully!');
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
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, image: files[0] }));
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="add-edit-field">
      <div className="header-section">
        <div className="title-container">
          <h1 className="page-title">
            Add New Field
          </h1>
          <p className="page-description">
            Create a new sports field and configure its settings.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`save-button ${isSubmitting ? 'submitting' : ''}`}
        >
          <Save className="save-icon" />
          {isSubmitting ? 'Saving...' : 'Save Field'}
        </button>
      </div>

      <form className="field-form" onSubmit={handleSubmit}>
        <div className="basic-info-section">
          <h3 className="section-title">
            Basic Information
          </h3>
          <div className="input-grid">
            <div className="input-group">
              <label className="input-label">
                Field Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                className={`text-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter field name"
                required
              />
              {errors.name && (
                <div className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.name}
                </div>
              )}
            </div>
            <div className="input-group">
              <label className="input-label">
                Location
              </label>
              <div className="input-wrapper">
                <MapPin className="input-icon" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  className={`text-input with-icon ${errors.location ? 'error' : ''}`}
                  placeholder="Enter location"
                  required
                />
              </div>
              {errors.location && (
                <div className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.location}
                </div>
              )}
            </div>
            <div className="input-group">
              <label className="input-label">
                Price per Hour
              </label>
              <div className="input-wrapper">
                <DollarSign className="input-icon" />
                <input
                  type="number"
                  value={formData.pricePerHour}
                  onChange={handleInputChange('pricePerHour')}
                  className={`text-input with-icon ${errors.pricePerHour ? 'error' : ''}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              {errors.pricePerHour && (
                <div className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.pricePerHour}
                </div>
              )}
            </div>
            <div className="input-group">
              <label className="input-label">
                Status
              </label>
              <select
                value={formData.status}
                onChange={handleInputChange('status')}
                className="select-field"
              >
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
          </div>
          <div className="description-group">
            <label className="input-label">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={handleInputChange('description')}
              rows={4}
              className="description-textarea"
              placeholder="Describe the field, its features, and any special requirements..."
            />
          </div>
        </div>

        <div className="image-upload-section">
          <h3 className="section-title">
            Field Image
          </h3>
          {!formData.image ? (
            <div
              className={`upload-dropzone ${isDragOver ? 'drag-over' : ''} ${errors.image ? 'error' : ''}`}
              onDragOver={handleDrag}
              onDragEnter={() => setIsDragOver(true)}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <Upload className="upload-icon" />
              <p className="upload-title">
                Upload Field Image
              </p>
              <p className="upload-description">
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
                className="upload-button"
              >
                Choose File
              </label>
            </div>
          ) : (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Field preview"
                className="preview-image"
              />
              <button
                type="button"
                onClick={removeImage}
                className="remove-image-button"
              >
                <X className="remove-icon" />
              </button>
            </div>
          )}
          {errors.image && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              {errors.image}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddEditField;