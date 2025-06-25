import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import BookingPage from './pages/BookingPage';
import FindTeammatePage from './pages/FindTeammatePage';
import LoginModal from './components/LoginModal';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-card-bg font-body">
        <Navbar onLoginClick={() => setIsLoginModalOpen(true)} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/find-teammates" element={<FindTeammatePage />} />
        </Routes>
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      </div>
    </Router>
  );
}

export default App;