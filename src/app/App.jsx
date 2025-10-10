import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout, OwnerLayout } from './layouts';
import { useAuth } from './hooks/AuthContext/AuthContext';
import ChatBoxV2 from './components/ChatBoxV2/ChatBoxV2';
import Homepage from './pages/Home/Homepage';
import BookingPage from './pages/Booking/BookingPageV2';
import FindTeammatePage from './pages/FindTeammate/FindTeammatePage';
import ProfileSettings from './pages/Profile/ProfileSettings';
import TeamManagement from './pages/TeamManagement/TeamManagement';
import LoginRegister from './pages/LoginRegister/LoginRegister';
import ManageFields from './ownerPage/ManageFields/ManageFields';
import AddEditField from './ownerPage/AddEditField/AddEditField';
import Reports from './ownerPage/Reports/Reports';
import SettingsPage from './ownerPage/SettingsPage/SettingsPage';
import DashboardOverview from './ownerPage/DashboardOverview/DashboardOverview';
import { ThemeProvider } from './hooks/ThemeContext';
import './App.css';
import { venues } from '../mocks/venueData';
import RoleRoute from './components/RoleRoute';
import RandomWheel from './pages/Profile/Reward/Reward';

// Helper to transform venues to fields expected by ManageFields
const fields = venues.map((venue, idx) => ({
  id: venue.id,
  name: venue.name,
  location: venue.location,
  status: 'Active', // Default status, adjust as needed
  bookings: Math.floor(Math.random() * 100), // Mock bookings
  revenue: Math.floor(Math.random() * 1000000), // Mock revenue
  pricePerHour: venue.basePrice || 0,
  description: venue.description,
  image: venue.image,
  isVisible: true // Default to visible
}));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// Component để redirect owner về owner layout khi truy cập trang chủ
function OwnerRedirect() {
  const { user, isLoading } = useAuth();

  // Hiển thị loading khi đang kiểm tra user
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Chỉ redirect owner khi họ thực sự truy cập trang chủ "/"
  // Không redirect khi reload các trang khác
  if (user && (user.role === 'Owner')) {
    console.log('Redirecting owner to dashboard:', user);
    return <Navigate to="/owner/dashboard" replace />;
  }

  return <Homepage />;
}

function App() {
  const { user, isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Loading state toàn app
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Owner Layout */}
          <Route path="/owner/*" element={<RoleRoute allowedRoles={['Owner']}><OwnerLayout /></RoleRoute>}>
            <Route index element={<DashboardOverview />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="manage-fields" element={<ManageFields fields={fields} />} />
            <Route path="add-field" element={<AddEditField />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="" element={<DashboardOverview />} />
          </Route>

          {/* User Layout - Owner cũng có thể truy cập */}
          <Route element={<Layout onLoginClick={() => setIsLoginModalOpen(true)} />}>
            <Route path="/" element={<OwnerRedirect />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/team-management" element={<TeamManagement />} />
            <Route path="/find-teammates" element={<FindTeammatePage />} />
            <Route path="/randomwheel" element={<RandomWheel />} />
          </Route>

          {/* Catch-all route for unknown paths */}
          <Route path="*" element={<OwnerRedirect />} />
        </Routes>
        {isLoginModalOpen && <LoginRegister setIsLoginModalOpen={setIsLoginModalOpen} />}
      </Router>
      <ChatBoxV2 />
    </ThemeProvider>
  );
}

export default App;
