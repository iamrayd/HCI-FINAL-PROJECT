import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'; 
import '../styles/DietaryProfile.css'; 
import dadi from '../assets/dadi.jpg'; 
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios for API requests

const DietaryProfile = () => {
  const [allergies, setAllergies] = useState([]); 
  const [formVisible, setFormVisible] = useState(false); 
  const [selectedAllergy, setSelectedAllergy] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { state } = useLocation(); 
  const [username] = useState(localStorage.getItem('username' || "error"));
  const user_id = localStorage.getItem('user_id');
  const email = localStorage.getItem('email');
 


  useEffect(() => {
    if (user_id) {
      const fetchAllergies = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/allergens/${user_id}`);
          const fetchedAllergies = response.data;
          console.log("Fetched allergies:", response.data);
          setAllergies(response.data.allergens || []);
          setLoading(false);
        } catch (err) {
          setError('Error fetching allergies');
          setLoading(false);
        }
      };

      fetchAllergies();
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, [user_id]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleRemoveClick = (allergy) => {
    setFormVisible(true);
    setSelectedAllergy(allergy);
  };

  const handleRemoveConfirmed = async () => {
    try {
      setAllergies(allergies.filter((item) => item !== selectedAllergy));
      setFormVisible(false);
      setSelectedAllergy(null);
  
      const userId = user_id;
      const allergenName = selectedAllergy; 
  
      await axios.delete(`http://localhost:5000/api/users/allergens`, {
        data: {
          user_id: userId,
          allergen_name: allergenName,
        },
      });
  
      console.log(`Successfully removed allergen: ${allergenName}`);
    } catch (err) {
      console.error('Error removing allergy:', err);
    }
  };
  

  return (
    <div className="dietary-profile-container">
      <div className="dietary-profile">
        {/* Profile Section */}
        <div className="profile-circle">
          <img src={dadi} alt="Profile Avatar" className="profile-avatar" />
        </div>

        <div className="user-info">
          <h2 className="username">{username}</h2>
          <p className="email">{email}</p>
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
            {allergies.length === 0 ? (
              <div>No allergies found.</div>
            ) : (
              allergies.map((allergy, index) => (
                <div key={index} className="allergy-item">
                  <span className="allergy-name">{allergy}</span>
                  {isEditing && (
                    <button className="remove-button" onClick={() => handleRemoveClick(allergy)}>
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Confirmation Form */}
      {formVisible && (
        <div className='confirm-back'>
          <div className="confirmation-form">
            <h3>Remove Allergy</h3>
            <p>Are you sure you want to remove {selectedAllergy}?</p>
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
