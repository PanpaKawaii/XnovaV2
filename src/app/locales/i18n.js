import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      Home: 'Home',
      'Book Field': 'Book Field',
      'Find Teammates': 'Find Teammates',
      Login: 'Login',
    },
  },
  vi: {
    translation: {
      Home: 'Trang chủ',
      'Book Field': 'Đặt sân',
      'Find Teammates': 'Tìm đồng đội',
      Login: 'Đăng nhập',
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
