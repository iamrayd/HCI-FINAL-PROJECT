import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AppOverlay from './AppOverlay'; 
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import DietaryProfile from './components/DietaryProfile';
import HealthyTips from './components/HealthyTips';
import ScanHistory from './components/ScanHistory';
import Favorites from './components/Favorites';
import Scanner from './components/Scanner';
import Barcode from './components/Barcode';
import './styles/layout.css'; 

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [username, setUsername] = useState(localStorage.getItem('username')); 

  const handleSignIn = (userId) => {
    setIsAuthenticated(true);
    setUsername(username);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', userId); // Store userId in localStorage
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('userId'); 
  };

  useEffect(() => {
    const storedAuthStatus = localStorage.getItem('isAuthenticated');
    const storedUserId = localStorage.getItem('username');
    if (storedAuthStatus === 'true' && storedUserId) {
      setIsAuthenticated(true);
      setUsername(storedUserId);
    }
  }, []);

  return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<AppOverlay onSignIn={handleSignIn} />} />
          <Route path="/sign-up" element={<AppOverlay onSignIn={handleSignIn} />} />
          {isAuthenticated && (
            <>
              <Route path="/home" element={<Layout><Home /></Layout>} />
              <Route path="/scanner" element={<Layout><Scanner /></Layout>} />
              <Route path="/barcode/:barcode" element={<Layout><Barcode /></Layout>} />
              <Route path="/dietaryprofile" element={<Layout><DietaryProfile /></Layout>} />
              <Route path="/healthytips" element={<Layout><HealthyTips /></Layout>} />
              <Route path="/scanhistory" element={<Layout><ScanHistory /></Layout>} />
              <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
            </>
          )}
        </Routes>
      </Router>
  );
};

export default App;
