import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const settingsTabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'language', name: 'Language', icon: Globe },
    { id: 'data', name: 'Data & Backup', icon: Database }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="profile-content">
            <div className="profile-header">
              <div className="avatar">
                <span className="avatar-text">VO</span>
              </div>
              <div>
                <h3 className="user-name">Venue Owner</h3>
                <p className="user-email">owner@xnova.com</p>
              </div>
            </div>
            <div className="profile-form">
              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  defaultValue="Venue Owner"
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Email</label>
                <input
                  type="email"
                  defaultValue="owner@xnova.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Phone</label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Company</label>
                <input
                  type="text"
                  defaultValue="Xnova Sports"
                  className="input-field"
                />
              </div>
            </div>
            <button className="save-button">Save Changes</button>
          </div>
        );

      case 'security':
        return (
          <div className="security-content">
            <div className="security-card">
              <div className="card-header">
                <div className="card-title">
                  <Shield className="card-icon" />
                  <div>
                    <h4 className="card-heading">Two-Factor Authentication</h4>
                    <p className="card-description">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <button className="enable-button">Enable</button>
              </div>
            </div>
            <div className="security-card">
              <div className="card-header">
                <div className="card-title">
                  <Lock className="card-icon" />
                  <div>
                    <h4 className="card-heading">Change Password</h4>
                    <p className="card-description">Update your account password</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="change-button"
                >Change</button>
              </div>
            </div>
            <div className="security-card">
              <div className="card-header">
                <div className="card-title">
                  <AlertCircle className="card-icon" />
                  <div>
                    <h4 className="card-heading">Login History</h4>
                    <p className="card-description">View recent login activity</p>
                  </div>
                </div>
                <button className="view-button">View</button>
              </div>
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

      case 'appearance':
        return (
          <div className="appearance-content">
            <div className="theme-switch">
              <div>
                <h4 className="theme-title">Dark Mode</h4>
                <p className="theme-description">Switch between light and dark themes</p>
              </div>
              <button
                onClick={toggleTheme}
                className="theme-button"
              >
                {isDark ? 'Switch to Light' : 'Switch to Dark'}
              </button>
            </div>
            <div className="color-theme">
              <h4 className="color-title">Color Theme</h4>
              <div className="color-grid">
                {['#A8FF00', '#A259FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'].map((color) => (
                  <button
                    key={color}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="language-content">
            <div>
              <label className="input-label">Language</label>
              <select className="select-field">
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
                <option value="jp">日本語</option>
              </select>
            </div>
            <div>
              <label className="input-label">Time Zone</label>
              <select className="select-field">
                <option value="utc-7">Pacific Time (UTC-7)</option>
                <option value="utc-6">Mountain Time (UTC-6)</option>
                <option value="utc-5">Central Time (UTC-5)</option>
                <option value="utc-4">Eastern Time (UTC-4)</option>
                <option value="utc+7">Vietnam Time (UTC+7)</option>
                <option value="utc+9">Japan Time (UTC+9)</option>
              </select>
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