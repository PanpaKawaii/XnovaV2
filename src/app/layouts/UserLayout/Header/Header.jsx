import { Calendar, Menu, User, Users, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { fetchData } from "../../../../mocks/CallingAPI.js";
import LOGO from "../../../assets/LOGO.png";
import UKFlag from "../../../assets/uk.png";
import VNFlag from "../../../assets/vn.jpg";
import ThemeToggle from "../../../components/ui/ThemeToggle.jsx";
import { useAuth } from "../../../hooks/AuthContext/AuthContext.jsx";
import "./Header.css";
import UserDropdown from "./UserDropdown.jsx"; // Import component mới

const LANGUAGES = [
  { code: "vi", name: "Tiếng Việt", flag: VNFlag },
  { code: "en", name: "English", flag: UKFlag },
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!langDropdown) return;
    const handleClick = (e) => {
      if (langBtnRef.current && !langBtnRef.current.contains(e.target)) {
        setLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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
    { to: "/", icon: Zap, label: t("Home") },
    { to: "/booking", icon: Calendar, label: t("Book Field") },
    { to: "/find-teammates", icon: Users, label: t("Find Teammates") },
  ];

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <header className={`header ${isScrolled ? "header--scrolled" : ""}`}>
      <div className="container">
        <div className="wrapper">
          <Link to="/" className="logo">
            <img
              src={LOGO}
              alt="Xnova Logo"
              className="logo-img"
            />
          </Link>

          <nav className="nav">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${location.pathname === to ? "nav-link--active" : ""}`}
              >
                <Icon className="nav-icon" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="actions">
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
                className="login-btn"
              >
                <User className="login-icon" />
                <span>{t("Login")}</span>
              </button>
            )}

            <div className="lang-dropdown" ref={langBtnRef}>
              <button
                className={`lang-btn ${langDropdown ? "lang-btn--active" : ""}`}
                onClick={() => setLangDropdown((v) => !v)}
                aria-label="Change language"
              >
                <img
                  src={currentLang.flag}
                  alt={currentLang.name}
                  className="lang-flag"
                />
              </button>
              {langDropdown && (
                <div className="lang-menu">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setLangDropdown(false);
                      }}
                      disabled={i18n.language === lang.code}
                      className={`lang-item ${i18n.language === lang.code ? "lang-item--active" : ""}`}
                    >
                      <img
                        src={lang.flag}
                        alt={lang.name}
                        className="lang-item-flag"
                      />
                      <span className="lang-item-name">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mobile-btn"
          >
            {isMenuOpen ? <X className="mobile-icon" /> : <Menu className="mobile-icon" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-content">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className={`mobile-link ${location.pathname === to ? "mobile-link--active" : ""}`}
              >
                <Icon className="mobile-link-icon" />
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
                className="mobile-login"
              >
                <User className="mobile-login-icon" />
                <span>{t("Login")}</span>
              </button>
            )}

            <div className="mobile-actions">
              <ThemeToggle />
              <div className="mobile-lang" ref={langBtnRef}>
                <button
                  className={`mobile-lang-btn ${langDropdown ? "mobile-lang-btn--active" : ""}`}
                  onClick={() => setLangDropdown((v) => !v)}
                  aria-label="Change language"
                >
                  <img
                    src={currentLang.flag}
                    alt={currentLang.name}
                    className="mobile-lang-flag"
                  />
                </button>
                {langDropdown && (
                  <div className="mobile-lang-menu">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          setLangDropdown(false);
                        }}
                        disabled={i18n.language === lang.code}
                        className={`mobile-lang-item ${i18n.language === lang.code ? "mobile-lang-item--active" : ""}`}
                      >
                        <img
                          src={lang.flag}
                          alt={lang.name}
                          className="mobile-lang-item-flag"
                        />
                        <span className="mobile-lang-item-name">{lang.name}</span>
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