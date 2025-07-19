import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, User, Calendar, Users } from 'lucide-react';
import ThemeToggle from '../../../components/ui/ThemeToggle.jsx';
import LOGO from "../../../assets/LOGO.png";
import VNFlag from '../../../assets/vn.jpg';
import UKFlag from '../../../assets/uk.png';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../hooks/AuthContext/AuthContext.jsx';
import { fetchData } from '../../../../mocks/CallingAPI.js';
import UserDropdown from './UserDropdown.jsx'; // Import component mới
import './Header.css';

const LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', flag: VNFlag },
  { code: 'en', name: 'English', flag: UKFlag },
];

const Header = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const langBtnRef = useRef(null);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!langDropdown) return;
    const handleClick = (e) => {
      if (langBtnRef.current && !langBtnRef.current.contains(e.target)) {
        setLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [langDropdown]);

  useEffect(() => {
    const token = user?.token;
    if (!user || !token) {
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const userData = await fetchData(`User/${user.id}`, token);
        setUserInfo(userData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    
    fetchUserInfo();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { to: '/', icon: Zap, label: t('Home') },
    { to: '/booking', icon: Calendar, label: t('Book Field') },
    { to: '/find-teammates', icon: Users, label: t('Find Teammates') },
  ];

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <div className="header__wrapper">
          <Link to="/" className="header__logo">
            <img
              src={LOGO}
              alt="Xnova Logo"
              className="header__logo-img"
            />
          </Link>

          <nav className="header__nav">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`header__nav-link ${location.pathname === to ? 'header__nav-link--active' : ''}`}
              >
                <Icon className="header__nav-icon" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="header__actions">
            <ThemeToggle />
            
            {user ? (
              <UserDropdown
                user={user}
                userInfo={userInfo}
                handleLogout={handleLogout}
                t={t}
                isMobile={false} // Cho desktop
              />
            ) : (
              <button
                onClick={onLoginClick}
                className="header__login-btn"
              >
                <User className="header__login-icon" />
                <span>{t('Login')}</span>
              </button>
            )}
            
            <div className="header__lang-dropdown" ref={langBtnRef}>
              <button
                className={`header__lang-btn ${langDropdown ? 'header__lang-btn--active' : ''}`}
                onClick={() => setLangDropdown((v) => !v)}
                aria-label="Change language"
              >
                <img 
                  src={currentLang.flag} 
                  alt={currentLang.name} 
                  className="header__lang-flag" 
                />
              </button>
              {langDropdown && (
                <div className="header__lang-menu">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setLangDropdown(false);
                      }}
                      disabled={i18n.language === lang.code}
                      className={`header__lang-item ${i18n.language === lang.code ? 'header__lang-item--active' : ''}`}
                    >
                      <img 
                        src={lang.flag} 
                        alt={lang.name} 
                        className="header__lang-item-flag" 
                      />
                      <span className="header__lang-item-name">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="header__mobile-btn"
          >
            {isMenuOpen ? <X className="header__mobile-icon" /> : <Menu className="header__mobile-icon" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="header__mobile-menu">
          <div className="header__mobile-content">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className={`header__mobile-link ${location.pathname === to ? 'header__mobile-link--active' : ''}`}
              >
                <Icon className="header__mobile-link-icon" />
                <span>{label}</span>
              </Link>
            ))}
            
            {user ? (
              <UserDropdown
                user={user}
                userInfo={userInfo}
                handleLogout={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                t={t}
                isMobile={true} // Cho mobile
              />
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setIsMenuOpen(false);
                }}
                className="header__mobile-login"
              >
                <User className="header__mobile-login-icon" />
                <span>{t('Login')}</span>
              </button>
            )}
            
            <div className="header__mobile-actions">
              <ThemeToggle />
              <div className="header__mobile-lang" ref={langBtnRef}>
                <button
                  className={`header__mobile-lang-btn ${langDropdown ? 'header__mobile-lang-btn--active' : ''}`}
                  onClick={() => setLangDropdown((v) => !v)}
                  aria-label="Change language"
                >
                  <img 
                    src={currentLang.flag} 
                    alt={currentLang.name} 
                    className="header__mobile-lang-flag" 
                  />
                </button>
                {langDropdown && (
                  <div className="header__mobile-lang-menu">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          setLangDropdown(false);
                        }}
                        disabled={i18n.language === lang.code}
                        className={`header__mobile-lang-item ${i18n.language === lang.code ? 'header__mobile-lang-item--active' : ''}`}
                      >
                        <img 
                          src={lang.flag} 
                          alt={lang.name} 
                          className="header__mobile-lang-item-flag" 
                        />
                        <span className="header__mobile-lang-item-name">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;