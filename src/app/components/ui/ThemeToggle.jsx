import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <div className="theme-toggle__icon">
        {theme === 'dark' ? (
          <Sun className="theme-toggle__sun" size={20} />
        ) : (
          <Moon className="theme-toggle__moon" size={20} />
        )}
      </div>
      <div className={`theme-toggle__overlay ${theme === 'dark' ? 'theme-toggle__overlay--light' : 'theme-toggle__overlay--dark'}`} />
    </button>
  );
};

export default ThemeToggle;