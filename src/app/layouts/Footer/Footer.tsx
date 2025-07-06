import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light-card dark:bg-card-bg border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 group mb-4">
              <div className="relative">
                <Zap className="w-8 h-8 text-neon-green group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-neon-green/30 blur-lg rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold text-light-text dark:text-white group-hover:text-neon-green transition-colors duration-300">
                Xnova
              </span>
            </Link>
            <p className="text-light-text-secondary dark:text-gray-300 mb-6 max-w-md">
              Điểm đến hàng đầu cho đặt sân bóng đá và kết nối đội nhóm.
              Kết nối cầu thủ, đặt sân và tận hưởng bóng đá đỉnh cao.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-light-text-secondary dark:text-gray-300 hover:text-neon-green transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-light-text-secondary dark:text-gray-300 hover:text-neon-green transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-light-text-secondary dark:text-gray-300 hover:text-neon-green transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-light-text dark:text-white mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-light-text-secondary dark:text-gray-300 hover:text-neon-green transition-colors duration-300">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-light-text-secondary dark:text-gray-300 hover:text-neon-green transition-colors duration-300">
                  Đặt Sân
                </Link>
              </li>
              <li>
                <Link to="/find-teammates" className="text-light-text-secondary dark:text-gray-300 hover:text-neon-green transition-colors duration-300">
                  Tìm Đồng Đội
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-light-text dark:text-white mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-light-text-secondary dark:text-gray-300">
                <Mail className="w-4 h-4 text-neon-green" />
                <span>info@xnova.com</span>
              </li>
              <li className="flex items-center space-x-2 text-light-text-secondary dark:text-gray-300">
                <Phone className="w-4 h-4 text-neon-green" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2 text-light-text-secondary dark:text-gray-300">
                <MapPin className="w-4 h-4 text-neon-green" />
                <span>Thành phố Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-light-text-secondary dark:text-gray-300 text-sm">
            © {currentYear} Xnova. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-light-text-secondary dark:text-gray-300 hover:text-neon-green transition-colors duration-300 text-sm">
              Chính sách bảo mật
            </a>
            <a href="#" className="text-light-text-secondary dark:text-gray-300 hover:text-neon-green transition-colors duration-300 text-sm">
              Điều khoản sử dụng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 