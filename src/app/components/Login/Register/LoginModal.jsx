import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, Eye, EyeOff, Chrome, Facebook, User, Clock, Send } from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import { useAuth } from '../../../hooks/AuthContext/AuthContext.jsx'; 
import { postData } from '../../../../mocks/CallingAPI.js';
import './LoginModal.css';
import LogoImage from '../../../assets/LOGO.png';

const LoginModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ value: '', name: '' });
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: '',
    twoFactorRecoveryCode: '',
    confirmPassword: '',
    name: '',
    phone: '',
    otp: '',
  });

  // useEffect(() => {
  //   if (!isOpen) return;
  //   let timer;
  //   if (countdown > 0) {
  //     timer = setTimeout(() => setCountdown(countdown - 1), 1000);
  //   }
  //   return () => clearTimeout(timer);
  // }, [countdown, isOpen]);

  // if (!isOpen) return null;

  const sendOtp = async () => {
    const { email, name, phone, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setError({ value: 'Mật khẩu không khớp!', name: 'Confirm' });
      return;
    }
    const registerData = {
      name,
      email,
      password,
      image: 'https://i.pinimg.com/736x/b0/91/5f/b0915f3c86472ea1ad3d1472cebd6c15.jpg',
      role: 'Customer',
      description: '',
      phoneNumber: phone,
      point: 0,
      type: 'Regular',
    };
    try {
      setLoading(true);
      await postData('User/register-request', registerData, '');
      setSuccess('Gửi OTP thành công!');
      setError({ value: '', name: '' });
      setOtpSent(true);
      setCountdown(60);
      setShowOtpStep(true);
    } catch (error) {
      setError({ value: 'Gửi OTP thất bại', name: 'Email or OTP' });
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const { email, otp } = formData;
    const checkOtp = { email, otp };
    try {
      setLoading(true);
      await postData('User/register-confirm', checkOtp, '');
      setSuccess('Đăng ký thành công!');
      setError({ value: '', name: '' });
      // onClose();
    } catch (error) {
      setError({ value: 'Đăng ký thất bại', name: 'Email or OTP' });
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const { email, password } = formData;
    if (!email) {
      setError({ value: 'Email không hợp lệ', name: 'Email' });
      return;
    }
    if (!password) {
      setError({ value: 'Mật khẩu không hợp lệ', name: 'Password' });
      return;
    }
    const loginData = {
      email,
      password,
      twoFactorCode: '',
      twoFactorRecoveryCode: '',
    };
    try {
      setLoading(true);
      const result = await postData('Login/authenticate', loginData, '');
      console.log('Login result:', result);
      login(result); 
      setSuccess('Đăng nhập thành công!');
      setError({ value: '', name: '' });
      // Role-based navigation
      if (result.role === 'Customer') {
        // onClose(); // Không chuyển hướng, đóng modal
      } else if (result.role === 'Owner' || result.role === 'Admin') {
        navigate('/'); // Chuyển hướng đến trang chính
        // onClose();
      }
    } catch (error) {
      setError({ value: 'Đăng nhập thất bại', name: 'Email or Password' });
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ value: '', name: '' });
    setSuccess('');
    if (isLogin) {
      await handleLogin();
    } else {
      if (!showOtpStep) {
        await sendOtp();
      } else {
        await verifyOtp();
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      otp: '',
    });
    setShowOtpStep(false);
    setOtpSent(false);
    setCountdown(0);
    setError({ value: '', name: '' });
    setSuccess('');
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="login-modal">
      <div className="login-modal__content">
        <div className="login-modal__bg-pattern-1"></div>
        <div className="login-modal__bg-pattern-2"></div>
        <button onClick={onClose} className="login-modal__close">
          <X size={24} />
        </button>
        <div className="login-modal__header">
          <div className="login-modal__icon">
            <img src={LogoImage} alt="XNOVA Logo" className="login-modal__logo" />
          </div>
          <h2 className="login-modal__title">
            {isLogin ? 'Chào mừng trở lại' : (showOtpStep ? 'Xác thực Email' : 'Tham gia Xnova')}
          </h2>
          <p className="login-modal__subtitle">
            {isLogin ? 'Đăng nhập vào tài khoản của bạn' : (showOtpStep ? `Mã xác thực đã được gửi đến ${formData.email}` : 'Tạo tài khoản để bắt đầu')}
          </p>
        </div>
        {(isLogin || !showOtpStep) && (
          <>
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
            <div className="login-modal__divider">
              <div className="login-modal__divider-line"></div>
              <span className="login-modal__divider-text">hoặc</span>
              <div className="login-modal__divider-line"></div>
            </div>
          </>
        )}
        <form onSubmit={handleSubmit} className="login-modal__form">
          {!isLogin && showOtpStep ? (
            <>
              <div className="login-modal__otp-info">
                <Clock size={20} className="login-modal__otp-icon" />
                <p className="login-modal__otp-text">
                  Nhập mã xác thực 6 chữ số được gửi đến email của bạn
                </p>
              </div>
              <div className="login-modal__input-group">
                <Mail size={20} className="login-modal__input-icon" />
                <input
                  type="text"
                  name="otp"
                  placeholder="Nhập mã OTP"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="login-modal__input login-modal__input--otp"
                  maxLength="6"
                  required
                />
              </div>
              <div className="login-modal__otp-actions">
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={countdown > 0 || loading}
                  className="login-modal__resend-otp"
                >
                  <Send size={16} />
                  {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOtpStep(false)}
                  className="login-modal__back-button"
                >
                  Quay lại
                </button>
              </div>
            </>
          ) : (
            <>
              {!isLogin && (
                <>
                  <div className="login-modal__input-group">
                    <User size={20} className="login-modal__input-icon" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Họ và tên"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="login-modal__input"
                      style={{ border: error.name.includes('Name') && '1px solid #dc3545' }}
                      required
                    />
                  </div>
                  <div className="login-modal__input-group">
                    <User size={20} className="login-modal__input-icon" />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Số điện thoại"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="login-modal__input"
                      style={{ border: error.name.includes('Phone') && '1px solid #dc3545' }}
                      required
                    />
                  </div>
                </>
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
                  style={{ border: error.name.includes('Email') && '1px solid #dc3545' }}
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
                  style={{ border: error.name.includes('Password') && '1px solid #dc3545' }}
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
                    style={{ border: error.name.includes('Confirm') && '1px solid #dc3545' }}
                    required
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
            </>
          )}
          {error.value && <div className="message error-message">{error.value}</div>}
          {success && <div className="message success-message">{success}</div>}
          <button type="submit" className="login-modal__submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng Nhập' : (showOtpStep ? 'Xác Thực OTP' : 'Tiếp Tục')}
          </button>
        </form>
        {!showOtpStep && (
          <div className="login-modal__toggle">
            <span className="login-modal__toggle-text">
              {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            </span>
            <button onClick={handleToggle} className="login-modal__toggle-button">
              {isLogin ? 'Đăng ký' : 'Đăng nhập'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;