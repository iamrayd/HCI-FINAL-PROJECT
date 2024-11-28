import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AppOverlay from './AppOverlay'; // This contains the sign-in/sign-up logic
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import DietaryProfile from './components/DietaryProfile';
import HealthyTips from './components/HealthyTips';
import ScanHistory from './components/ScanHistory';
import Favorites from './components/Favorites';
import Scanner from './components/Scanner';
import Barcode from './components/Barcode';

import './styles/layout.css'; // Scoped layout CSS

// Layout component that wraps authenticated pages
function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar /> {/* Sidebar will only appear in authenticated pages */}
      <div className="main-content">
        {children} {/* This renders the authenticated page (Home, Profile, etc.) */}
      </div>
    </div>
  );
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle Sign-In or Sign-Up successful login
  const handleSignIn = () => {
    setIsAuthenticated(true);  // Set user as authenticated
  };
  

  // Handle user logout
  const handleSignOut = () => {
    setIsAuthenticated(false);  // Set user as not authenticated
  };

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
