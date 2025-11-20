import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Grid3x3, 
  Plus, 
  BarChart3, 
  Settings,
  Sun,
  Moon,
  LogOut,
  X,
  User,
  Bell,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import './Sidebar.css';
import LOGO from "../../../assets/LOGO.png";

const Sidebar = ({ 
  activeTab, 
  onTabChange, 
  sidebarOpen, 
  onSidebarClose 
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/owner/dashboard' },
    { id: 'manage-fields', name: 'Manage Fields', icon: Grid3x3, path: '/owner/manage-fields' },
    { id: 'add-field', name: 'Add Field', icon: Plus, path: '/owner/add-field' },
    { id: 'reports', name: 'Reports', icon: BarChart3, path: '/owner/reports' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/owner/settings' },
  ];

  const handleNavClick = (item) => {
    navigate(item.path);
    onTabChange(item.id);
    if (sidebarOpen) {
      onSidebarClose();
    }
  };

  const handleLogout = () => {
    setShowConfirmModal(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    setShowConfirmModal(false);
    try {
      logout(); // Gọi logout từ AuthContext
      console.log('User logged out successfully');
      
      // Đóng sidebar nếu đang mở (mobile)
      if (sidebarOpen) {
        onSidebarClose();
      }
      
      // Delay nhỏ để user thấy được feedback
      setTimeout(() => {
        navigate('/'); // Redirect về trang chủ
      }, 500);
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
      setIsLoggingOut(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/owner/dashboard' && location.pathname === '/owner');
  };

  return (
    <>
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={onSidebarClose}>
          <div className="mobile-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-header">
              <div className="mobile-logo">
                <img src={LOGO} alt="Xnova Logo" className="logo-image" />
                <h1 className="logo-text">Xnova</h1>
              </div>
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
                    onClick={() => handleNavClick(item)}
                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <Icon className="nav-icon" />
                    <span className="nav-text">{item.name}</span>
                    <ChevronRight className="chevron" />
                  </button>
                );
              })}
            </nav>
            <div className="mobile-footer">
              <div className="user-info">
                <div className="avatar">
                  <User className="avatar-icon" />
                </div>
                <div className="user-details">
                  <p className="user-name">{user?.name || user?.username || 'Venue Owner'}</p>
                  <p className="user-email">{user?.email || 'owner@xnova.com'}</p>
                </div>
              </div>
              <div className="footer-actions">
                <button 
                  onClick={toggleTheme}
                  className="theme-button"
                >
                  {isDark ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
                  <span>{isDark ? 'Light' : 'Dark'}</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="logout-button"
                  title="Đăng xuất"
                  disabled={isLoggingOut}
                >
                  <LogOut className="logout-icon" />
                  <span>{isLoggingOut ? 'Đang đăng xuất...' : 'Logout'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="logo-container">
              <img src={LOGO} alt="Xnova Logo" className="logo-image" />
            </div>
          </div>
          
          <nav className="sidebar-nav">
            
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-text">{item.name}</span>
                  <ChevronRight className="chevron" />
                </button>
              );
            })}
          </nav>
          
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="avatar">
                <User className="avatar-icon" />
              </div>
              <div className="user-details">
                <p className="user-name">{user?.name || user?.username || 'Venue Owner'}</p>
                <p className="user-email">{user?.email || 'owner@xnova.com'}</p>
              </div>
              <button className="notification-button">
                <Bell className="bell-icon" />
              </button>
            </div>
            <div className="footer-actions">
              <button 
                onClick={toggleTheme}
                className="theme-button"
              >
                {isDark ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="logout-button"
                title="Đăng xuất"
                disabled={isLoggingOut}
              >
                <LogOut className="logout-icon" />
                <span>{isLoggingOut ? 'Đang đăng xuất...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showConfirmModal}
        message="Bạn có chắc chắn muốn đăng xuất?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowConfirmModal(false)}
      />
    </>
  );
};

export default Sidebar;