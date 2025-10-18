import React from 'react';
import { Sun, Moon, User, Bell, Shield, HelpCircle } from 'lucide-react';
import { Button } from '../../components/admincomponents/UI/Button';
import { useTheme } from '../../hooks/useTheme';
import './Settings.css';

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="ad-settings-page">
      {/* Header */}
      <h1 className="ad-settings-page__title">
        Cài đặt
      </h1>

      <div className="ad-settings-page__grid">
        {/* Account Settings */}
        <div className="ad-settings-section">
          <div className="ad-settings-section__header">
            <User className="ad-settings-section__icon" />
            <h2 className="ad-settings-section__title">
              Thông tin tài khoản
            </h2>
          </div>
          
          <div className="ad-settings-section__content">
            <div className="ad-settings-input-group">
              <label className="ad-settings-input-group__label">
                Tên hiển thị
              </label>
              <input
                type="text"
                defaultValue="Admin User"
                className="ad-settings-input-group__input"
              />
            </div>
            <div className="ad-settings-input-group">
              <label className="ad-settings-input-group__label">
                Email
              </label>
              <input
                type="email"
                defaultValue="admin@sportfield.com"
                className="ad-settings-input-group__input"
              />
            </div>
            <Button variant="primary" size="sm">
              Cập nhật thông tin
            </Button>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="ad-settings-section">
          <div className="ad-settings-section__header">
            <Sun className="ad-settings-section__icon" />
            <h2 className="ad-settings-section__title">
              Giao diện
            </h2>
          </div>
          
          <div className="ad-settings-section__content">
            <div className="ad-settings-option">
              <div className="ad-settings-option__info">
                <p className="ad-settings-option__title">Chế độ hiển thị</p>
                <p className="ad-settings-option__description">
                  Chuyển đổi giữa chế độ sáng và tối
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleTheme}
                icon={theme === 'light' ? Moon : Sun}
              >
                {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
              </Button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="ad-settings-section">
          <div className="ad-settings-section__header">
            <Bell className="ad-settings-section__icon" />
            <h2 className="ad-settings-section__title">
              Thông báo
            </h2>
          </div>
          
          <div className="ad-settings-section__content">
            <div className="ad-settings-toggle">
              <div className="ad-settings-toggle__info">
                <p className="ad-settings-toggle__title">Đặt sân mới</p>
                <p className="ad-settings-toggle__description">
                  Nhận thông báo khi có đặt sân mới
                </p>
              </div>
              <label className="ad-settings-toggle__switch">
                <input type="checkbox" className="ad-settings-toggle__input" defaultChecked />
                <span className="ad-settings-toggle__slider"></span>
              </label>
            </div>
            
            <div className="ad-settings-toggle">
              <div className="ad-settings-toggle__info">
                <p className="ad-settings-toggle__title">Thanh toán</p>
                <p className="ad-settings-toggle__description">
                  Nhận thông báo về trạng thái thanh toán
                </p>
              </div>
              <label className="ad-settings-toggle__switch">
                <input type="checkbox" className="ad-settings-toggle__input" defaultChecked />
                <span className="ad-settings-toggle__slider"></span>
              </label>
            </div>
            
            <div className="ad-settings-toggle">
              <div className="ad-settings-toggle__info">
                <p className="ad-settings-toggle__title">Báo cáo hàng tuần</p>
                <p className="ad-settings-toggle__description">
                  Nhận báo cáo tổng kết hàng tuần
                </p>
              </div>
              <label className="ad-settings-toggle__switch">
                <input type="checkbox" className="ad-settings-toggle__input" />
                <span className="ad-settings-toggle__slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="ad-settings-section">
          <div className="ad-settings-section__header">
            <Shield className="ad-settings-section__icon" />
            <h2 className="ad-settings-section__title">
              Bảo mật
            </h2>
          </div>
          
          <div className="ad-settings-section__content">
            <Button variant="secondary" size="sm" className="ad-settings-button--full">
              Đổi mật khẩu
            </Button>
            <Button variant="secondary" size="sm" className="ad-settings-button--full">
              Thiết lập xác thực 2 bước
            </Button>
            <Button variant="secondary" size="sm" className="ad-settings-button--full">
              Xem lịch sử đăng nhập
            </Button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="ad-settings-section ad-settings-section--wide">
          <div className="ad-settings-section__header">
            <HelpCircle className="ad-settings-section__icon" />
            <h2 className="ad-settings-section__title">
              Hỗ trợ & Trợ giúp
            </h2>
          </div>
          
          <div className="ad-settings-section__content">
            <div className="ad-settings-help-buttons">
              <Button variant="secondary" size="sm" className="ad-settings-button--full">
                Tài liệu hướng dẫn
              </Button>
              <Button variant="secondary" size="sm" className="ad-settings-button--full">
                Liên hệ hỗ trợ
              </Button>
              <Button variant="secondary" size="sm" className="ad-settings-button--full">
                Báo cáo lỗi
              </Button>
            </div>
            
            <div className="ad-settings-info-box">
              <p className="ad-settings-info-box__text">
                <strong>Phiên bản:</strong> SportAdmin v1.0.0<br />
                <strong>Cập nhật gần nhất:</strong> 15/12/2024<br />
                <strong>Hỗ trợ:</strong> admin@sportfield.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
