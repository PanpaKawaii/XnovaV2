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
  X
} from 'lucide-react';
import clsx from 'clsx';
import './Sidebar.css';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { id: 'bookings', icon: Calendar, key: 'bookingManagement' },
  { id: 'fieldOwners', icon: Users, key: 'fieldOwnerManagement' },
  { id: 'users', icon: Users, key: 'userManagement' },
  { id: 'fields', icon: MapPin, key: 'fieldManagement' },
  { id: 'revenue', icon: TrendingUp, key: 'revenueAnalytics' },
  { id: 'settings', icon: Settings, key: 'settings' },
];

const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  notificationCount = 3
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar__overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx('sidebar', sidebarOpen ? 'sidebar--open' : 'sidebar--closed')}
      >
        {/* Header */}
        <div className="sidebar__header">
          <h1 className="sidebar__brand">SportAdmin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar__close-btn"
          >
            <X className="sidebar__icon sidebar__icon--md" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={clsx('sidebar__item', isActive && 'sidebar__item--active')}
              >
                <Icon className="sidebar__icon sidebar__icon--md sidebar__icon--left" />
                <span className="sidebar__label">{
                  item.key === 'dashboard' ? 'Trang chủ' :
                  item.key === 'bookingManagement' ? 'Quản lý đặt sân' :
                  item.key === 'fieldOwnerManagement' ? 'Quản lý chủ sân' :
                  item.key === 'userManagement' ? 'Quản lý khách hàng' :
                  item.key === 'fieldManagement' ? 'Quản lý sân' :
                  item.key === 'revenueAnalytics' ? 'Thống kê doanh thu' :
                  item.key === 'settings' ? 'Cài đặt' : item.key
                }</span>
                {item.id === 'dashboard' && notificationCount > 0 && (
                  <span className="sidebar__badge-wrap">
                    <Bell className="sidebar__icon sidebar__icon--sm sidebar__badge-icon" />
                    <span className="sidebar__notif">
                      {notificationCount}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="sidebar__mobile-trigger"
      >
        <Menu className="sidebar__icon sidebar__icon--md" />
      </button>
    </>
  );
};
export default Sidebar;