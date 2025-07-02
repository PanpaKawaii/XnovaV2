import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, User, Calendar, Users } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';
import LOGO from '../../asset/LOGO.png';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', icon: Zap, label: t('Home') },
    { to: '/booking', icon: Calendar, label: t('Book Field') },
    { to: '/find-teammates', icon: Users, label: t('Find Teammates') },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group h-16">
            <img
              src={LOGO}
              alt="Xnova Logo"
              className="max-h-full w-auto max-w-[96px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] dark:drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-neon-green/10 hover:text-neon-green ${
                  location.pathname === to
                    ? 'text-neon-green bg-neon-green/10'
                    : 'text-light-text-secondary dark:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Login Button & Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-2 bg-gradient-to-r from-neon-green to-lime-400 text-dark-bg px-6 py-2 rounded-full font-semibold hover:from-lime-400 hover:to-neon-green transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/25 hover:scale-105"
            >
              <User className="w-4 h-4" />
              <span>{t('Login')}</span>
            </button>
            <div className="flex items-center space-x-1 ml-2">
              <button
                onClick={() => i18n.changeLanguage('vi')}
                className={`px-2 py-1 rounded text-xs font-bold border transition-all duration-200
                  ${i18n.language === 'vi'
                    ? 'bg-neon-green text-dark-bg border-neon-green shadow-sm'
                    : 'border-gray-300 dark:border-gray-600 text-light-text-secondary dark:text-gray-300 hover:border-neon-green hover:bg-neon-green/10 hover:text-neon-green'}
                `}
                style={{ minWidth: 36 }}
              >
                VI
              </button>
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-bold border transition-all duration-200
                  ${i18n.language === 'en'
                    ? 'bg-neon-green text-dark-bg border-neon-green shadow-sm'
                    : 'border-gray-300 dark:border-gray-600 text-light-text-secondary dark:text-gray-300 hover:border-neon-green hover:bg-neon-green/10 hover:text-neon-green'}
                `}
                style={{ minWidth: 36 }}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-light-text dark:text-white hover:text-neon-green transition-colors duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 animate-slide-in">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                  location.pathname === to
                    ? 'text-neon-green bg-neon-green/10'
                    : 'text-light-text-secondary dark:text-gray-300 hover:text-neon-green hover:bg-neon-green/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                onLoginClick();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-neon-green to-lime-400 text-dark-bg px-6 py-3 rounded-lg font-semibold hover:from-lime-400 hover:to-neon-green transition-all duration-300"
            >
              <User className="w-5 h-5" />
              <span>{t('Login')}</span>
            </button>
            <div className="flex justify-center pt-2 space-x-2">
              <ThemeToggle />
              <button
                onClick={() => i18n.changeLanguage('vi')}
                className={`px-2 py-1 rounded text-xs font-bold border transition-all duration-200
                  ${i18n.language === 'vi'
                    ? 'bg-neon-green text-dark-bg border-neon-green shadow-sm'
                    : 'border-gray-300 dark:border-gray-600 text-light-text-secondary dark:text-gray-300 hover:border-neon-green hover:bg-neon-green/10 hover:text-neon-green'}
                `}
                style={{ minWidth: 36 }}
              >
                VI
              </button>
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-bold border transition-all duration-200
                  ${i18n.language === 'en'
                    ? 'bg-neon-green text-dark-bg border-neon-green shadow-sm'
                    : 'border-gray-300 dark:border-gray-600 text-light-text-secondary dark:text-gray-300 hover:border-neon-green hover:bg-neon-green/10 hover:text-neon-green'}
                `}
                style={{ minWidth: 36 }}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 