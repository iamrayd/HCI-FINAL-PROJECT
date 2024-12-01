import React, { useState } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'; // Import warning and X icons
import '../styles/DietaryProfile.css'; // Link to the CSS file
import dadi from '../assets/dadi.jpg'; // Profile image

const DietaryProfile = () => {
  const [allergies, setAllergies] = useState([
    'Peanuts', 'Gluten', 'Shellfish', 'Lactose', 'Eggs', 'Wheat',
    'Shellfish', 'Lactose', 'Eggs', 'Wheat', 'Peanuts', 'Gluten',
    'Shellfish', 'Lactose', 'Eggs', 'Wheat'
  ]);

  const [formVisible, setFormVisible] = useState(false); // Form visibility
  const [selectedAllergy, setSelectedAllergy] = useState(null); // Selected allergy
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode

  const handleRemoveClick = (allergy) => {
    setFormVisible(true);
    setSelectedAllergy(allergy);
  };

  const handleRemoveConfirmed = () => {
    setAllergies(allergies.filter((item) => item !== selectedAllergy));
    setFormVisible(false);
    setSelectedAllergy(null);
  };

  return (
    <div className="dietary-profile-container">
      <div className="dietary-profile">
        {/* Profile Section */}
        <div className="profile-circle">
          <img src={dadi} alt="Profile Avatar" className="profile-avatar" />
        </div>

        <div className="user-info">
          <h2 className="username">John Doe</h2>
          <p className="email">johndoe@example.com</p>
        </div>

        {/* Allergies List */}
        <div className="dietary-allergies">
          <div className="header-edit-group">
            <h4 className="allergies-header">
              <FaExclamationTriangle className="icon-warning" />
              Allergies
            </h4>
            <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Done' : 'Edit'}
            </button> 
          </div>
          <div className="allergies-list">
            {allergies.map((allergy, index) => (
              <div key={index} className="allergy-item">
                <span className="allergy-name">{allergy}</span>
                {isEditing && (
                  <button className="remove-button" onClick={() => handleRemoveClick(allergy)}>
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Confirmation Form */}
      {formVisible && (
        <div className='confirm-back'>
          <div className="confirmation-form">
            <h3>Remove Allergy</h3>
            <p>Are you sure you want to remove "{selectedAllergy}"?</p>
            <button className="confirm-button" onClick={handleRemoveConfirmed}>
              Yes
            </button>
            <button className="cancel-button" onClick={() => setFormVisible(false)}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietaryProfile;
