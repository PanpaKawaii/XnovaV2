import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      Home: 'Home',
      'Book Field': 'Book Field',
      'Find Teammates': 'Find Teammates',
      Login: 'Login',
      'Profile Settings': 'Profile Settings',
      Logout: 'Logout',
    },
  },
  vi: {
    translation: {
      Home: 'Trang chủ',
      'Book Field': 'Đặt sân',
      'Find Teammates': 'Tìm đồng đội',
      Login: 'Đăng nhập',
      'Profile Settings': 'Cài đặt hồ sơ',
      Logout: 'Đăng xuất',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
