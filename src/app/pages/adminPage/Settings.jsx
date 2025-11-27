import React, { useState, useEffect } from 'react';
import { Sun, Moon, User, Bell, Shield, HelpCircle } from 'lucide-react';
import { Button } from '../../components/admincomponents/UI/Button';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/AuthContext/AuthContext';
import { fetchData, patchData } from '../../../mocks/CallingAPI';
import { AlertModal } from '../../components/ui/AlertModal';
import './Settings.css';

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  // User info state
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [originalUserInfo, setOriginalUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Notification settings state
  const [notifications, setNotifications] = useState({
    newBooking: true,
    payment: true,
    weeklyReport: false
  });
  
  // Alert modal state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Load user info from API
  useEffect(() => {
    const loadUserInfo = async () => {
      if (!user?.token || !user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        const userData = await fetchData(`User/${user.id}`, user.token);
        const info = {
          name: userData?.name || userData?.fullName || userData?.username || '',
          email: userData?.email || '',
          phone: userData?.phone || userData?.phoneNumber || ''
        };
        setUserInfo(info);
        setOriginalUserInfo(info);
      } catch (err) {
        console.error('Error loading user info:', err);
        setAlertMessage('Không thể tải thông tin tài khoản');
        setShowAlertModal(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserInfo();
  }, [user]);

  const handleUserInfoChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateUserInfo = async () => {
    if (!user?.token || !user?.id || !originalUserInfo) return;
    
    setSaving(true);
    
    try {
      // Build payload with only changed fields
      const changedFields = {};
      
      if (userInfo.name !== originalUserInfo.name) {
        changedFields.name = userInfo.name;
      }
      
      if (userInfo.phone !== originalUserInfo.phone) {
        changedFields.phoneNumber = userInfo.phone;
      }
      
      // Update only if there are changes
      if (Object.keys(changedFields).length > 0) {
        // Fetch current user data to get required fields
        const currentUser = await fetchData(`User/${user.id}`, user.token);
        
        // Build complete payload with all required fields
        const userPayload = {
          id: currentUser.id || user.id,
          name: changedFields.name || currentUser.name || '',
          email: currentUser.email || userInfo.email || '',
          password: currentUser.password || '',
          image: currentUser.image || '',
          role: currentUser.role || 'admin',
          description: currentUser.description || '',
          phoneNumber: changedFields.phoneNumber || currentUser.phoneNumber || currentUser.phone || '',
          point: currentUser.point || 0,
          type: currentUser.type || 'admin',
          status: currentUser.status || 1
        };
        
        await patchData(`User/${user.id}`, userPayload, user.token);
        
        setOriginalUserInfo(userInfo);
        setAlertMessage('Cập nhật thông tin thành công!');
      } else {
        setAlertMessage('Không có thay đổi nào để cập nhật.');
      }
      
      setShowAlertModal(true);
    } catch (err) {
      console.error('Error updating user info:', err);
      setAlertMessage('Lỗi cập nhật thông tin: ' + (err.message || 'Vui lòng thử lại'));
      setShowAlertModal(true);
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // Save to localStorage
    const updatedNotifications = {
      ...notifications,
      [key]: !notifications[key]
    };
    localStorage.setItem('adminNotificationSettings', JSON.stringify(updatedNotifications));
  };

  // Load notification settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminNotificationSettings');
    if (savedSettings) {
      try {
        setNotifications(JSON.parse(savedSettings));
      } catch (err) {
        console.error('Error loading notification settings:', err);
      }
    }
  }, []);

  return (
    <div className="ad-settings-page">
      {loading && (
        <div className="ad-owner-page__loading">Đang tải dữ liệu...</div>
      )}
      
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
                value={userInfo.name}
                onChange={(e) => handleUserInfoChange('name', e.target.value)}
                className="ad-settings-input-group__input"
                disabled={loading}
              />
            </div>
            <div className="ad-settings-input-group">
              <label className="ad-settings-input-group__label">
                Email
              </label>
              <input
                type="email"
                value={userInfo.email}
                className="ad-settings-input-group__input"
                readOnly
                disabled
                style={{ cursor: 'not-allowed', backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div className="ad-settings-input-group">
              <label className="ad-settings-input-group__label">
                Số điện thoại
              </label>
              <input
                type="text"
                value={userInfo.phone}
                onChange={(e) => handleUserInfoChange('phone', e.target.value)}
                className="ad-settings-input-group__input"
                disabled={loading}
              />
            </div>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleUpdateUserInfo}
              disabled={loading || saving}
            >
              {saving ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
            </Button>
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
                <input 
                  type="checkbox" 
                  className="ad-settings-toggle__input" 
                  checked={notifications.newBooking}
                  onChange={() => handleNotificationToggle('newBooking')}
                />
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
                <input 
                  type="checkbox" 
                  className="ad-settings-toggle__input" 
                  checked={notifications.payment}
                  onChange={() => handleNotificationToggle('payment')}
                />
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
                <input 
                  type="checkbox" 
                  className="ad-settings-toggle__input"
                  checked={notifications.weeklyReport}
                  onChange={() => handleNotificationToggle('weeklyReport')}
                />
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

      <AlertModal
        isOpen={showAlertModal}
        message={alertMessage}
        onClose={() => setShowAlertModal(false)}
      />
    </div>
  );
};
