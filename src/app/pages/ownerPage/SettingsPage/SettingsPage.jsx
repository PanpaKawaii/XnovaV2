import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Palette,
  Shield,
  Database,
  Download,
  Upload,
  AlertCircle,
  Clock,
  Calendar,
  Camera,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { fetchData, patchData } from '../../../../mocks/CallingAPI.js';
import { AlertModal } from '../../../components/ui/AlertModal';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import './SettingsPage.css';

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingExpireMinutes, setPendingExpireMinutes] = useState(15);
  const [autoExpireEnabled, setAutoExpireEnabled] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // States for user data
  const [thisUser, setThisUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
    type: 'Regular',
    status: 'active'
  });
  
  // Password change states
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [successPassword, setSuccessPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // Image upload states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  // Profile edit states
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  
  // Modal states
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const settingsTabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'booking', name: 'Booking Settings', icon: Calendar },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'data', name: 'Data & Backup', icon: Database }
  ];

  // Load user data
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const token = user?.token || null;
      try {
        const thisUserData = await fetchData(`User/${user?.id}`, token);
        console.log('Owner data:', thisUserData);
        setThisUser(thisUserData);
        
        setEditedUser({
          name: thisUserData.name || '',
          email: thisUserData.email || '',
          phone: thisUserData.phoneNumber || thisUserData.phone || '',
          image: thisUserData.image || '',
          type: thisUserData.type || 'Regular',
          status: thisUserData.status === 1 || thisUserData.status === '1' || thisUserData.status === 'active' ? 'active' : 'inactive'
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching owner data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const validateProfileData = () => {
    if (!editedUser.name || editedUser.name.trim().length < 2) {
      setProfileError('Tên phải có ít nhất 2 ký tự');
      return false;
    }
    if (editedUser.phone && editedUser.phone !== 'none' && editedUser.phone.trim() !== '') {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(editedUser.phone)) {
        setProfileError('Định dạng số điện thoại không hợp lệ');
        return false;
      }
    }
    return true;
  };

  const handleSaveProfile = async () => {
    setProfileError('');
    
    if (!validateProfileData()) {
      return;
    }

    if (!thisUser || !user?.token) {
      setProfileError('Không thể cập nhật thông tin. Vui lòng đăng nhập lại.');
      return;
    }

    setIsLoadingProfile(true);
    try {
      const token = user.token;
      const statusValue = editedUser.status === 'active' ? 1 : 0;
      
      const userPayload = {
        id: thisUser.id,
        name: editedUser.name || '',
        email: thisUser.email || '',
        password: thisUser.password || '',
        image: editedUser.image || thisUser.image || '',
        role: thisUser.role || 'owner',
        description: thisUser.description || '',
        phoneNumber: editedUser.phone || '',
        point: thisUser.point || 0,
        type: editedUser.type || 'Regular',
        status: statusValue
      };
      
      await patchData(`User/${thisUser.id}`, userPayload, token);
      const updatedUserData = await fetchData(`User/${user?.id}`, token);
      setThisUser(updatedUserData);
      
      setIsEditing(false);
      setProfileError('');
      setAlertMessage('Cập nhật thông tin thành công!');
      setShowAlertModal(true);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setProfileError(error.message || 'Lỗi cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setIsLoadingProfile(false);
    }
  };
  
  const handleCancelProfile = () => {
    if (thisUser) {
      setEditedUser({
        name: thisUser.name || '',
        email: thisUser.email || '',
        phone: thisUser.phoneNumber || thisUser.phone || '',
        image: thisUser.image || '',
        type: thisUser.type || 'Regular',
        status: thisUser.status === 1 || thisUser.status === '1' || thisUser.status === 'active' ? 'active' : 'inactive'
      });
    }
    setIsEditing(false);
    setProfileError('');
  };

  const handleImageUpload = async () => {
    if (!imageUrlInput || !imageUrlInput.trim()) {
      setAlertMessage('Vui lòng nhập URL ảnh.');
      setShowAlertModal(true);
      return;
    }

    if (!thisUser || !user?.token) {
      setAlertMessage('Không thể cập nhật ảnh. Vui lòng đăng nhập lại.');
      setShowAlertModal(true);
      return;
    }

    setIsUploadingImage(true);
    setShowImageUploadModal(false);
    try {
      const token = user.token;
      
      const userPayload = {
        id: thisUser.id,
        name: thisUser.name || '',
        email: thisUser.email || '',
        password: thisUser.password || '',
        image: imageUrlInput.trim(),
        role: thisUser.role || 'owner',
        description: thisUser.description || '',
        phoneNumber: thisUser.phoneNumber || thisUser.phone || '',
        point: thisUser.point || 0,
        type: thisUser.type || 'Regular',
        status: thisUser.status
      };
      
      await patchData(`User/${thisUser.id}`, userPayload, token);
      const updatedUserData = await fetchData(`User/${user?.id}`, token);
      setThisUser(updatedUserData);
      setEditedUser(prev => ({ ...prev, image: updatedUserData.image }));
      
      setImageUrlInput('');
      setAlertMessage('Cập nhật ảnh đại diện thành công!');
      setShowAlertModal(true);
    } catch (error) {
      console.error('Failed to update image:', error);
      setAlertMessage(error.message || 'Lỗi cập nhật ảnh đại diện. Vui lòng thử lại.');
      setShowAlertModal(true);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCameraClick = () => {
    setImageUrlInput('');
    setShowImageUploadModal(true);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setPasswordError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.newPassword.length < 8) {
      setPasswordError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!thisUser || !user?.token) {
      setPasswordError('Không thể đổi mật khẩu. Vui lòng đăng nhập lại.');
      return;
    }

    if (formData.currentPassword !== thisUser.password) {
      setPasswordError('Mật khẩu hiện tại không đúng');
      return;
    }

    setIsLoadingPassword(true);
    try {
      const token = user.token;
      
      const userPayload = {
        id: thisUser.id,
        name: thisUser.name || '',
        email: thisUser.email || '',
        password: formData.newPassword,
        image: thisUser.image || '',
        role: thisUser.role || 'owner',
        description: thisUser.description || '',
        phoneNumber: thisUser.phoneNumber || thisUser.phone || '',
        point: thisUser.point || 0,
        type: thisUser.type || 'Regular',
        status: thisUser.status
      };
      
      await patchData(`User/${thisUser.id}`, userPayload, token);
      const updatedUserData = await fetchData(`User/${user?.id}`, token);
      setThisUser(updatedUserData);
      
      setSuccessPassword(true);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setAlertMessage('Đổi mật khẩu thành công!');
      setShowAlertModal(true);
      setTimeout(() => setSuccessPassword(false), 3000);
    } catch (error) {
      console.error('Failed to change password:', error);
      setPasswordError(error.message || 'Lỗi đổi mật khẩu. Vui lòng thử lại.');
      setAlertMessage(error.message || 'Lỗi đổi mật khẩu. Vui lòng thử lại.');
      setShowAlertModal(true);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveBookingSettings = () => {
    // Save to localStorage or API
    localStorage.setItem('bookingSettings', JSON.stringify({
      autoExpireEnabled,
      pendingExpireMinutes
    }));
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        if (loading) {
          return (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px' }}>
              Đang tải thông tin...
            </div>
          );
        }
        
        if (error && !loading) {
          return (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#ff4444' }}>
              Lỗi: {error}
            </div>
          );
        }
        
        if (!thisUser) return null;
        
        return (
          <div className="profile-content">
            <div className="profile-header">
              <div className="avatar">
                <div className="avatar-inner">
                  {thisUser.image ? (
                    <img src={thisUser.image} alt="Profile" />
                  ) : (
                    <span className="avatar-text">{thisUser.name?.charAt(0) || 'O'}</span>
                  )}
                </div>
                <button 
                  className="avatar-edit-btn" 
                  onClick={handleCameraClick}
                  disabled={isUploadingImage}
                  title="Cập nhật ảnh đại diện"
                >
                  <Camera size={18} />
                </button>
              </div>
              <div className="profile-info">
                <h3 className="user-name">{thisUser.name || 'Owner'}</h3>
                <p className="user-email">{thisUser.email}</p>
              </div>
            </div>
            
            {isEditing ? (
              <div className="profile-form">
                <div>
                  <label className="input-label">Tên đầy đủ</label>
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input
                    type="email"
                    value={editedUser.email}
                    className="input-field"
                    disabled
                    style={{ cursor: 'not-allowed', opacity: 0.6 }}
                  />
                </div>
                <div>
                  <label className="input-label">Số điện thoại</label>
                  <input
                    type="tel"
                    value={editedUser.phone}
                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                {profileError && (
                  <div className="error-message" style={{ color: '#ff4444', marginTop: '10px', fontSize: '14px' }}>
                    {profileError}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button 
                    className="save-button" 
                    onClick={handleSaveProfile}
                    disabled={isLoadingProfile}
                  >
                    <Check size={16} />
                    {isLoadingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button 
                    className="cancel-button" 
                    onClick={handleCancelProfile}
                    disabled={isLoadingProfile}
                  >
                    <X size={16} />
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-form">
                <div>
                  <label className="input-label">Tên đầy đủ</label>
                  <input
                    type="text"
                    value={thisUser.name || ''}
                    className="input-field"
                    disabled
                    style={{ cursor: 'not-allowed', opacity: 0.8 }}
                  />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input
                    type="email"
                    value={thisUser.email || ''}
                    className="input-field"
                    disabled
                    style={{ cursor: 'not-allowed', opacity: 0.8 }}
                  />
                </div>
                <div>
                  <label className="input-label">Số điện thoại</label>
                  <input
                    type="tel"
                    value={thisUser.phoneNumber || thisUser.phone || 'Chưa có'}
                    className="input-field"
                    disabled
                    style={{ cursor: 'not-allowed', opacity: 0.8 }}
                  />
                </div>
                <button className="save-button" onClick={() => setIsEditing(true)}>
                  <Edit3 size={16} />
                  Chỉnh sửa thông tin
                </button>
              </div>
            )}
          </div>
        );

      case 'booking':
        return (
          <div className="booking-settings-content">
            {showSuccessMessage && (
              <div className="success-message">
                <AlertCircle size={20} />
                <span>Booking settings saved successfully!</span>
              </div>
            )}

            <div className="settings-section">
              <div className="section-header">
                <Clock className="section-icon" />
                <div>
                  <h3 className="section-title">Auto-Expire Pending Bookings</h3>
                  <p className="section-description">
                    Automatically cancel unpaid bookings after a specified time
                  </p>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Enable Auto-Expire</label>
                  <p className="setting-description">
                    Pending bookings will be automatically cancelled if not paid within the time limit
                  </p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={autoExpireEnabled}
                    onChange={(e) => setAutoExpireEnabled(e.target.checked)}
                    className="sr-only" 
                  />
                  <div className="toggle-slider"></div>
                </label>
              </div>

              {autoExpireEnabled && (
                <div className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">Expiration Time (minutes)</label>
                    <p className="setting-description">
                      Time before pending bookings are automatically cancelled
                    </p>
                  </div>
                  <div className="time-input-group">
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={pendingExpireMinutes}
                      onChange={(e) => setPendingExpireMinutes(parseInt(e.target.value) || 15)}
                      className="time-input"
                    />
                    <span className="time-unit">minutes</span>
                  </div>
                </div>
              )}

              <div className="predefined-times">
                <p className="predefined-label">Quick Select:</p>
                <div className="time-buttons">
                  <button 
                    onClick={() => setPendingExpireMinutes(10)}
                    className={`time-button ${pendingExpireMinutes === 10 ? 'active' : ''}`}
                  >
                    10 min
                  </button>
                  <button 
                    onClick={() => setPendingExpireMinutes(15)}
                    className={`time-button ${pendingExpireMinutes === 15 ? 'active' : ''}`}
                  >
                    15 min
                  </button>
                  <button 
                    onClick={() => setPendingExpireMinutes(30)}
                    className={`time-button ${pendingExpireMinutes === 30 ? 'active' : ''}`}
                  >
                    30 min
                  </button>
                  <button 
                    onClick={() => setPendingExpireMinutes(60)}
                    className={`time-button ${pendingExpireMinutes === 60 ? 'active' : ''}`}
                  >
                    60 min
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-actions">
              <button onClick={handleSaveBookingSettings} className="save-button">
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="security-content">
            <div className="change-password">
              <div className="section-header">
                <Lock className="section-icon" />
                <h3 className="section-title">Đổi mật khẩu</h3>
              </div>
              <form onSubmit={handleSubmitPassword} className="password-form">
                {passwordError && (
                  <div className="error-message" style={{ color: '#ff4444', marginBottom: '10px', fontSize: '14px' }}>
                    {passwordError}
                  </div>
                )}
                <div>
                  <label className="input-label">Mật khẩu hiện tại</label>
                  <div className="input-wrapper">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="password-input"
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="visibility-toggle"
                    >
                      {showPasswords.current ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                    </button>
                  </div>
                </div>
              
                <div>
                  <label className="input-label">Mật khẩu mới</label>
                  <div className="input-wrapper">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="password-input"
                      placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="visibility-toggle"
                    >
                      {showPasswords.new ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                    </button>
                  </div>
                </div>
              
              <div>
                <label className="input-label">Xác nhận mật khẩu mới</label>
                <div className="input-wrapper">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="password-input"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="visibility-toggle"
                  >
                    {showPasswords.confirm ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                  </button>
                </div>
              </div>
              
                <button
                  type="submit"
                  className={`submit-button${isLoadingPassword ? ' loading-disabled' : ''}${successPassword ? ' success' : ''}`}
                  disabled={isLoadingPassword}
                >
                  {isLoadingPassword ? 'Đang xử lý...' : successPassword ? 'Đã lưu thành công!' : 'Đổi mật khẩu'}
                </button>
              </form>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="notifications-content">
            <div className="notification-item">
              <div>
                <h4 className="notification-title">Email Notifications</h4>
                <p className="notification-description">Receive notifications via email</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked className="sr-only" />
                <div className="toggle-slider"></div>
              </label>
            </div>
            <div className="notification-item">
              <div>
                <h4 className="notification-title">Push Notifications</h4>
                <p className="notification-description">Receive push notifications in browser</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked className="sr-only" />
                <div className="toggle-slider"></div>
              </label>
            </div>
            <div className="notification-item">
              <div>
                <h4 className="notification-title">Booking Alerts</h4>
                <p className="notification-description">Get notified about new bookings</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked className="sr-only" />
                <div className="toggle-slider"></div>
              </label>
            </div>
          </div>
        );


      case 'data':
        return (
          <div className="data-content">
            <div className="data-card">
              <div className="card-header">
                <div className="card-title">
                  <Download className="card-icon" />
                  <div>
                    <h4 className="card-heading">Export Data</h4>
                    <p className="card-description">Download your data as CSV or JSON</p>
                  </div>
                </div>
                <button className="export-button">Export</button>
              </div>
            </div>
            <div className="data-card">
              <div className="card-header">
                <div className="card-title">
                  <Upload className="card-icon" />
                  <div>
                    <h4 className="card-heading">Import Data</h4>
                    <p className="card-description">Import data from CSV or JSON files</p>
                  </div>
                </div>
                <button className="import-button">Import</button>
              </div>
            </div>
            <div className="data-card">
              <div className="card-header">
                <div className="card-title">
                  <Database className="card-icon" />
                  <div>
                    <h4 className="card-heading">Clear Data</h4>
                    <p className="card-description">Clear all local data and cache</p>
                  </div>
                </div>
                <button className="clear-button">Clear</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="header-section">
        <div className="title-container">
          <h1 className="page-title">Settings</h1>
          <p className="page-description">Manage your account settings and preferences.</p>
        </div>
        {/* Nếu cần thêm nút cho header, thêm ở đây */}
      </div>
      <div className="settings-layout">
        <div className="sidebar">
          <nav className="tab-nav">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon className="tab-icon" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="content-area">
          <div className="content-card">
            {renderTabContent()}
          </div>
        </div>
      </div>
      
      {/* Image Upload Modal */}
      {showImageUploadModal && (
        <div className="modal-overlay" onClick={() => setShowImageUploadModal(false)}>
          <div className="modal-content image-upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Cập nhật ảnh đại diện</h3>
              <p className="modal-description">Nhập URL của ảnh bạn muốn sử dụng làm ảnh đại diện</p>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">URL ảnh</label>
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                  autoFocus
                />
                {imageUrlInput && (
                  <div className="image-preview">
                    <img 
                      src={imageUrlInput} 
                      alt="Preview" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onLoad={(e) => {
                        e.target.style.display = 'block';
                        e.target.nextSibling.style.display = 'none';
                      }}
                    />
                    <div className="preview-error" style={{ display: 'none' }}>
                      <AlertCircle size={32} />
                      <span>Không thể tải ảnh</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowImageUploadModal(false)}
                className="cancel-button"
                disabled={isUploadingImage}
              >
                <X size={16} />
                Hủy
              </button>
              <button
                onClick={handleImageUpload}
                className="save-button"
                disabled={isUploadingImage || !imageUrlInput.trim()}
              >
                <Check size={16} />
                {isUploadingImage ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {showAlertModal && (
        <AlertModal
          message={alertMessage}
          onClose={() => {
            setShowAlertModal(false);
            setAlertMessage('');
          }}
        />
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={() => {
            if (confirmAction) confirmAction();
            setShowConfirmModal(false);
            setConfirmMessage('');
            setConfirmAction(null);
          }}
          onCancel={() => {
            setShowConfirmModal(false);
            setConfirmMessage('');
            setConfirmAction(null);
          }}
        />
      )}
      
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Change Password</h3>
            <div className="modal-form">
              <div>
                <label className="input-label">Current Password</label>
                <input
                  type="password"
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">New Password</label>
                <input
                  type="password"
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Confirm New Password</label>
                <input
                  type="password"
                  className="input-field"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="cancel-button"
              >Cancel</button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="update-button"
              >Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;