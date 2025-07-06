import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts';
import Homepage from './pages/Homepage';
import BookingPage from './pages/BookingPageV2';
import FindTeammatePage from './pages/FindTeammatePage';
import LoginModal from './components/LoginModal';
import { ThemeProvider } from './hooks/ThemeContext';
import './App.css';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        <Layout onLoginClick={() => setIsLoginModalOpen(true)}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/find-teammates" element={<FindTeammatePage />} />
          </Routes>
        </Layout>
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
