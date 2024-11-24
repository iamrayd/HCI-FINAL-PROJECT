// AppOverlay.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Overlay from './components/Overlay';
import './styles/Overlay.css';
import './styles/Signup.css';
import './styles/Signin.css';

const AppOverlay = ({ onSignIn }) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    console.log("AppOverlay rendered, current path:", location.pathname);  // Log the current path
    if (location.pathname === '/sign-up') {
      setIsRightPanelActive(true);  
    } else {
      setIsRightPanelActive(false); 
    }
  }, [location.pathname]);

  return (
    <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
      <div className="form-container sign-up-container">
        {isRightPanelActive && <SignUp />}
      </div>

      <div className="form-container sign-in-container">
        {!isRightPanelActive && <SignIn onSignIn={onSignIn} />}
      </div>

      <Overlay setIsRightPanelActive={setIsRightPanelActive} />
    </div>
  );
};

export default AppOverlay;
