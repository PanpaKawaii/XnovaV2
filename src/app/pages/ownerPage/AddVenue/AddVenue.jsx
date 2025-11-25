import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Upload, X, ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { postData } from '../../../../mocks/CallingAPI';
import './AddVenue.css';

const AddVenue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    longitude: '',
    latitude: '',
    contact: '',
    status: 1,
    userId: user?.id || 0
  });

  const [imageLinks, setImageLinks] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Update userId when user changes
  useEffect(() => {
    if (user?.id) {
      setFormData(prev => ({ ...prev, userId: user.id }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? parseInt(value) : value
    }));
  };

  // Image link handlers
  const handleAddImageLink = () => {
    setImageLinks([...imageLinks, '']);
  };

  const handleImageLinkChange = (index, value) => {
    const updated = [...imageLinks];
    updated[index] = value;
    setImageLinks(updated);
  };

  const handleRemoveImageLink = (index) => {
    if (imageLinks.length > 1) {
      setImageLinks(imageLinks.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Tên venue không được để trống');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Địa chỉ không được để trống');
      return false;
    }
    if (!formData.contact.trim()) {
      setError('Số điện thoại liên hệ không được để trống');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = user?.token;
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này');
      }

      // Prepare venue data
      const venuePayload = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        longitude: formData.longitude.trim() || null,
        latitude: formData.latitude.trim() || null,
        contact: formData.contact.trim(),
        status: formData.status,
        userId: formData.userId
      };

      // Create venue
      const createdVenue = await postData('Venue', venuePayload, token);
      const venueId = createdVenue.id || createdVenue;

      // Add images if provided
      const validImageLinks = imageLinks.filter(link => link.trim() !== '');
      if (validImageLinks.length > 0 && venueId) {
        await Promise.all(
          validImageLinks.map((link, index) =>
            postData('Image', {
              name: `${formData.name} - Image ${index + 1}`,
              link: link.trim(),
              status: 1,
              venueId: venueId
            }, token).catch(err => 
              console.error(`Failed to create image:`, err)
            )
          )
        );
      }

      setSuccess(true);
      
      // Redirect to manage venues after 2 seconds
      setTimeout(() => {
        navigate('/owner/manage-venues');
      }, 2000);

    } catch (err) {
      console.error('Error creating venue:', err);
      setError(err.message || 'Không thể tạo venue. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/owner/manage-venues');
  };

  return (
    <div className="add-venue-wrapper">
      <div className="add-venue-container">
        <div className="add-venue-header">
          <button className="back-button" onClick={handleCancel}>
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <h1 className="page-title">Thêm Venue Mới</h1>
        </div>

        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <p>Tạo venue thành công! Đang chuyển hướng...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-venue-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <h2 className="section-title">Thông tin cơ bản</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Tên venue <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Nhập tên venue"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Trạng thái
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Không hoạt động</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Địa chỉ <span className="required">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                placeholder="Nhập địa chỉ venue"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="longitude" className="form-label">
                  Kinh độ (Longitude)
                </label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ví dụ: 106.6297"
                />
              </div>

              <div className="form-group">
                <label htmlFor="latitude" className="form-label">
                  Vĩ độ (Latitude)
                </label>
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ví dụ: 10.8231"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contact" className="form-label">
                Số điện thoại liên hệ <span className="required">*</span>
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="form-input"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>

          {/* Image Section */}
          <div className="form-section">
            <h2 className="section-title">Hình ảnh venue</h2>
            <p className="section-description">
              Thêm hình ảnh để khách hàng có thể nhìn thấy venue của bạn
            </p>

            <div className="image-links-container">
              {imageLinks.map((link, index) => (
                <div key={index} className="image-link-group">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => handleImageLinkChange(index, e.target.value)}
                    className="form-input"
                    placeholder="Nhập URL hình ảnh (https://...)"
                  />
                  {imageLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageLink(index)}
                      className="remove-link-button"
                      title="Xóa link này"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddImageLink}
                className="add-link-button"
              >
                <Plus size={20} />
                Thêm link ảnh
              </button>
            </div>

            {/* Image preview */}
            {imageLinks.some(link => link.trim() !== '') && (
              <div className="image-preview-container">
                <h3 className="preview-title">Xem trước:</h3>
                <div className="image-preview-grid">
                  {imageLinks
                    .filter(link => link.trim() !== '')
                    .map((link, index) => (
                      <div key={index} className="image-preview-item">
                        <img
                          src={link}
                          alt={`Preview ${index + 1}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Tạo Venue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVenue;
