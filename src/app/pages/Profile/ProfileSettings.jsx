import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Camera, Edit3, Check, X, User, MapPin, Award, Eye, EyeOff, Lock, Trash2, AlertTriangle, Bell, Calendar, Users, Gift } from 'lucide-react';
import { useTheme } from '../../hooks/ThemeContext';
import './ProfileSettings.css';
import './BookingHistory.css';
import SubUserHeader from '../../layouts/SubUserHeader/SubUserHeader';
import BookingHistory from './BookingHistory';

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

const sampleBookings = [
  {
    id: '1',
    fieldName: 'Central Park Field',
    date: '2025-07-10',
    time: '14:00',
    duration: '2h',
    price: 80,
    status: 'completed'
  },
  {
    id: '2',
    fieldName: 'Riverside Stadium',
    date: '2025-07-15',
    time: '18:00',
    duration: '1.5h',
    price: 60,
    status: 'upcoming'
  },
  {
    id: '3',
    fieldName: 'City Arena',
    date: '2025-06-20',
    time: '10:00',
    duration: '1h',
    price: 40,
    status: 'cancelled'
  },
  {
    id: '4',
    fieldName: 'Downtown Pitch',
    date: '2025-07-05',
    time: '16:00',
    duration: '2h',
    price: 75,
    status: 'completed'
  }
];

const ProfileSettings = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
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
    <div className={`profile-settings ${theme}`}>
      <SubUserHeader activeTab={activeTab} onTabChange={handleTabChange} />
      {activeTab === 'profile' ? (
        <>
          <div className="profile-overview">
            <div className="profile-container">
              <div className="profile-image-group">
                <div className="profile-image-border">
                  <div className="profile-image-inner">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="profile-image" />
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
                      <input type="text" value={editedUser.name} onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} className="input-name" placeholder="Full Name" />
                      <input type="tel" value={editedUser.phone} onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })} className="input-phone" placeholder="Phone Number" />
                    </div>
                    <div className="editing-grid2">
                      <input type="text" value={editedUser.location || ''} onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })} className="input-location" placeholder="Location" />
                      <input type="text" value={editedUser.position || ''} onChange={(e) => setEditedUser({ ...editedUser, position: e.target.value })} className="input-position" placeholder="Position" />
                    </div>
                    <div className="editing-buttons">
                      <button onClick={handleSaveProfile} className="save-button"><Check className="icon" /><span>Save Changes</span></button>
                      <button onClick={handleCancelProfile} className="cancel-button"><X className="icon" /><span>Cancel</span></button>
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
                        <p className="detail-member">Member since {new Date(user.joinedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="save-button"><Edit3 className="icon" /><span>Edit Profile</span></button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid-sections">
            <div className="change-password">
              <div className="section-header">
                <Lock className="section-icon" />
                <h3 className="section-title">Change Password</h3>
              </div>
              <form onSubmit={handleSubmitPassword} className="password-form">
                <div>
                  <label className="input-label">Current Password</label>
                  <div className="input-wrapper">
                    <input type={showPasswords.old ? 'text' : 'password'} value={formData.oldPassword} onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })} className="password-input" placeholder="Enter current password" required />
                    <button type="button" onClick={() => togglePasswordVisibility('old')} className="visibility-toggle">
                      {showPasswords.old ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="input-label">New Password</label>
                  <div className="input-wrapper">
                    <input type={showPasswords.new ? 'text' : 'password'} value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} className="password-input" placeholder="Enter new password" required />
                    <button type="button" onClick={() => togglePasswordVisibility('new')} className="visibility-toggle">
                      {showPasswords.new ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="input-label">Confirm New Password</label>
                  <div className="input-wrapper">
                    <input type={showPasswords.confirm ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="password-input" placeholder="Confirm new password" required />
                    <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="visibility-toggle">
                      {showPasswords.confirm ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={isLoadingPassword || successPassword} className={`submit-button ${successPassword ? 'success' : ''} ${isLoadingPassword ? 'loading-disabled' : ''}`}>
                  {successPassword ? (
                    <div className="success-message"><Check className="icon" /><span>Password Changed!</span></div>
                  ) : isLoadingPassword ? (
                    'Changing Password...'
                  ) : (
                    'Change Password'
                  )}
                </button>
              </form>
            </div>
            <div className="notification-preferences">
              <div className="section-header">
                <div className="header-icon-border">
                  <Bell className="bell-icon" />
                </div>
                <h3 className="section-title">Notification Preferences</h3>
              </div>
              <div className="preferences-list">
                <ToggleSwitch enabled={localPreferences.bookingReminders} onChange={() => handleTogglePref('bookingReminders')} label="Booking Reminders" description="Get notified before your scheduled bookings" icon={<Calendar className="toggle-icon-inner" />} />
                <ToggleSwitch enabled={localPreferences.matchInvites} onChange={() => handleTogglePref('matchInvites')} label="Match Invites" description="Receive invitations to team matches and events" icon={<Users className="toggle-icon-inner" />} />
                <ToggleSwitch enabled={localPreferences.promotions} onChange={() => handleTogglePref('promotions')} label="Promotions & Events" description="Stay updated on special offers and events" icon={<Gift className="toggle-icon-inner" />} />
              </div>
              <button onClick={handleSavePref} disabled={isLoadingPref || successPref} className={`save-pref-button ${successPref ? 'success' : ''} ${isLoadingPref ? 'loading-disabled' : ''}`}>
                {successPref ? (
                  <div className="success-message"><Check className="icon" /><span>Preferences Saved!</span></div>
                ) : isLoadingPref ? (
                  'Saving Preferences...'
                ) : (
                  'Save Preferences'
                )}
              </button>
            </div>
          </div>
          <div className="booking-history-section">
            <BookingHistory bookings={sampleBookings} />
          </div>
          <div className="delete-account">
            <div className="section-header">
              <AlertTriangle className="alert-icon" />
              <h3 className="section-title">Danger Zone</h3>
            </div>
            <p className="warning-text">Once you delete your account, there is no going back. Please be certain.</p>
            <button onClick={() => setShowModal(true)} className="delete-button"><Trash2 className="icon" /><span>Delete Account</span></button>
          </div>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">Delete Account</h3>
                  <button onClick={() => setShowModal(false)} className="close-button"><X className="close-icon" /></button>
                </div>
                <div className="modal-body">
                  <p className="modal-description">This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
                  <div>
                    <label className="input-label">Please type <span className="delete-word">DELETE</span> to confirm:</label>
                    <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="confirm-input" placeholder="Type DELETE here" />
                  </div>
                </div>
                <div className="modal-actions">
                  <button onClick={handleDelete} disabled={confirmText !== 'DELETE' || isLoadingDelete} className={`confirm-delete ${confirmText === 'DELETE' && !isLoadingDelete ? 'enabled' : ''}`}>
                    {isLoadingDelete ? 'Deleting...' : 'Delete Account'}
                  </button>
                  <button onClick={() => setShowModal(false)} className="cancel-button">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="team-placeholder">
          <h2>Team Content</h2>
          <p>Team section coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;