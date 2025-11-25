import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { fetchData, postData } from '../../../../mocks/CallingAPI';
import './AddField.css';

const AddField = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 1,
    typeId: '',
    venueId: searchParams.get('venueId') || ''
  });

  const [venues, setVenues] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch venues and types
  useEffect(() => {
    if (user?.token) {
      fetchInitialData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = user?.token;
      
      // Fetch venues and types in parallel
      const [venuesResponse, typesResponse] = await Promise.all([
        fetchData('Venue', token).catch(() => []),
        fetchData('Type', token).catch(() => [])
      ]);

      // Normalize to arrays
      const venuesData = Array.isArray(venuesResponse) ? venuesResponse : [];
      const typesData = Array.isArray(typesResponse) ? typesResponse : [];

      // Filter owner's venues
      const ownerVenues = venuesData.filter(v => v.userId === user.id);
      
      setVenues(ownerVenues);
      setTypes(typesData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' || name === 'typeId' || name === 'venueId' 
        ? parseInt(value) 
        : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Tên sân không được để trống');
      return false;
    }
    if (!formData.venueId) {
      setError('Vui lòng chọn venue');
      return false;
    }
    if (!formData.typeId) {
      setError('Vui lòng chọn loại sân');
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

      // Prepare field data
      const fieldPayload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        typeId: formData.typeId,
        venueId: formData.venueId
      };

      // Create field
      await postData('Field', fieldPayload, token);

      setSuccess(true);
      
      // Redirect to manage fields after 2 seconds
      setTimeout(() => {
        navigate('/owner/manage-fields');
      }, 2000);

    } catch (err) {
      console.error('Error creating field:', err);
      setError(err.message || 'Không thể tạo sân. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/owner/manage-fields');
  };

  if (loading) {
    return (
      <div className="add-field-wrapper">
        <div className="reports-loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="add-field-wrapper">
        <div className="add-field-container">
          <div className="empty-state">
            <h2>Không có venue nào</h2>
            <p>Bạn cần tạo venue trước khi có thể thêm sân.</p>
            <button
              onClick={() => navigate('/owner/add-venue')}
              className="btn btn-primary"
            >
              Tạo Venue mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-field-wrapper">
      <div className="add-field-container">
        <div className="add-field-header">
          <button className="back-button" onClick={handleCancel}>
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <h1 className="page-title">Thêm Sân Mới</h1>
        </div>

        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <p>Tạo sân thành công! Đang chuyển hướng...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-field-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <h2 className="section-title">Thông tin cơ bản</h2>
            
            <div className="form-group">
              <label htmlFor="venueId" className="form-label">
                Chọn Venue <span className="required">*</span>
              </label>
              <select
                id="venueId"
                name="venueId"
                value={formData.venueId}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Chọn venue --</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
              <p className="form-hint">Chọn venue mà sân này thuộc về</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Tên sân <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ví dụ: Sân 1, Sân A, Sân VIP..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="typeId" className="form-label">
                  Loại sân <span className="required">*</span>
                </label>
                <select
                  id="typeId"
                  name="typeId"
                  value={formData.typeId}
                  onChange={handleChange}
                  className="form-select"
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
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Mô tả sân
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Nhập mô tả về sân (kích thước, tiện ích, đặc điểm...)"
                rows="4"
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
              <p className="form-hint">
                Chọn "Hoạt động" để sân có thể được đặt ngay sau khi tạo
              </p>
            </div>
          </div>

          {/* Information Box */}
          <div className="info-box">
            <h3 className="info-box-title">📌 Lưu ý</h3>
            <ul className="info-box-list">
              <li>Sau khi tạo sân, bạn cần thêm các khung giờ (slots) để khách hàng có thể đặt</li>
              <li>Bạn có thể quản lý slots trong trang "Quản lý sân"</li>
              <li>Mỗi sân có thể có nhiều khung giờ với giá khác nhau</li>
            </ul>
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
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Tạo Sân
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddField;
