import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { fetchData } from '../../../../mocks/CallingAPI';
import './Header.css';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      if (!user?.token || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchData(`User/${user.id}`, user.token);
        setUserInfo(userData);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, [user]);

  const getInitials = (name) => {
    if (!name) return 'A';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header className="ad-header">
      <div className="ad-header__container">
        <div className="ad-header__logo">
          <h1 className="ad-header__title">
            SportAdmin
          </h1>
        </div>
        <div className="ad-header__actions">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ad-header__button ad-header__button--theme"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="ad-header__icon" />
            ) : (
              <Sun className="ad-header__icon" />
            )}
          </button>

          {/* User Avatar */}
          <div className="ad-header__user">
            {loading ? (
              <div className="ad-header__user-info">
                <p className="ad-header__user-name">Loading...</p>
              </div>
            ) : (
              <div className="ad-header__user-info">
                <p className="ad-header__user-name">
                  {userInfo?.fullName || user?.username || 'Admin User'}
                </p>
                <p className="ad-header__user-email">
                  {userInfo?.email || user?.email || 'admin@sportfield.com'}
                </p>
              </div>
            )}
            <div className="ad-header__avatar">
              {userInfo?.image ? (
                <img 
                  src={userInfo.image} 
                  alt={userInfo.fullName || 'User'}
                  className="ad-header__avatar-img"
                />
              ) : (
                <span className="ad-header__avatar-text">
                  {getInitials(userInfo?.fullName || user?.username || 'Admin')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
