import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save } from 'lucide-react';
import { ConfirmModal } from '../../../../components/ui/ConfirmModal';
import './SlotManagementModal.css';

export const SlotManagementModal = ({ field, slots, onClose, onSave, onDelete }) => {
  const [fieldSlots, setFieldSlots] = useState([]);
  const [editingSlot, setEditingSlot] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    price: '',
    status: 1
  });
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [slotToDelete, setSlotToDelete] = useState(null);

  useEffect(() => {
    if (slots) {
      setFieldSlots(slots.sort((a, b) => {
        const aTime = a.startTime || '';
        const bTime = b.startTime || '';
        return aTime.localeCompare(bTime);
      }));
    }
  }, [slots]);

  const resetForm = () => {
    setFormData({
      name: '',
      startTime: '',
      endTime: '',
      price: '',
      status: 1
    });
    setEditingSlot(null);
    setIsAdding(false);
    setError(null);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingSlot(null);
    setFormData({
      name: '',
      startTime: '',
      endTime: '',
      price: '',
      status: 1
    });
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setIsAdding(false);
    setFormData({
      name: slot.name || '',
      startTime: slot.startTime || '',
      endTime: slot.endTime || '',
      price: slot.price || '',
      status: slot.status ?? 1
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'status' 
        ? (value === '' ? '' : parseFloat(value) || parseInt(value))
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate
      if (!formData.name.trim()) {
        throw new Error('Tên slot không được để trống');
      }
      if (!formData.startTime) {
        throw new Error('Giờ bắt đầu không được để trống');
      }
      if (!formData.endTime) {
        throw new Error('Giờ kết thúc không được để trống');
      }
      if (formData.startTime >= formData.endTime) {
        throw new Error('Giờ kết thúc phải sau giờ bắt đầu');
      }
      if (!formData.price || formData.price <= 0) {
        throw new Error('Giá phải lớn hơn 0');
      }

      const slotData = {
        name: formData.name,
        startTime: formData.startTime,
        endTime: formData.endTime,
        price: parseFloat(formData.price),
        status: parseInt(formData.status),
        fieldId: field.id
      };

      if (editingSlot) {
        // Update existing slot
        await onSave({ ...editingSlot, ...slotData });
      } else {
        // Create new slot
        await onSave(slotData);
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (slot) => {
    setSlotToDelete(slot);
    setConfirmAction(() => () => handleDeleteInternal(slot));
    setShowConfirmModal(true);
  };

  const handleDeleteInternal = async (slot) => {
    try {
      setShowConfirmModal(false);
      await onDelete(slot.id);
      setSlotToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:mm from HH:mm:ss
  };

  return (
    <div className="owner-slot-mgmt-modal-overlay" onClick={onClose}>
      <div className="owner-slot-mgmt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="owner-slot-mgmt-modal__header">
          <div>
            <h2 className="owner-slot-mgmt-modal__title">Quản lý Slots</h2>
            <p className="owner-slot-mgmt-modal__subtitle">{field?.name}</p>
          </div>
          <button className="owner-slot-mgmt-modal__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="owner-slot-mgmt-modal__content">
          {error && (
            <div className="owner-slot-mgmt-modal__error">
              {error}
            </div>
          )}

          {/* Add/Edit Form */}
          {(isAdding || editingSlot) && (
            <form onSubmit={handleSubmit} className="owner-slot-form">
              <div className="owner-slot-form__header">
                <h3 className="owner-slot-form__title">
                  {editingSlot ? 'Chỉnh sửa Slot' : 'Thêm Slot mới'}
                </h3>
                <button type="button" className="owner-slot-form__cancel" onClick={resetForm}>
                  <X size={18} />
                </button>
              </div>

              <div className="owner-slot-form__grid">
                <div className="owner-slot-form__field">
                  <label htmlFor="name" className="owner-slot-form__label">
                    Tên slot <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="owner-slot-form__input"
                    placeholder="Ví dụ: Slot 1"
                    required
                  />
                </div>

                <div className="owner-slot-form__field">
                  <label htmlFor="startTime" className="owner-slot-form__label">
                    Giờ bắt đầu <span className="required">*</span>
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formatTime(formData.startTime)}
                    onChange={handleChange}
                    className="owner-slot-form__input"
                    required
                  />
                </div>

                <div className="owner-slot-form__field">
                  <label htmlFor="endTime" className="owner-slot-form__label">
                    Giờ kết thúc <span className="required">*</span>
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formatTime(formData.endTime)}
                    onChange={handleChange}
                    className="owner-slot-form__input"
                    required
                  />
                </div>

                <div className="owner-slot-form__field">
                  <label htmlFor="price" className="owner-slot-form__label">
                    Giá (VNĐ) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="owner-slot-form__input"
                    placeholder="Nhập giá"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div className="owner-slot-form__field">
                  <label htmlFor="status" className="owner-slot-form__label">
                    Trạng thái
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="owner-slot-form__select"
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Khóa</option>
                  </select>
                </div>
              </div>

              <div className="owner-slot-form__actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={18} />
                  {editingSlot ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          )}

          {/* Add Button */}
          {!isAdding && !editingSlot && (
            <div className="owner-slot-mgmt-modal__add-section">
              <button className="btn-primary" onClick={handleAdd}>
                <Plus size={18} />
                Thêm Slot mới
              </button>
            </div>
          )}

          {/* Slots List */}
          <div className="owner-slots-list">
            <h3 className="owner-slots-list__title">
              Danh sách Slots ({fieldSlots.length})
            </h3>
            
            {fieldSlots.length === 0 ? (
              <div className="owner-slots-list__empty">
                <p>Chưa có slot nào</p>
              </div>
            ) : (
              <div className="owner-slots-list__grid">
                {fieldSlots.map((slot) => (
                  <div key={slot.id} className="owner-slot-card">
                    <div className="owner-slot-card__header">
                      <h4 className="owner-slot-card__name">{slot.name}</h4>
                      <div className={`owner-slot-card__status ${slot.status === 1 ? 'active' : 'inactive'}`}>
                        {slot.status === 1 ? 'Hoạt động' : 'Khóa'}
                      </div>
                    </div>
                    
                    <div className="owner-slot-card__details">
                      <div className="owner-slot-card__detail">
                        <span className="owner-slot-card__label">Thời gian:</span>
                        <span className="owner-slot-card__value">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </span>
                      </div>
                      <div className="owner-slot-card__detail">
                        <span className="owner-slot-card__label">Giá:</span>
                        <span className="owner-slot-card__value owner-slot-card__price">
                          {formatCurrency(slot.price)}
                        </span>
                      </div>
                    </div>

                    <div className="owner-slot-card__actions">
                      <button 
                        className="btn-ghost-sm"
                        onClick={() => handleEdit(slot)}
                        disabled={isAdding || editingSlot}
                      >
                        <Edit size={16} />
                        Sửa
                      </button>
                      <button 
                        className="btn-ghost-sm btn-danger"
                        onClick={() => handleDelete(slot)}
                        disabled={isAdding || editingSlot}
                      >
                        <Trash2 size={16} />
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="owner-slot-mgmt-modal__footer">
          <button className="btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        message={slotToDelete ? `Bạn có chắc muốn xóa slot "${slotToDelete.name || 'này'}"?` : ''}
        onConfirm={confirmAction}
        onCancel={() => {
          setShowConfirmModal(false);
          setSlotToDelete(null);
        }}
      />
    </div>
  );
};
