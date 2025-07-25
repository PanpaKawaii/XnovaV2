import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown, UserPlus, History, Heart, Settings, LogOut, Gift } from 'lucide-react';
import './UserDropdown.css';

const UserDropdown = ({ user, userInfo, handleLogout, t, isMobile }) => {
  const [userDropdown, setUserDropdown] = useState(false);
  const userBtnRef = useRef(null);
  const navigate = useNavigate();

  const handleMyTeam = () => {
    navigate('/team-management', { state: { user, userInfo } });
    if (!isMobile) setUserDropdown(false);
  };

  const handleBookingHistory = () => {
    navigate('/profile-settings', { state: { user, userInfo, section: 'bookingHistory' } });
    if (!isMobile) setUserDropdown(false);
  };
    const handleFavoriteFields = () => {
    navigate('/profile-settings', { state: { user, userInfo, section: 'favoriteFields' } });
    if (!isMobile) setUserDropdown(false);
  };

  const handleVouchers = () => {
    navigate('/profile-settings', { state: { user, userInfo, section: 'vouchers' } });
    if (!isMobile) setUserDropdown(false);
  };

  const handleProfileSettings = () => {
    navigate('/profile-settings', { state: { user, userInfo } });
    if (!isMobile) setUserDropdown(false);
  };

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
        <button className="header__mobile-user-menu-item" onClick={handleMyTeam}>
          <UserPlus className="header__mobile-user-menu-icon" />
          <span>{t('My Team')}</span>
        </button>
        <button className="header__mobile-user-menu-item" onClick={handleBookingHistory}>
          <History className="header__mobile-user-menu-icon" />
          <span>{t('Booking History')}</span>
        </button>
        <button className="header__mobile-user-menu-item" onClick={handleFavoriteFields}>
            <Heart className="header__user-menu-icon" />
            <span>{t('Favorite Fields')}</span>
        </button>
        <button className="header__mobile-user-menu-item" onClick={handleVouchers}>
          <Gift className="header__mobile-user-menu-icon" />
          <span>{t('Vouchers')}</span>
        </button>
        <div className="header__mobile-user-menu-divider"></div>
        <button className="header__mobile-user-menu-item" onClick={handleProfileSettings}>
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
          <button className="header__user-menu-item" onClick={handleMyTeam}>
            <UserPlus className="header__user-menu-icon" />
            <span>{t('My Team')}</span>
          </button>
          <button className="header__user-menu-item" onClick={handleBookingHistory}>
            <History className="header__user-menu-icon" />
            <span>{t('Booking History')}</span>
          </button>
          <button className="header__user-menu-item" onClick={handleFavoriteFields}>
            <Heart className="header__user-menu-icon" />
            <span>{t('Favorite Fields')}</span>
          </button>
          <button className="header__user-menu-item" onClick={handleVouchers}>
            <Gift className="header__user-menu-icon" />
            <span>{t('Vouchers')}</span>
          </button>
          <div className="header__user-menu-divider"></div>
          <button className="header__user-menu-item" onClick={handleProfileSettings}>
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