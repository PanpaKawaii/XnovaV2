import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './layouts';
import { useAuth } from './hooks/AuthContext/AuthContext';
import ChatBox from './components/ChatBox/ChatBox';
import Homepage from './pages/Home/Homepage';
import BookingPage from './pages/Booking/BookingPageV2';
import FindTeammatePage from './pages/FindTeammate/FindTeammatePage';
import ProfileSettings from './pages/Profile/ProfileSettings';
import TeamManagement from './pages/TeamManagement/TeamManagement';
import LoginModal from './components/Login/Register/LoginModal';
import LoginRegister from './pages/LoginRegister/LoginRegister';
import ManageFields from './ownerPage/ManageFields/ManageFields';
import AddEditField from './ownerPage/AddEditField/AddEditField';
import Reports from './ownerPage/Reports/Reports';
import SettingsPage from './ownerPage/SettingsPage/SettingsPage';
import DashboardOverview from './ownerPage/DashboardOverview/DashboardOverview';
import { ThemeProvider } from './hooks/ThemeContext';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function App() {
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Layout onLoginClick={() => setIsLoginModalOpen(true)}>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Homepage />} />
            
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/team-management" element={<TeamManagement />} />
            <Route path="/find-teammates" element={<FindTeammatePage />} />
            {/* Owner Routes */}
            <Route path="/owner" element={<DashboardOverview />} />
            <Route path="/owner/dashboard" element={<DashboardOverview />} />
            <Route path="/owner/manage-fields" element={<ManageFields />} />
            <Route path="/owner/add-field" element={<AddEditField />} />
            <Route path="/owner/reports" element={<Reports />} />
            <Route path="/owner/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
        {isLoginModalOpen && <LoginRegister setIsLoginModalOpen={setIsLoginModalOpen} />}
      </Router>
      <ChatBox />
    </ThemeProvider>
  );
}

export default App;
