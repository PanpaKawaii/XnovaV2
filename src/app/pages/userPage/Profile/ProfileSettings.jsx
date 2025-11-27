import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Camera, Edit3, Check, X, User, MapPin, Award, Eye, EyeOff, Lock, Trash2, AlertTriangle, Bell, Calendar, Users, Gift } from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import './ProfileSettings.css';
import SubUserHeader from '../../../layouts/UserLayout/SubUserHeader/SubUserHeader';
import BookingHistory from './BookingHistory';
import FavoriteFields from './FavoriteFields';
import Voucher from './Voucher';
import { useTranslation } from 'react-i18next';
import { fetchData, patchData, deleteData } from '../../../../mocks/CallingAPI.js';
import { AlertModal } from '../../../components/ui/AlertModal';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';

const initialPreferences = {
  bookingReminders: true,
  matchInvites: false,
  promotions: true,
};


const ProfileSettings = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingRef = useRef(null);
  const favoriteRef = useRef(null);
  const voucherRef = useRef(null);

  // States for user data
  const [thisUser, setThisUser] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('profile');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'team') {
      navigate('/team', {
        state: {
          user: user,
          userInfo: thisUser
        }
      });
    } else if (tab === 'reward') {
      navigate('/reward', {
        state: {
          user: user,
          userInfo: thisUser
        }
      });
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
    type: 'Regular',
    status: 'active'
  });
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [successPassword, setSuccessPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [preferences, setPreferences] = useState(initialPreferences);
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isLoadingPref, setIsLoadingPref] = useState(false);
  const [successPref, setSuccessPref] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const validateProfileData = () => {
    if (!editedUser.name || editedUser.name.trim().length < 2) {
      setProfileError(t('Name must be at least 2 characters'));
      return false;
    }
    if (editedUser.phone && editedUser.phone !== 'none' && editedUser.phone.trim() !== '') {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(editedUser.phone)) {
        setProfileError(t('Invalid phone number format'));
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
      
      // Convert status string to number
      const statusValue = editedUser.status === 'active' ? 1 : 0;
      
      // Build complete payload with all required fields
      const userPayload = {
        id: thisUser.id,
        name: editedUser.name || '',
        email: thisUser.email || '',
        password: thisUser.password || '',
        image: editedUser.image || thisUser.image || '',
        role: thisUser.role || 'customer',
        description: thisUser.description || '',
        phoneNumber: editedUser.phone || '',
        point: thisUser.point || 0,
        type: editedUser.type || 'Regular',
        status: statusValue
      };
      
      console.log('🔍 Updating user profile:', {
        endpoint: `User/${thisUser.id}`,
        payload: userPayload
      });
      
      await patchData(`User/${thisUser.id}`, userPayload, token);
      console.log('✅ Updated User successfully');
      
      // Reload user data
      const updatedUserData = await fetchData(`User/${user?.id}`, token);
      console.log('Updated user data:', updatedUserData);
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
      
      // Build complete payload with all required fields
      const userPayload = {
        id: thisUser.id,
        name: thisUser.name || '',
        email: thisUser.email || '',
        password: thisUser.password || '',
        image: imageUrlInput.trim(),
        role: thisUser.role || 'customer',
        description: thisUser.description || '',
        phoneNumber: thisUser.phoneNumber || thisUser.phone || '',
        point: thisUser.point || 0,
        type: thisUser.type || 'Regular',
        status: thisUser.status
      };
      
      console.log('🔍 Updating user image:', {
        endpoint: `User/${thisUser.id}`,
        newImageUrl: imageUrlInput.trim()
      });
      
      await patchData(`User/${thisUser.id}`, userPayload, token);
      console.log('✅ Updated user image successfully');
      
      // Reload user data
      const updatedUserData = await fetchData(`User/${user?.id}`, token);
      console.log('Updated user data:', updatedUserData);
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

    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
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

    // Verify old password matches current password
    if (formData.oldPassword !== thisUser.password) {
      setPasswordError('Mật khẩu hiện tại không đúng');
      return;
    }

    setIsLoadingPassword(true);
    try {
      const token = user.token;
      
      // Build complete payload with new password
      const userPayload = {
        id: thisUser.id,
        name: thisUser.name || '',
        email: thisUser.email || '',
        password: formData.newPassword,
        image: thisUser.image || '',
        role: thisUser.role || 'customer',
        description: thisUser.description || '',
        phoneNumber: thisUser.phoneNumber || thisUser.phone || '',
        point: thisUser.point || 0,
        type: thisUser.type || 'Regular',
        status: thisUser.status
      };
      
      console.log('🔍 Updating user password:', {
        endpoint: `User/${thisUser.id}`
      });
      
      await patchData(`User/${thisUser.id}`, userPayload, token);
      console.log('✅ Updated password successfully');
      
      // Reload user data
      const updatedUserData = await fetchData(`User/${user?.id}`, token);
      setThisUser(updatedUserData);
      
      setSuccessPassword(true);
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
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

  const handleTogglePref = (key) => {
    setLocalPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const handleSavePref = async () => {
    setIsLoadingPref(true);
    try {
      const token = user?.token;
      // Update user preferences via PATCH
      await patchData(`User/${user.id}`, {
        ...thisUser,
        // Add preferences to user data if your API supports it
        preferences: localPreferences
      }, token);
      
      setPreferences(localPreferences);
      setSuccessPref(true);
      setTimeout(() => setSuccessPref(false), 3000);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      alert(t('Failed to update preferences. Please try again.'));
    } finally {
      setIsLoadingPref(false);
    }
  };

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;
    setIsLoadingDelete(true);
    try {
      const token = user?.token;
      await deleteData(`User/${user.id}`, token);
      
      alert(t('Account deletion initiated. You will receive a confirmation email.'));
      setShowModal(false);
      setConfirmText('');
      // Redirect to logout or home page
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert(t('Failed to delete account. Please try again.'));
    } finally {
      setIsLoadingDelete(false);
    }
  };

  // Load user profile on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const token = user?.token || null;
      try {
        const thisUserData = await fetchData(`User/${user?.id}`, token);
        console.log('thisUserData', thisUserData);
        setThisUser(thisUserData);
        
        // Initialize editedUser with fetched data
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
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id, refresh]);
  useEffect(() => {
    const section = location.state?.section;
    let targetRef;
    if (section === 'bookingHistory') {
      targetRef = bookingRef;
    } else if (section === 'favoriteFields') {
      targetRef = favoriteRef;
    } else if (section === 'vouchers') {
      targetRef = voucherRef;
    }
    if (targetRef && targetRef.current) {
      const offset = 100; // Khoảng cách (px)
      const rect = targetRef.current.getBoundingClientRect();
      window.scrollTo({
        top: rect.top + window.scrollY - offset,
        behavior: 'smooth'
      });
    }
  }, [location.state]);

  const ToggleSwitch = ({ enabled, onChange, label, description, icon }) => (
    <div className={`toggle-switch`}>
      <div className="toggle-content">
        <div className={`toggle-icon ${enabled ? 'enabled' : ''}`}>
          {icon}
        </div>
        <div className="toggle-text">
          <h4 className="toggle-label">{label}</h4>
          <p className="toggle-description">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`toggle-button ${enabled ? 'enabled' : ''}`}
      >
        <span className={`toggle-knob ${enabled ? 'enabled' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className={`profile-settings ${theme} custom-container`}>
      <SubUserHeader activeTab={activeTab} onTabChange={handleTabChange} />
      {activeTab === 'profile' ? (
        <>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px' }}>
              Đang tải thông tin người dùng...
            </div>
          )}
          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#ff4444' }}>
              Lỗi: {error}
            </div>
          )}
          {!loading && !error && thisUser && (
            <>
              <div className="profile-overview">
                <div className="profile-container">
                  <div className="profile-image-group">
                    <div className="profile-image-border">
                      <div className="profile-image-inner">
                        {thisUser.image ? (
                          <img src={thisUser.image} alt={t('Profile Image')} className="profile-image" />
                        ) : (
                          <User className="profile-user-icon" />
                        )}
                      </div>
                    </div>
                    <button 
                      className="profile-camera-button" 
                      onClick={handleCameraClick}
                      disabled={isUploadingImage}
                      title={t('Upload profile image via URL')}
                    >
                      <Camera className="camera-icon" />
                    </button>
                  </div>
                  <div className="profile-info">
                    {isEditing ? (
                      <div className="editing-form">
                        <div className="editing-grid1">
                          <input type="text" value={editedUser.name} onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} className="input-name" placeholder={t('Full Name')} />
                          <input type="tel" value={editedUser.phone} onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })} className="input-phone" placeholder={t('Phone Number')} />
                        </div>
                        {profileError && (
                          <div className="error-message" style={{ color: '#ff4444', marginTop: '10px', fontSize: '14px' }}>
                            {profileError}
                          </div>
                        )}
                        <div className="editing-buttons">
                          <button 
                            onClick={handleSaveProfile} 
                            className="save-button"
                            disabled={isLoadingProfile}
                          >
                            <Check className="icon" />
                            <span>{isLoadingProfile ? t('Saving...') : t('Save Changes')}</span>
                          </button>
                          <button 
                            onClick={handleCancelProfile} 
                            className="cancel-button"
                            disabled={isLoadingProfile}
                          >
                            <X className="icon" />
                            <span>{t('Cancel')}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="profile-details">
                        <h2 className="user-name">{thisUser.name || 'User'}</h2>
                        <div className="user-details">
                          <div className="detail-item">
                            <div className="green-dot"></div>
                            <p className="detail-text">{thisUser.email}</p>
                          </div>
                          <div className="detail-item">
                            <div className="purple-dot"></div>
                            <p className="detail-text">{thisUser.phoneNumber || thisUser.phone || 'Chưa có số điện thoại'}</p>
                          </div>
                          <div className="detail-item">
                            <Award className="detail-icon" />
                            <p className="detail-text">Loại tài khoản: {thisUser.type || 'Regular'}</p>
                          </div>
                          <div className="detail-item">
                            <Award className="detail-icon" />
                            <p className="detail-text">Điểm tích lũy: {thisUser.point || 0}</p>
                          </div>
                        </div>
                        <button onClick={() => setIsEditing(true)} className="save-button"><Edit3 className="icon" /><span>{t('Edit Profile')}</span></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid-sections">
            <div className="change-password">
              <div className="section-header">
                <Lock className="section-icon" />
                <h3 className="section-title">{t('Change Password')}</h3>
              </div>
              <form onSubmit={handleSubmitPassword} className="password-form">
                {passwordError && (
                  <div className="error-message" style={{ color: '#ff4444', marginBottom: '10px', fontSize: '14px' }}>
                    {passwordError}
                  </div>
                )}
                <div>
                  <label className="input-label">{t('Current Password')}</label>
                  <div className="input-wrapper">
                    <input type={showPasswords.old ? 'text' : 'password'} value={formData.oldPassword} onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })} className="password-input" placeholder={t('Enter current password')} required />
                    <button type="button" onClick={() => togglePasswordVisibility('old')} className="visibility-toggle">
                      {showPasswords.old ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="input-label">{t('New Password')}</label>
                  <div className="input-wrapper">
                    <input type={showPasswords.new ? 'text' : 'password'} value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} className="password-input" placeholder={t('Enter new password')} required />
                    <button type="button" onClick={() => togglePasswordVisibility('new')} className="visibility-toggle">
                      {showPasswords.new ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="input-label">{t('Confirm Password')}</label>
                  <div className="input-wrapper">
                    <input type={showPasswords.confirm ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="password-input" placeholder={t('Confirm new password')} required />
                    <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="visibility-toggle">
                      {showPasswords.confirm ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                    </button>
                  </div>
                </div>
                <button type="submit" className={`submit-button${isLoadingPassword ? ' loading-disabled' : ''}${successPassword ? ' success' : ''}`} disabled={isLoadingPassword}>
                  {isLoadingPassword ? 'Đang xử lý...' : successPassword ? 'Đã lưu thành công!' : 'Đổi mật khẩu'}
                </button>
              </form>
            </div>
            <div className="notification-preferences">
              <div className="section-header">
                <div className="header-icon-border">
                  <Bell className="bell-icon" />
                </div>
                <h3 className="section-title">{t('Notification Preferences')}</h3>
              </div>
              <div className="preferences-list">
                <ToggleSwitch enabled={localPreferences.bookingReminders} onChange={() => handleTogglePref('bookingReminders')} label={t('Booking Reminders')} description={t('Get notified before your scheduled bookings')} icon={<Calendar className="toggle-icon-inner" />} />
                <ToggleSwitch enabled={localPreferences.matchInvites} onChange={() => handleTogglePref('matchInvites')} label={t('Match Invites')} description={t('Receive invitations to team matches and events')} icon={<Users className="toggle-icon-inner" />} />
                <ToggleSwitch enabled={localPreferences.promotions} onChange={() => handleTogglePref('promotions')} label={t('Promotions & Events')} description={t('Stay updated on special offers and events')} icon={<Gift className="toggle-icon-inner" />} />
              </div>
              <button onClick={handleSavePref} disabled={isLoadingPref || successPref} className={`save-pref-button ${successPref ? 'success' : ''} ${isLoadingPref ? 'loading-disabled' : ''}`}>
                {successPref ? (
                  <div className="success-message"><Check className="icon" /><span>{t('Preferences Saved!')}</span></div>
                ) : isLoadingPref ? (
                  t('Processing...')
                ) : (
                  t('Save Preferences')
                )}
              </button>
            </div>
          </div>
          <div className="booking-history-section" ref={bookingRef}>
            <BookingHistory />
          </div>
          <div className="favorite-fields-section" ref={favoriteRef}>
            <FavoriteFields />
          </div>
          <div className="vouchers-section" ref={voucherRef}>
            <Voucher />
          </div>
          <div className="delete-account">
            <div className="section-header">
              <AlertTriangle className="alert-icon" />
              <h3 className="section-title">{t('Danger Zone')}</h3>
            </div>
            <p className="warning-text">{t('Once you delete your account, there is no going back. Please be certain.')}</p>
            <button onClick={() => setShowModal(true)} className="delete-button"><Trash2 className="icon" /><span>{t('Delete Account')}</span></button>
          </div>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">{t('Delete Account')}</h3>
                  <button onClick={() => setShowModal(false)} className="close-button"><X className="close-icon" /></button>
                </div>
                <div className="modal-body">
                  <p className="modal-description">{t('This action cannot be undone. This will permanently delete your account and remove all your data from our servers.')}</p>
                  <div>
                    <label className="input-label">{t('Please type DELETE to confirm:')}<span className="delete-word">DELETE</span></label>
                    <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="confirm-input" placeholder={t('Type DELETE here')} />
                  </div>
                </div>
                <div className="modal-actions">
                  <button onClick={handleDelete} disabled={confirmText !== 'DELETE' || isLoadingDelete} className={`confirm-delete ${confirmText === 'DELETE' && !isLoadingDelete ? 'enabled' : ''}`}>{isLoadingDelete ? t('Processing...') : t('Delete Account')}</button>
                  <button onClick={() => setShowModal(false)} className="cancel-button">{t('Cancel')}</button>
                </div>
              </div>
            </div>
          )}
          </>
          )}
        </>
      ) : (
        <div className="team-placeholder">
          <h2>{t('Team Content')}</h2>
          <p>{t('Team section coming soon...')}</p>
        </div>
      )}

      <AlertModal
        isOpen={showAlertModal}
        message={alertMessage}
        onClose={() => setShowAlertModal(false)}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Image Upload Modal */}
      {showImageUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Cập nhật ảnh đại diện</h3>
              <button onClick={() => setShowImageUploadModal(false)} className="close-button">
                <X className="close-icon" />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">Nhập URL của ảnh đại diện bạn muốn sử dụng:</p>
              <div>
                <label className="input-label">URL ảnh:</label>
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="confirm-input"
                  placeholder="https://example.com/image.jpg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleImageUpload();
                    }
                  }}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={handleImageUpload}
                disabled={!imageUrlInput.trim() || isUploadingImage}
                className={`confirm-delete ${imageUrlInput.trim() && !isUploadingImage ? 'enabled' : ''}`}
              >
                {isUploadingImage ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
              <button onClick={() => setShowImageUploadModal(false)} className="cancel-button">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;