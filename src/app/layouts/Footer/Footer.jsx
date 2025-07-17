import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* Brand Section */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img src="src/app/assets/LOGO.png" alt="Xnova" className="footer__logo-img" />
            </Link>
            <p className="footer__description">
              Điểm đến hàng đầu cho đặt sân bóng đá và kết nối đội nhóm.
              Kết nối cầu thủ, đặt sân và tận hưởng bóng đá đỉnh cao.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link">
                <Facebook className="footer__social-icon" />
              </a>
              <a href="#" className="footer__social-link">
                <Youtube className="footer__social-icon" />
              </a>
              <a href="#" className="footer__social-link">
                <Instagram className="footer__social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__sectionlinks">
            <h3 className="footer__title">Liên kết nhanh</h3>
            <ul className="footer__links">
              <li>
                <Link to="/" className="footer__link">Trang chủ</Link>
              </li>
              <li>
                <Link to="/booking" className="footer__link">Đặt Sân</Link>
              </li>
              <li>
                <Link to="/find-teammates" className="footer__link">Tìm Đồng Đội</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer__section">
            <h3 className="footer__title">Liên hệ</h3>
            <ul className="footer__contact">
              <li className="footer__contact-item">
                <Mail className="footer__contact-icon" />
                <span>info@xnova.com</span>
              </li>
              <li className="footer__contact-item">
                <Phone className="footer__contact-icon" />
                <span>+84 123 456 789</span>
              </li>
              <li className="footer__contact-item">
                <MapPin className="footer__contact-icon" />
                <span>Thành phố Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Download Section */}
        <div className="footer__download">
          <p className="footer__download-text">Tải ứng dụng Xnova</p>
          <div className="footer__download-buttons">
            <a href="#" className="footer__download-link">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/vi_badge_web_generic.png" alt="Get it on Google Play" className="footer__download-badge" />
            </a>
            <a href="#" className="footer__download-link">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="footer__download-badge" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Xnova. All rights reserved.
          </p>
          <div className="footer__legal">
            <a href="#" className="footer__legal-link">Chính sách bảo mật</a>
            <a href="#" className="footer__legal-link">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;