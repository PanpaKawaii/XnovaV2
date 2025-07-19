import React from 'react';
import { 
  Home, 
  Grid3x3, 
  BarChart3, 
  Plus, 
  Settings,
  Sun,
  Moon,
  LogOut,
  X
} from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import './Sidebar.css';

const Sidebar = ({ 
  activeTab, 
  onTabChange, 
  sidebarOpen, 
  onSidebarClose 
}) => {
  const { isDark, toggleTheme } = useTheme();

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'fields', name: 'Manage Fields', icon: Grid3x3 },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'add-field', name: 'Add Field', icon: Plus },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <>
      {sidebarOpen && (
        <div className="mobile-sidebar-overlay">
          <div className="overlay" onClick={onSidebarClose} />
          <div className="mobile-sidebar">
            <div className="mobile-header">
              <h1 className="logo">Xnova</h1>
              <button onClick={onSidebarClose} className="close-button">
                <X className="close-icon" />
              </button>
            </div>
            <nav className="mobile-nav">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      onSidebarClose();
                    }}
                    className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
                  >
                    <Icon className="nav-icon" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="desktop-sidebar">
        <div className="desktop-sidebar-inner">
          <div className="desktop-header">
            <h1 className="desktop-logo">Xnova Dashboard</h1>
          </div>
          <nav className="desktop-nav">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          <div className="footer">
            <div className="user-info">
              <div className="avatar">
                <span>VO</span>
              </div>
              <div>
                <p className="user-name">Venue Owner</p>
                <p className="user-email">owner@xnova.com</p>
              </div>
            </div>
            <div className="actions">
              <button 
                onClick={toggleTheme}
                className="theme-button"
              >
                {isDark ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
                {isDark ? 'Light' : 'Dark'}
              </button>
              <button className="logout-button">
                <LogOut className="logout-icon" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;