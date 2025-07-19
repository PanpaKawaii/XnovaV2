// SettingsPage.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
import { useTheme } from '../../hooks/ThemeContext';
import './SettingsPage.css';

function SettingsPage() {
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
                <span>VO</span>
              </div>
              <div>
                <h3 className="name">
                  Venue Owner
                </h3>
                <p className="email">
                  owner@xnova.com
                </p>
              </div>
            </div>
            <div className="form-grid">
              <div>
                <label className="label">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Venue Owner"
                  className="input"
                />
              </div>
              <div>
                <label className="label">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="owner@xnova.com"
                  className="input"
                />
              </div>
              <div>
                <label className="label">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="input"
                />
              </div>
              <div>
                <label className="label">
                  Company
                </label>
                <input
                  type="text"
                  defaultValue="Xnova Sports"
                  className="input"
                />
              </div>
            </div>
            <button className="save-btn">
              Save Changes
            </button>
          </div>
        );

      case 'security':
        return (
          <div className="security-content">
            <div className="security-item">
              <div className="item-header">
                <div className="item-info">
                  <Shield className="item-icon" />
                  <div>
                    <h4 className="item-title">
                      Two-Factor Authentication
                    </h4>
                    <p className="item-desc">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <button className="enable-btn">
                  Enable
                </button>
              </div>
            </div>

            <div className="security-item">
              <div className="item-header">
                <div className="item-info">
                  <Lock className="item-icon" />
                  <div>
                    <h4 className="item-title">
                      Change Password
                    </h4>
                    <p className="item-desc">
                      Update your account password
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="change-btn"
                >
                  Change
                </button>
              </div>
            </div>

            <div className="security-item">
              <div className="item-header">
                <div className="item-info">
                  <AlertCircle className="item-icon" />
                  <div>
                    <h4 className="item-title">
                      Login History
                    </h4>
                    <p className="item-desc">
                      View recent login activity
                    </p>
                  </div>
                </div>
                <button className="view-btn">
                  View
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="notifications-content">
            <div className="notification-item">
              <div className="item-header">
                <div>
                  <h4 className="item-title">
                    Email Notifications
                  </h4>
                  <p className="item-desc">
                    Receive notifications via email
                  </p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <div className="slider"></div>
                </label>
              </div>
            </div>

            <div className="notification-item">
              <div className="item-header">
                <div>
                  <h4 className="item-title">
                    Push Notifications
                  </h4>
                  <p className="item-desc">
                    Receive push notifications in browser
                  </p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <div className="slider"></div>
                </label>
              </div>
            </div>

            <div className="notification-item">
              <div className="item-header">
                <div>
                  <h4 className="item-title">
                    Booking Alerts
                  </h4>
                  <p className="item-desc">
                    Get notified about new bookings
                  </p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <div className="slider"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="appearance-content">
            <div className="appearance-item">
              <div>
                <h4 className="item-title">
                  Dark Mode
                </h4>
                <p className="item-desc">
                  Switch between light and dark themes
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="theme-btn"
              >
                {isDark ? 'Switch to Light' : 'Switch to Dark'}
              </button>
            </div>

            <div className="color-theme">
              <h4 className="item-title">
                Color Theme
              </h4>
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
              <label className="label">
                Language
              </label>
              <select className="select">
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
                <option value="jp">日本語</option>
              </select>
            </div>

            <div>
              <label className="label">
                Time Zone
              </label>
              <select className="select">
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
            <div className="data-item">
              <div className="item-header">
                <div className="item-info">
                  <Download className="item-icon" />
                  <div>
                    <h4 className="item-title">
                      Export Data
                    </h4>
                    <p className="item-desc">
                      Download your data as CSV or JSON
                    </p>
                  </div>
                </div>
                <button className="export-btn">
                  Export
                </button>
              </div>
            </div>

            <div className="data-item">
              <div className="item-header">
                <div className="item-info">
                  <Upload className="item-icon" />
                  <div>
                    <h4 className="item-title">
                      Import Data
                    </h4>
                    <p className="item-desc">
                      Import data from CSV or JSON files
                    </p>
                  </div>
                </div>
                <button className="import-btn">
                  Import
                </button>
              </div>
            </div>

            <div className="data-item">
              <div className="item-header">
                <div className="item-info">
                  <Database className="item-icon" />
                  <div>
                    <h4 className="item-title">
                      Clear Data
                    </h4>
                    <p className="item-desc">
                      Clear all local data and cache
                    </p>
                  </div>
                </div>
                <button className="clear-btn">
                  Clear
                </button>
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
      <div>
        <h1 className="title">
          Settings
        </h1>
        <p className="subtitle">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="layout">
        <div className="sidebar">
          <nav className="nav">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="content">
          <div className="content-card">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">
              Change Password
            </h3>
            <div className="modal-form">
              <div>
                <label className="label">
                  Current Password
                </label>
                <input
                  type="password"
                  className="input"
                />
              </div>
              <div>
                <label className="label">
                  New Password
                </label>
                <input
                  type="password"
                  className="input"
                />
              </div>
              <div>
                <label className="label">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="input"
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="update-btn"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SettingsPage.propTypes = {};

export default SettingsPage;