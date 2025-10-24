import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Camera, Edit3, Check, X, User, MapPin, Award, Eye, EyeOff, Lock, Trash2, AlertTriangle, Bell, Calendar, Users, Gift } from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import './ProfileSettings.css';
import SubUserHeader from '../../../layouts/UserLayout/SubUserHeader/SubUserHeader';
import BookingHistory from './BookingHistory';
import FavoriteFields from './FavoriteFields';
import Voucher from './Voucher';
import { useTranslation } from 'react-i18next';

const initialUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: 'none',
  profileImage: '',
  position: 'Forward',
  level: 'Pro',
  location: 'Hanoi',
  joinedDate: new Date().toISOString(),
};
const initialPreferences = {
  bookingReminders: true,
  matchInvites: false,
  promotions: true,
};


const ProfileSettings = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingRef = useRef(null);
  const favoriteRef = useRef(null);
  const voucherRef = useRef(null);
  const passedUser = location.state?.user || {};
  const passedUserInfo = location.state?.userInfo || {};

  const [activeTab, setActiveTab] = useState('profile');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'team') {
      navigate('/team', {
        state: {
          user: passedUser,
          userInfo: passedUserInfo
        }
      });
    } else if (tab === 'reward') {
      navigate('/reward', {
        state: {
          user: passedUser,
          userInfo: passedUserInfo
        }
      });
    }
  };

  const [user, setUser] = useState({
    ...initialUser,
    email: passedUser.email || initialUser.email,
    name: passedUserInfo.name || initialUser.name,
    profileImage: passedUserInfo.image || initialUser.profileImage,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [successPassword, setSuccessPassword] = useState(false);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isLoadingPref, setIsLoadingPref] = useState(false);
  const [successPref, setSuccessPref] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const handleSaveProfile = () => {
    setUser(editedUser);
    setIsEditing(false);
  };
  const handleCancelProfile = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setIsLoadingPassword(true);
    setTimeout(() => {
      setIsLoadingPassword(false);
      setSuccessPassword(true);
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessPassword(false), 3000);
    }, 1000);
  };
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleTogglePref = (key) => {
    setLocalPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const handleSavePref = async () => {
    setIsLoadingPref(true);
    setTimeout(() => {
      setPreferences(localPreferences);
      setIsLoadingPref(false);
      setSuccessPref(true);
      setTimeout(() => setSuccessPref(false), 3000);
    }, 1000);
  };

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;
    setIsLoadingDelete(true);
    setTimeout(() => {
      setIsLoadingDelete(false);
      alert('Account deletion initiated. You will receive a confirmation email.');
      setShowModal(false);
      setConfirmText('');
    }, 2000);
  };
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
          <div className="profile-overview">
            <div className="profile-container">
              <div className="profile-image-group">
                <div className="profile-image-border">
                  <div className="profile-image-inner">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={t('Profile Image')} className="profile-image" />
                    ) : (
                      <User className="profile-user-icon" />
                    )}
                  </div>
                </div>
                <button className="profile-camera-button">
                  <Camera className="camera-icon" />
                </button>
                {user.position && user.level && (
                  <div className="player-badge">
                    {user.position} - {user.level}
                  </div>
                )}
              </div>
              <div className="profile-info">
                {isEditing ? (
                  <div className="editing-form">
                    <div className="editing-grid1">
                      <input type="text" value={editedUser.name} onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} className="input-name" placeholder={t('Full Name')} />
                      <input type="tel" value={editedUser.phone} onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })} className="input-phone" placeholder={t('Phone Number')} />
                    </div>
                    <div className="editing-grid2">
                      <input type="text" value={editedUser.location || ''} onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })} className="input-location" placeholder={t('Location')} />
                      <input type="text" value={editedUser.position || ''} onChange={(e) => setEditedUser({ ...editedUser, position: e.target.value })} className="input-position" placeholder={t('Position')} />
                    </div>
                    <div className="editing-buttons">
                      <button onClick={handleSaveProfile} className="save-button"><Check className="icon" /><span>{t('Save Changes')}</span></button>
                      <button onClick={handleCancelProfile} className="cancel-button"><X className="icon" /><span>{t('Cancel')}</span></button>
                    </div>
                  </div>
                ) : (
                  <div className="profile-details">
                    <h2 className="user-name">{user.name}</h2>
                    <div className="user-details">
                      <div className="detail-item">
                        <div className="green-dot"></div>
                        <p className="detail-text">{user.email}</p>
                      </div>
                      <div className="detail-item">
                        <div className="purple-dot"></div>
                        <p className="detail-text">{user.phone}</p>
                      </div>
                      {user.location && (
                        <div className="detail-item">
                          <MapPin className="detail-icon" />
                          <p className="detail-text">{user.location}</p>
                        </div>
                      )}
                      <div className="detail-item">
                        <Award className="detail-icon" />
                        <p className="detail-member">{t('Member since')} {new Date(user.joinedDate).toLocaleDateString()}</p>
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
                <button type="submit" className={`submit-button${isLoadingPassword ? ' loading-disabled' : ''}${successPassword ? ' success' : ''}`}>{isLoadingPassword ? t('Processing...') : successPassword ? t('Preferences Saved!') : t('Save Changes')}</button>
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
      ) : (
        <div className="team-placeholder">
          <h2>{t('Team Content')}</h2>
          <p>{t('Team section coming soon...')}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;