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

// Layout component that wraps authenticated pages
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
  // Retrieve the authentication status from localStorage on app load
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true' // Check if the user is authenticated
  );

  // Handle Sign-In or Sign-Up successful login
  const handleSignIn = () => {
    setIsAuthenticated(true);  
    localStorage.setItem('isAuthenticated', 'true'); // Store the authentication status
  };

  // Handle user logout
  const handleSignOut = () => {
    setIsAuthenticated(false);  
    localStorage.setItem('isAuthenticated', 'false'); // Clear the authentication status
  };

  useEffect(() => {
    // On component mount, check if the user was logged in before
    const storedAuthStatus = localStorage.getItem('isAuthenticated');
    if (storedAuthStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Pages (No Layout) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<AppOverlay onSignIn={handleSignIn} />} />
        <Route path="/sign-up" element={<AppOverlay onSignIn={handleSignIn} />} />

        {/* Protected Routes (Only Accessible If Authenticated) */}
        {isAuthenticated && (
          <>
            <Route path="/home" element={<Layout><Home /></Layout>} />
            <Route path="/scanner" element={<Layout><Scanner /></Layout>} />
            <Route path="/barcode/:barcode" element={<Layout><Barcode/></Layout>} />
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
