// Scanner.jsx
import { useNavigate } from 'react-router-dom';
import React from "react";
import '../styles/Scanner.css';
import { FaChevronDown, FaArrowDown } from 'react-icons/fa';
import dadi from '../assets/dadi.jpg';

const Scanner = () => {
    const navigate = useNavigate(); 
    
    const handleCardClick = () => {
        navigate('/dietaryprofile');  // Navigate to the DietaryProfile page when the user clicks on the card
    };

  return (
    <div className="scan-section">

        <div className="small-card-user-container" onClick={handleCardClick}>
            <img
                src={dadi} 
                alt="User Avatar"
                className="user-avatar-small-card"
            />
            <div className="user-info-small-card">
                <p className="welcome-text-small-card">Welcome Back,</p>
                <p className="username-small-card">John Doe</p>
            </div>
            <FaChevronDown color="gray" className="arrow-down"/>
      </div>

        <div className="scan-container">
            <h1 className="scan-title">Scan product here<span><FaArrowDown/></span></h1>
            <div className="scan-area">
              <p>Scan area</p>
            </div>
        </div>
    </div>
  );
};

export default Scanner;

