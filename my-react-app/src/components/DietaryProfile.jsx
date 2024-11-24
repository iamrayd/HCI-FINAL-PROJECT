import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa'; // Import the warning icon
import '../styles/DietaryProfile.css';
import dadi from '../assets/dadi.jpg';

const DietaryProfile = () => {
    return (
        <div className="dietary-profile-container">
            <div className="dietary-profile">
                {/* Top Circle Container for Profile Avatar */}
                <div className="profile-circle">
                    <img 
                        src= {dadi}
                        alt="Profile Avatar" 
                        className="profile-avatar" 
                    />
                </div>

                {/* Username and Email below the circle */}
                <div className="user-info">
                    <h2 className="username">John Doe</h2>
                    <p className="email">johndoe@example.com</p>
                </div>

                {/* Dietary Profile Allergies Container (positioned at the bottom) */}
                <div className="dietary-allergies">
                    <h4>
                        <FaExclamationTriangle style={{ marginRight: '8px', color: '#f39c12' }} />
                        Allergies
                    </h4>
                    <div className="allergies-list">
                        <span>Peanuts</span>
                        <span>Gluten</span>
                        <span>Shellfish</span>
                        <span>Lactose</span>
                        <span>Eggs</span>
                        <span>Wheat</span>
                        <span>Peanuts</span>
                        <span>Gluten</span>
                        <span>Shellfish</span>
                        <span>Lactose</span>
                        <span>Eggs</span>
                        <span>Wheat</span>
                        <span>Peanuts</span>
                        <span>Gluten</span>
                        <span>Shellfish</span>
                        <span>Lactose</span>
                        <span>Eggs</span>
                        <span>Wheat</span>
                        <span>Shellfish</span>
                        <span>Lactose</span>
                        <span>Eggs</span>
                        <span>Wheat</span>
                        <span>Peanuts</span>
                        <span>Gluten</span>
                        <span>Shellfish</span>
                        <span>Lactose</span>
                        <span>Eggs</span>
                        <span>Wheat</span>
                        <span>Shellfish</span>
                        <span>Lactose</span>
                        <span>Eggs</span>
                        <span>Wheat</span>
                        <span>Peanuts</span>
                        <span>Gluten</span>
                        <span>Shellfish</span>
                        <span>Lactose</span>
                        <span>Eggs</span>
                        <span>Wheat</span>
                    </div>
                </div>

              
            </div>
        </div>
    );
};

export default DietaryProfile;
