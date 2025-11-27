import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Trash2 } from 'lucide-react';
import { Button } from '../../../components/admincomponents/UI/Button';
import './VenueEditModal.css';

export const VenueEditModal = ({ venue, owners, images = [], onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    description: '',
    status: 1,
    userId: ''
  });
  const isEdit = !!(venue && venue.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Image management state
  const [venueImages, setVenueImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImageLinks, setNewImageLinks] = useState(['']);

  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name || '',
        address: venue.address || venue.location || '',
        contact: venue.contact || '',
        description: venue.description || '',
        status: venue.status ?? 1,
        userId: venue.userId || ''
      });
      
      // Load existing images for this venue
      if (venue.id && images) {
        const existingImages = images.filter(img => img.venueId === venue.id);
        setVenueImages(existingImages);
      }
    } else {
      // Create mode - reset everything
      setVenueImages([]);
      setNewImageLinks(['']);
    }
  }, [venue, images]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' || name === 'userId' 
        ? parseInt(value) 
        : value
    }));
  };

  // Image link handlers
  const handleAddImageLink = () => {
    setNewImageLinks([...newImageLinks, '']);
  };

  const handleImageLinkChange = (index, value) => {
    const updated = [...newImageLinks];
    updated[index] = value;
    setNewImageLinks(updated);
  };

  const handleRemoveNewImageLink = (index) => {
    setNewImageLinks(newImageLinks.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = (imageId) => {
    setImagesToDelete([...imagesToDelete, imageId]);
    setVenueImages(venueImages.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // Validate
      if (!formData.name.trim()) {
        throw new Error('Tên venue không được để trống');
      }
      if (!formData.address.trim()) {
        throw new Error('Địa chỉ không được để trống');
      }
      if (!formData.userId) {
        throw new Error('Vui lòng chọn chủ sở hữu');
      }

      await onSave({
        ...venue,
        ...formData,
        imageData: {
          imagesToDelete,
          newImageLinks: newImageLinks.filter(link => link.trim() !== '')
        }
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="venue-edit-modal-overlay" onClick={onClose}>
      <div className="venue-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="venue-edit-modal__header">
          <h2 className="venue-edit-modal__title">
            {isEdit ? 'Chỉnh sửa Venue' : 'Thêm Venue mới'}
          </h2>
          <button className="venue-edit-modal__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="venue-edit-modal__form">
          {error && (
            <div className="venue-edit-modal__error">
              {error}
            </div>
          )}

          <div className="venue-edit-modal__field">
            <label htmlFor="name" className="venue-edit-modal__label">
              Tên venue <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="venue-edit-modal__input"
              placeholder="Nhập tên venue"
              required
            />
          </div>

          <div className="venue-edit-modal__field">
            <label htmlFor="userId" className="venue-edit-modal__label">
              Chủ sở hữu {!isEdit && <span className="required">*</span>}
            </label>
            {isEdit ? (
              <input
                type="text"
                id="userId"
                name="userId"
                value={(() => {
                  const owner = owners.find(o => o.id === formData.userId);
                  return owner ? (owner.name || owner.email) : '';
                })()}
                className="venue-edit-modal__input"
                readOnly
                disabled
              />
            ) : (
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="venue-edit-modal__select"
                required
              >
                <option value="">-- Chọn chủ sở hữu --</option>
                {owners.map(owner => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name || owner.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="venue-edit-modal__field">
            <label htmlFor="address" className="venue-edit-modal__label">
              Địa chỉ <span className="required">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="venue-edit-modal__input"
              placeholder="Nhập địa chỉ"
              required
            />
          </div>

          <div className="venue-edit-modal__field">
            <label htmlFor="contact" className="venue-edit-modal__label">
              Số điện thoại liên hệ
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="venue-edit-modal__input"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="venue-edit-modal__field">
            <label htmlFor="description" className="venue-edit-modal__label">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="venue-edit-modal__textarea"
              placeholder="Nhập mô tả venue"
              rows="4"
            />
          </div>

          <div className="venue-edit-modal__field">
            <label htmlFor="status" className="venue-edit-modal__label">
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="venue-edit-modal__select"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Không hoạt động</option>
            </select>
          </div>

          {/* Image Management Section */}
          <div className="venue-edit-modal__field">
            <label className="venue-edit-modal__label">
              Hình ảnh venue (không bắt buộc)
            </label>
            
            {/* Existing Images */}
            {venueImages.length > 0 && (
              <div className="venue-edit-modal__images">
                <p className="venue-edit-modal__images-title">Hình ảnh hiện tại:</p>
                {venueImages.map(img => (
                  <div key={img.id} className="venue-edit-modal__image-item">
                    <img 
                      src={img.link} 
                      alt={img.name}
                      className="venue-edit-modal__image-preview"
                    />
                    <div className="venue-edit-modal__image-info">
                      <span className="venue-edit-modal__image-name">{img.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingImage(img.id)}
                      className="venue-edit-modal__image-delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New Image Links */}
            <div className="venue-edit-modal__new-images">
              <p className="venue-edit-modal__images-title">
                {venueImages.length > 0 ? 'Thêm hình ảnh mới:' : 'Thêm hình ảnh:'}
              </p>
              {newImageLinks.map((link, index) => (
                <div key={index} className="venue-edit-modal__image-input-group">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => handleImageLinkChange(index, e.target.value)}
                    className="venue-edit-modal__input"
                    placeholder="Nhập link hình ảnh (URL)"
                  />
                  {newImageLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImageLink(index)}
                      className="venue-edit-modal__remove-link-btn"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={Upload}
                onClick={handleAddImageLink}
              >
                Thêm link ảnh
              </Button>
            </div>
          </div>

          <div className="venue-edit-modal__actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" icon={Save} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
