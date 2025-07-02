import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Chrome, Facebook, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login/signup logic here
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-light-card to-gray-100 dark:from-card-bg dark:to-gray-800 rounded-3xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 animate-slide-up relative overflow-hidden transition-colors duration-300">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-light-purple/5 rounded-full blur-2xl"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-light-text-secondary dark:text-gray-400 hover:text-light-text dark:hover:text-white transition-colors duration-300"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-neon-green/20 to-light-purple/20 rounded-2xl mb-4 border border-neon-green/30">
            <User className="w-8 h-8 text-neon-green" />
          </div>
          <h2 className="text-3xl font-bold text-light-text dark:text-white mb-2">
            {isLogin ? 'Chào mừng trở lại' : 'Tham gia Xnova'}
          </h2>
          <p className="text-light-text-secondary dark:text-gray-300">
            {isLogin ? 'Đăng nhập vào tài khoản của bạn' : 'Tạo tài khoản để bắt đầu'}
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6 relative z-10">
          <button className="w-full flex items-center justify-center space-x-3 bg-white text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300">
            <Chrome className="w-5 h-5" />
            <span>Tiếp tục với Google</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300">
            <Facebook className="w-5 h-5" />
            <span>Tiếp tục với Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6 relative z-10">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-4 text-light-text-secondary dark:text-gray-400 text-sm">hoặc</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary dark:text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-100/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl px-12 py-3 text-light-text dark:text-white placeholder-light-text-secondary dark:placeholder-gray-400 focus:border-neon-green focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-all duration-300"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary dark:text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Địa chỉ Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-gray-100/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl px-12 py-3 text-light-text dark:text-white placeholder-light-text-secondary dark:placeholder-gray-400 focus:border-neon-green focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-all duration-300"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary dark:text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-gray-100/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl px-12 pr-12 py-3 text-light-text dark:text-white placeholder-light-text-secondary dark:placeholder-gray-400 focus:border-neon-green focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-all duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-gray-400 hover:text-light-text dark:hover:text-white transition-colors duration-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary dark:text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-100/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl px-12 py-3 text-light-text dark:text-white placeholder-light-text-secondary dark:placeholder-gray-400 focus:border-neon-green focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-all duration-300"
                required={!isLogin}
              />
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-light-text-secondary dark:text-gray-300">
                <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" className="text-neon-green hover:text-lime-400 transition-colors duration-300">
                Quên mật khẩu?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-neon-green to-lime-400 text-dark-bg py-3 rounded-xl font-semibold hover:from-lime-400 hover:to-neon-green transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/25"
          >
            {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6 relative z-10">
          <span className="text-light-text-secondary dark:text-gray-300">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-light-purple hover:text-pink-400 font-semibold transition-colors duration-300"
          >
            {isLogin ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;