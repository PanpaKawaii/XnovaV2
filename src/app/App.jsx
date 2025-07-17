import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts';
import { useAuth } from './hooks/AuthContext/AuthContext';
import ChatBox from './components/ChatBox/ChatBox';
import Homepage from './pages/Home/Homepage';
import BookingPage from './pages/Booking/BookingPageV2';
import FindTeammatePage from './pages/FindTeammate/FindTeammatePage';
// import ProfileSettings from './pages/Profile/ProfileSettings';
import LoginModal from './components/Login/Register/LoginModal';
import LoginRegister from './pages/LoginRegister/LoginRegister';
import { ThemeProvider } from './hooks/ThemeContext';
import './App.css';

function App() {
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        <Layout onLoginClick={() => setIsLoginModalOpen(true)}>
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/booking' element={<BookingPage />} />
            <Route path='/find-teammates' element={<FindTeammatePage />} />
            <Route path='/oldlogin' element={<LoginModal />} />
          </Routes>
        </Layout>
        {isLoginModalOpen && <LoginRegister setIsLoginModalOpen={setIsLoginModalOpen} />}
      </Router>
      <ChatBox />
    </ThemeProvider>
  );
}

export default App;
