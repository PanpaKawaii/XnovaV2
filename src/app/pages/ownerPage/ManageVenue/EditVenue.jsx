import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { fetchData, putData, postData, deleteData } from '../../../../mocks/CallingAPI';
import './EditVenue.css';

const EditVenue = () => {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    address: '',
    longitude: '',
    latitude: '',
    contact: '',
    status: 1,
    userId: user?.id || 0
  });

  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImageLinks, setNewImageLinks] = useState(['']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch venue data and images
  useEffect(() => {
    if (venueId && user?.token) {
      fetchVenueData();
    }
  }, [venueId, user]);

  const fetchVenueData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = user?.token;
      
      // Fetch venue and images in parallel
      const [venueResponse, imagesResponse] = await Promise.all([
        fetchData(`Venue/${venueId}`, token),
        fetchData('Image', token).catch(() => [])
      ]);

      // Set venue data
      setFormData({
        id: venueResponse.id,
        name: venueResponse.name || '',
        address: venueResponse.address || '',
        longitude: venueResponse.longitude || '',
        latitude: venueResponse.latitude || '',
        contact: venueResponse.contact || '',
        status: venueResponse.status ?? 1,
        userId: venueResponse.userId
      });

      // Filter images for this venue
      const venueImages = Array.isArray(imagesResponse) 
        ? imagesResponse.filter(img => img.venueId === parseInt(venueId))
        : [];
      setExistingImages(venueImages);

    } catch (err) {
      console.error('Error fetching venue data:', err);
      setError('Không thể tải thông tin venue. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? parseInt(value) : value
    }));
  };

  // Existing image handlers
  const handleDeleteExistingImage = (imageId) => {
    setImagesToDelete([...imagesToDelete, imageId]);
    setExistingImages(existingImages.filter(img => img.id !== imageId));
  };

  // New image link handlers
  const handleAddImageLink = () => {
    setNewImageLinks([...newImageLinks, '']);
  };

  const handleImageLinkChange = (index, value) => {
    const updated = [...newImageLinks];
    updated[index] = value;
    setNewImageLinks(updated);
  };

  const handleRemoveImageLink = (index) => {
    if (newImageLinks.length > 1) {
      setNewImageLinks(newImageLinks.filter((_, i) => i !== index));
    } else {
      setNewImageLinks(['']);
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

    setSaving(true);

    try {
      const token = user?.token;
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này');
      }

      // Update venue
      const venuePayload = {
        id: formData.id,
        name: formData.name.trim(),
        address: formData.address.trim(),
        longitude: formData.longitude.trim() || null,
        latitude: formData.latitude.trim() || null,
        contact: formData.contact.trim(),
        status: formData.status,
        userId: formData.userId
      };

      await putData(`Venue/${venueId}`, venuePayload, token);

      // Delete marked images
      if (imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map(imageId =>
            deleteData(`Image/${imageId}`, token).catch(err => 
              console.error(`Failed to delete image ${imageId}:`, err)
            )
          )
        );
      }

      // Add new images
      const validNewImageLinks = newImageLinks.filter(link => link.trim() !== '');
      if (validNewImageLinks.length > 0) {
        await Promise.all(
          validNewImageLinks.map((link, index) =>
            postData('Image', {
              name: `${formData.name} - Image ${existingImages.length + index + 1}`,
              link: link.trim(),
              status: 1,
              venueId: parseInt(venueId)
            }, token).catch(err => 
              console.error(`Failed to create image:`, err)
            )
          )
        );
      }

      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/owner/manage-venues');
      }, 2000);

    } catch (err) {
      console.error('Error updating venue:', err);
      setError(err.message || 'Không thể cập nhật venue. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/owner/manage-venues');
  };

  if (loading) {
    return (
      <div className="edit-venue-wrapper">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Đang tải thông tin venue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-venue-wrapper">
      <div className="edit-venue-container">
        <div className="edit-venue-header">
          <button className="back-button" onClick={handleCancel}>
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <h1 className="page-title">Chỉnh sửa Venue</h1>
        </div>

        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <p>Cập nhật venue thành công! Đang chuyển hướng...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-venue-form">
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

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="existing-images-section">
                <h3 className="subsection-title">Hình ảnh hiện tại</h3>
                <div className="existing-images-grid">
                  {existingImages.map((image) => (
                    <div key={image.id} className="existing-image-item">
                      <img
                        src={image.link}
                        alt={image.name}
                        className="existing-image-preview"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=Error+Loading';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(image.id)}
                        className="delete-image-button"
                        title="Xóa ảnh này"
                      >
                        <Trash2 size={16} />
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div className="new-images-section">
              <h3 className="subsection-title">
                {existingImages.length > 0 ? 'Thêm hình ảnh mới' : 'Thêm hình ảnh'}
              </h3>
              
              <div className="image-links-container">
                {newImageLinks.map((link, index) => (
                  <div key={index} className="image-link-group">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => handleImageLinkChange(index, e.target.value)}
                      className="form-input"
                      placeholder="Nhập URL hình ảnh (https://...)"
                    />
                    {newImageLinks.length > 1 && (
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

              {/* New images preview */}
              {newImageLinks.some(link => link.trim() !== '') && (
                <div className="image-preview-container">
                  <h4 className="preview-title">Xem trước ảnh mới:</h4>
                  <div className="image-preview-grid">
                    {newImageLinks
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
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner"></span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVenue;
