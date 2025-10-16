import React, { useState, useEffect } from 'react';
import { Sun, Moon, Globe, Bell } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (_) {}
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const language = (typeof window !== 'undefined' && localStorage.getItem('language')) || 'vi';
  const toggleLanguage = () => {
    try {
      const next = language === 'vi' ? 'en' : 'vi';
      localStorage.setItem('language', next);
    } catch (_) {}
    if (typeof window !== 'undefined') window.location.reload();
  };

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <h1 className="header__title">SportAdmin</h1>
        </div>

        <div className="header__actions">
          {/* Language Toggle */}
          <button onClick={toggleLanguage} className="header__btn header__btn--lang">
            <Globe className="header__icon header__icon--sm" />
            <span className="header__btn-text">{language === 'vi' ? 'VI' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="header__btn header__btn--icon">
            {theme === 'light' ? (
              <Moon className="header__icon header__icon--md" />
            ) : (
              <Sun className="header__icon header__icon--md" />
            )}
          </button>

          {/* Notifications */}
          <button className="header__btn header__btn--icon header__btn--notif">
            <Bell className="header__icon header__icon--md" />
            <span className="header__badge">3</span>
          </button>

          {/* User Avatar */}
          <div className="header__user">
            <div className="header__user-info">
              <p className="header__user-name">Admin User</p>
              <p className="header__user-email">admin@sportfield.com</p>
            </div>
            <div className="header__avatar">
              <span className="header__avatar-initial">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;