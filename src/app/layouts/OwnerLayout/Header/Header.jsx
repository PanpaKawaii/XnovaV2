import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import './Header.css';
import LOGO from "../../../assets/LOGO.png";
const Header = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <header className="owner-header">
      <div className="header-container">
        <div className="header-left">
          <button onClick={onMenuClick} className="menu-toggle">
            <Menu className="menu-icon" />
          </button>
          <div className="logo-container">
            <img src={LOGO} alt="Xnova Logo" className="logo-image" />
          </div>
        </div>
        <div className="header-right">
          <button onClick={toggleTheme} className="theme-toggle">
            {isDark ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;