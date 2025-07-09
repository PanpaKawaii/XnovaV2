import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './app/hooks/AuthContext/AuthContext';
import App from './app/App.jsx';
import './index.css';
import './app/locales/i18n.js';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  );
}
