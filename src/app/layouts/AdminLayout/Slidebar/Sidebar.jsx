import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  MapPin, 
  TrendingUp, 
  Settings, 
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';

const menuItems = [
  { id: 'admin/dashboard', icon: LayoutDashboard, label: 'Trang chủ' },
  { id: 'admin/bookings', icon: Calendar, label: 'Quản lý đặt sân' },
  { id: 'admin/fieldOwners', icon: Users, label: 'Quản lý chủ sân' },
  { id: 'admin/users', icon: Users, label: 'Quản lý khách hàng' },
  { id: 'admin/fields', icon: MapPin, label: 'Quản lý sân' },
  { id: 'admin/revenue', icon: TrendingUp, label: 'Thống kê doanh thu' },
  { id: 'admin/settings', icon: Settings, label: 'Cài đặt' },
];

export const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  notificationCount = 3
}) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
  };
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="ad-sidebar__overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'ad-sidebar',
        sidebarOpen && 'ad-sidebar--open'
      )}>
        {/* Header */}
        <div className="ad-sidebar__header">
          <h1 className="ad-sidebar__title">
            SportAdmin
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ad-sidebar__close-btn"
            aria-label="Close sidebar"
          >
            <X className="ad-sidebar__close-icon" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="ad-sidebar__nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={
                  item.id === 'dashboard' ? '/' : `/${item.id}`
                }
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => clsx(
                  'ad-sidebar__link',
                  isActive && 'ad-sidebar__link--active'
                )}
              >
                <Icon className="ad-sidebar__link-icon" />
                <span className="ad-sidebar__link-text">{item.label}</span>
                {item.id === 'dashboard' && notificationCount > 0 && (
                  <span className="ad-sidebar__notification">
                    <Bell className="ad-sidebar__notification-icon" />
                    <span className="ad-sidebar__notification-badge">
                      {notificationCount}
                    </span>
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="ad-sidebar__footer">
          <button
            type="button"
            className="ad-sidebar__logout-btn"
            onClick={handleLogout}
          >
            <LogOut className="ad-sidebar__logout-icon" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="ad-sidebar__toggle-btn"
        aria-label="Open sidebar"
      >
        <Menu className="ad-sidebar__toggle-icon" />
      </button>
    </>
  );
};
