import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="header">
      <div className="header-inner">
        <button onClick={onMenuClick} className="menu-button">
          <Menu className="menu-icon" />
        </button>
        <h1 className="header-title">Xnova</h1>
        <button onClick={toggleTheme} className="theme-button">
          <Sun className="theme-icon theme-sun" />
          <Moon className="theme-icon theme-moon" />
        </button>
      </div>
    </div>
  );
};

export default Header;