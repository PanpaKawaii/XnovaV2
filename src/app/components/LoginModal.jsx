import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Chrome, Facebook, User } from 'lucide-react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login/signup logic here
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-modal">
      <div className="login-modal__content">
        {/* Background Pattern */}
        <div className="login-modal__bg-pattern-1"></div>
        <div className="login-modal__bg-pattern-2"></div>
        
        {/* Close Button */}
        <button onClick={onClose} className="login-modal__close">
          <X size={24} />
        </button>

        {/* Header */}
        <div className="login-modal__header">
          <div className="login-modal__icon">
            <User size={32} />
          </div>
          <h2 className="login-modal__title">
            {isLogin ? 'Chào mừng trở lại' : 'Tham gia Xnova'}
          </h2>
          <p className="login-modal__subtitle">
            {isLogin ? 'Đăng nhập vào tài khoản của bạn' : 'Tạo tài khoản để bắt đầu'}
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="login-modal__oauth">
          <button className="login-modal__oauth-button login-modal__oauth-button--google">
            <Chrome size={20} />
            <span>Tiếp tục với Google</span>
          </button>
          <button className="login-modal__oauth-button login-modal__oauth-button--facebook">
            <Facebook size={20} />
            <span>Tiếp tục với Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="login-modal__divider">
          <div className="login-modal__divider-line"></div>
          <span className="login-modal__divider-text">hoặc</span>
          <div className="login-modal__divider-line"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-modal__form">
          {!isLogin && (
            <div className="login-modal__input-group">
              <User size={20} className="login-modal__input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleInputChange}
                className="login-modal__input"
                required={!isLogin}
              />
            </div>
          )}

          <div className="login-modal__input-group">
            <Mail size={20} className="login-modal__input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Địa chỉ Email"
              value={formData.email}
              onChange={handleInputChange}
              className="login-modal__input"
              required
            />
          </div>

          <div className="login-modal__input-group">
            <Lock size={20} className="login-modal__input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              className="login-modal__input"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="login-modal__password-toggle"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {!isLogin && (
            <div className="login-modal__input-group">
              <Lock size={20} className="login-modal__input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="login-modal__input"
                required={!isLogin}
              />
            </div>
          )}

          {isLogin && (
            <div className="login-modal__options">
              <label className="login-modal__remember">
                <input type="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" className="login-modal__forgot">
                Quên mật khẩu?
              </button>
            </div>
          )}

          <button type="submit" className="login-modal__submit">
            {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
          </button>
        </form>

        {/* Toggle */}
        <div className="login-modal__toggle">
          <span className="login-modal__toggle-text">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="login-modal__toggle-button"
          >
            {isLogin ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
