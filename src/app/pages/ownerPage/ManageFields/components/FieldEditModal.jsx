import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import './FieldEditModal.css';

export const FieldEditModal = ({ field, types, venues, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 1,
    typeId: '',
    venueId: ''
  });
  const isEdit = !!(field && field.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name || '',
        description: field.description || '',
        status: typeof field.status === 'number' ? field.status : (field.status === 'Active' ? 1 : 0),
        typeId: field.typeId || '',
        venueId: field.venueId || ''
      });
    }
  }, [field]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' || name === 'typeId' || name === 'venueId' 
        ? parseInt(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // Validate
      if (!formData.name.trim()) {
        throw new Error('Tên sân không được để trống');
      }
      if (!formData.typeId) {
        throw new Error('Vui lòng chọn loại sân');
      }
      if (!formData.venueId) {
        throw new Error('Vui lòng chọn venue');
      }

      await onSave({
        ...field,
        ...formData
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="owner-field-edit-modal-overlay" onClick={onClose}>
      <div className="owner-field-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="owner-field-edit-modal__header">
          <h2 className="owner-field-edit-modal__title">
            {field ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
          </h2>
          <button className="owner-field-edit-modal__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="owner-field-edit-modal__form">
          {error && (
            <div className="owner-field-edit-modal__error">
              {error}
            </div>
          )}

          <div className="owner-field-edit-modal__field">
            <label htmlFor="name" className="owner-field-edit-modal__label">
              Tên sân <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="owner-field-edit-modal__input"
              placeholder="Nhập tên sân"
              required
            />
          </div>

          {!isEdit && (
            <div className="owner-field-edit-modal__field">
              <label htmlFor="venueId" className="owner-field-edit-modal__label">
                Venue <span className="required">*</span>
              </label>
              <select
                id="venueId"
                name="venueId"
                value={formData.venueId}
                onChange={handleChange}
                className="owner-field-edit-modal__select"
                required
              >
                <option value="">-- Chọn venue --</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="owner-field-edit-modal__field">
            <label htmlFor="typeId" className="owner-field-edit-modal__label">
              Loại sân <span className="required">*</span>
            </label>
            <select
              id="typeId"
              name="typeId"
              value={formData.typeId}
              onChange={handleChange}
              className="owner-field-edit-modal__select"
              required
            >
              <option value="">-- Chọn loại sân --</option>
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="owner-field-edit-modal__field">
            <label htmlFor="description" className="owner-field-edit-modal__label">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="owner-field-edit-modal__textarea"
              placeholder="Nhập mô tả sân"
              rows="4"
            />
          </div>

          <div className="owner-field-edit-modal__field">
            <label htmlFor="status" className="owner-field-edit-modal__label">
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="owner-field-edit-modal__select"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Không hoạt động</option>
            </select>
          </div>

          <div className="owner-field-edit-modal__actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save size={18} />
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
