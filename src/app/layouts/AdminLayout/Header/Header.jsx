import React from 'react';
import { Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import './Header.css';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

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

          {/* Notifications */}
          <button 
            className="ad-header__button ad-header__button--notification"
            aria-label="Notifications"
          >
            <Bell className="ad-header__icon" />
            <span className="ad-header__badge">
              3
            </span>
          </button>

          {/* User Avatar */}
          <div className="ad-header__user">
            <div className="ad-header__user-info">
              <p className="ad-header__user-name">Admin User</p>
              <p className="ad-header__user-email">admin@sportfield.com</p>
            </div>
            <div className="ad-header__avatar">
              <span className="ad-header__avatar-text">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
