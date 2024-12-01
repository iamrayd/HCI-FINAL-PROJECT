import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function Overlay({ setIsRightPanelActive }) {
  const navigate = useNavigate();  // Initialize navigate

  const handleSignInClick = () => {
    console.log("Sign In button clicked");
    setIsRightPanelActive(false);  // Set state to show SignIn form
  };

  const handleSignUpClick = () => {
    console.log("Sign Up button clicked");
    setIsRightPanelActive(true);   // Set state to show SignUp form
  };

  const handleBackClick = () => {
    console.log("Back button clicked");
    navigate('/');  // Navigate back to Landing Page
  };

  return (
    <div className="overlay-container">
      <div className="overlay">
        <div className="overlay-panel overlay-left">
          <h1>Hello, Friend!</h1>
          <p>Enter your personal details and start your journey with us</p>
          <div>
            <h6>Already have an account?</h6>
          </div>
          <button
            className="ghost-btn"
            onClick={handleSignInClick}
          >
            Sign In
          </button>    
        </div>

        <div className="overlay-panel overlay-right">
          <h1>Welcome!</h1>
          <p>Know your food with us. Shop wise and healthy</p>
          <div>
            <h6>Don't have an account?</h6>
          </div>
          <button
            className="ghost-btn"
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
          {/* Back Button */}
        </div>
      </div>
    </div>
  );
}

export default Overlay;
