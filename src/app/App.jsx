import { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { venues } from "../mocks/venueData";
import ChatBoxV2 from "./components/ChatBoxV2/ChatBoxV2";
import LoadingAnimation from "./components/LoadingAnimation/LoadingAnimation.jsx";
import PaymentStatus from "./components/Payment/PaymentStatus";
import RoleRoute from "./components/RoleRoute";
import { useAuth } from "./hooks/AuthContext/AuthContext";
import { ThemeProvider } from "./hooks/ThemeContext";
import { AdminLayout, Layout, OwnerLayout } from "./layouts";
import { Dashboard } from "./pages/adminPage/AdminDashboard/Dashboard";
import { BookingManagement } from "./pages/adminPage/BookingManagement/BookingManagement";
import { FieldManagement } from "./pages/adminPage/FieldManagement.jsx";
import { FieldOwnerManagement } from "./pages/adminPage/FieldOwnerManagement.jsx";
import { RevenueAnalytics } from "./pages/adminPage/RevenueAnalytics.jsx";
import { Settings } from "./pages/adminPage/Settings.jsx";
import { UserManagement } from "./pages/adminPage/UserManagement.jsx";
import AddEditField from "./pages/ownerPage/AddEditField/AddEditField";
import DashboardOverview from "./pages/ownerPage/DashboardOverview/DashboardOverview";
import ManageFields from "./pages/ownerPage/ManageFields/ManageFields";
import Reports from "./pages/ownerPage/Reports/Reports";
import SettingsPage from "./pages/ownerPage/SettingsPage/SettingsPage";
import BookingPage from "./pages/userPage/Booking/BookingPageV2";
import FindTeammatePage from "./pages/userPage/FindTeammate/FindTeammatePage";
import Homepage from "./pages/userPage/Home/Homepage";
import LoginRegister from "./pages/userPage/LoginRegister/LoginRegister";
import ProfileSettings from "./pages/userPage/Profile/ProfileSettings";
import Reward from "./pages/userPage/Profile/Reward/Reward";
import TeamManagement from "./pages/userPage/TeamManagement/TeamManagement";

import "./App.css";

// Helper to transform venues to fields expected by ManageFields
const fields = venues.map((venue, idx) => ({
  id: venue.id,
  name: venue.name,
  location: venue.location,
  status: "Active", // Default status, adjust as needed
  bookings: Math.floor(Math.random() * 100), // Mock bookings
  revenue: Math.floor(Math.random() * 1000000), // Mock revenue
  pricePerHour: venue.basePrice || 0,
  description: venue.description,
  image: venue.image,
  isVisible: true, // Default to visible
}));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// Component để redirect owner/admin về dashboard tương ứng khi truy cập trang chủ
function OwnerRedirect() {
  const { user, isLoading } = useAuth();

  // Hiển thị loading khi đang kiểm tra user
  if (isLoading) return <LoadingAnimation />

  // Redirect dựa trên role của user
  if (user) {
    if (user.role === "Admin") {
      console.log("Redirecting admin to dashboard:", user);
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === "Owner") {
      console.log("Redirecting owner to dashboard:", user);
      return <Navigate to="/owner/dashboard" replace />;
    }
  }

  return <Homepage />;
}

function App() {
  const { isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Loading state toàn app
  if (isLoading) return <LoadingAnimation />

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin Layout*/}
          <Route path="/admin/*" element={<RoleRoute allowedRoles={["Admin"]}><AdminLayout /></RoleRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="" element={<Dashboard />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="fieldOwners" element={<FieldOwnerManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="fields" element={<FieldManagement />} />
            <Route path="revenue" element={<RevenueAnalytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Owner Layout */}
          <Route path="/owner/*" element={<RoleRoute allowedRoles={["Owner"]}><OwnerLayout /></RoleRoute>}>
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
            <Route path="/reward" element={<Reward />} />
            <Route path="/payment-status/?" element={<PaymentStatus />} />
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
