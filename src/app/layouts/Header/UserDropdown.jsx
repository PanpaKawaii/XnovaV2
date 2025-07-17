import React, { useState, useEffect, useRef } from 'react';
import { User, ChevronDown, UserPlus, History, Heart, Settings, LogOut } from 'lucide-react';
import './UserDropdown.css';

const UserDropdown = ({ user, userInfo, handleLogout, t, isMobile }) => {
  const [userDropdown, setUserDropdown] = useState(false);
  const userBtnRef = useRef(null);

  useEffect(() => {
    if (!userDropdown || isMobile) return;
    const handleClick = (e) => {
      if (userBtnRef.current && !userBtnRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userDropdown, isMobile]);

  if (isMobile) {
    // Phiên bản mobile: menu tĩnh
    return (
      <div className="header__mobile-user">
        <div className="header__mobile-user-info">
          <div className="header__mobile-user-avatar">
            {userInfo?.image ? (
              <img src={userInfo.image} alt={userInfo.name} className="header__mobile-user-avatar-img" />
            ) : (
              <User className="header__mobile-user-avatar-icon" />
            )}
          </div>
          <div className="header__mobile-user-details">
            <p className="header__mobile-user-name">{userInfo?.name || 'User'}</p>
            <p className="header__mobile-user-email">{user.email}</p>
          </div>
        </div>
        <button className="header__mobile-user-menu-item">
          <UserPlus className="header__mobile-user-menu-icon" />
          <span>{t('My Team')}</span>
        </button>
        <button className="header__mobile-user-menu-item">
          <History className="header__mobile-user-menu-icon" />
          <span>{t('Booking History')}</span>
        </button>
        <button className="header__mobile-user-menu-item">
          <Heart className="header__mobile-user-menu-icon" />
          <span>{t('Favorite Fields')}</span>
        </button>
        <div className="header__mobile-user-menu-divider"></div>
        <button className="header__mobile-user-menu-item">
          <Settings className="header__mobile-user-menu-icon" />
          <span>{t('Profile Settings')}</span>
        </button>
        <button 
          className="header__mobile-user-menu-item header__mobile-user-menu-item--logout"
          onClick={handleLogout}
        >
          <LogOut className="header__mobile-user-menu-icon" />
          <span>{t('Logout')}</span>
        </button>
      </div>
    );
  }

  // Phiên bản desktop: dropdown
  return (
    <div className="header__user-dropdown" ref={userBtnRef}>
      <button
        className={`header__user-btn ${userDropdown ? 'header__user-btn--active' : ''}`}
        onClick={() => setUserDropdown((v) => !v)}
        aria-label="User menu"
      >
        <div className="header__user-avatar">
          {userInfo?.image ? (
            <img src={userInfo.image} alt={userInfo.name} className="header__user-avatar-img" />
          ) : (
            <User className="header__user-avatar-icon" />
          )}
        </div>
        <span className="header__user-name">{userInfo?.name || user.email.split('@')[0]}</span>
        <ChevronDown className="header__user-chevron" />
      </button>
      
      {userDropdown && (
        <div className="header__user-menu">
          <div className="header__user-info">
            <div className="header__user-info-avatar">
              {userInfo?.image ? (
                <img src={userInfo.image} alt={userInfo.name} className="header__user-info-avatar-img" />
              ) : (
                <User className="header__user-info-avatar-icon" />
              )}
            </div>
            <div className="header__user-info-details">
              <p className="header__user-info-name">{userInfo?.name || 'User'}</p>
              <p className="header__user-info-email">{user.email}</p>
            </div>
          </div>
          <div className="header__user-menu-divider"></div>
          <button className="header__user-menu-item">
            <UserPlus className="header__user-menu-icon" />
            <span>{t('My Team')}</span>
          </button>
          <button className="header__user-menu-item">
            <History className="header__user-menu-icon" />
            <span>{t('Booking History')}</span>
          </button>
          <button className="header__user-menu-item">
            <Heart className="header__user-menu-icon" />
            <span>{t('Favorite Fields')}</span>
          </button>
          <div className="header__user-menu-divider"></div>
          <button className="header__user-menu-item">
            <Settings className="header__user-menu-icon" />
            <span>{t('Profile Settings')}</span>
          </button>
          <button 
            className="header__user-menu-item header__user-menu-item--logout"
            onClick={() => {
              handleLogout();
              setUserDropdown(false);
            }}
          >
            <LogOut className="header__user-menu-icon" />
            <span>{t('Logout')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;