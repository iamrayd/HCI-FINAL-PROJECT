import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaTimes, FaEdit } from 'react-icons/fa'; 
import '../styles/DietaryProfile.css'; 
import profile from '../assets/profile.png'; 
import header from '../assets/header.png'; 
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'; 
import Allergies from "./Allergies";



const DietaryProfile = () => {
  const [allergies, setAllergies] = useState([]); 
  const [formVisible, setFormVisible] = useState(false); 
  const [selectedAllergy, setSelectedAllergy] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({});


  const user_id = localStorage.getItem('user_id');


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/user-info/${user_id}`);
        setUserInfo(response.data); 
        console.log("userinfooo",response.data)
      } catch (err) {
        console.error("Error fetching user information:", err);
        setError("Failed to load user information.");
      }
    };

    fetchUserInfo();
  }, [user_id]);
 


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
      <div className="dietary-header">
        <h2>My Profile</h2>
        <hr />
      </div>

      <div className="dietary-profile-image">
        <div className="header-image">
          <img src={header} alt="Header" />
        </div>
        <div className="profile-image">
          <img src={profile} alt="Profile" />
        </div>
      </div>

      <div className="personal-header">
          <h3>{userInfo.firstname} {userInfo.lastname}</h3>
          <p>SOFTWARE DEVELOPER</p>
      </div>

      <div className="dietary-profile-personal">
        <div className="personal-details-header">
          <h1> Personal Information</h1>
          <button className="personal-edit-btn">
          <FaEdit className="edit-icon"/>
            EDIT
            </button>
        </div>

        <div className="personal-details">
          <div className="name">
            <div className="firstname">
              <h4>First Name</h4>
              <div>{userInfo.firstname}</div>
            </div>
            <div className="lastname">
              <h4>Last Name</h4>
              <div>{userInfo.lastname}</div>
            </div>
          </div>
          <div className="emailphone">
            <div className="email">
              <h4>Email</h4>
              <div>{userInfo.email}</div>
            </div>
            <div className="phone">
              <h4>Phone</h4>
              <div>-</div>
            </div>
          </div>
          <div className="bio">
            <h4>Bio</h4>
            <p>I AM THE ONE</p>
          </div>
        </div>

      </div>

      <div className="dietary-allergies">
        <div className="allergen-profile">
          <h2>Allergen Profile</h2>
          {/* Add a button to toggle the isEditing state */}
          <button 
            className="allergen-edit-button" 
            onClick={() => setIsEditing(!isEditing)}
          >
            <FaEdit className="edit-icon" />
            {isEditing ? "Done" : "Edit"}
          </button>
        </div>

        <div className="user-allergen">
          <p>User allergens</p>
        </div>

        <div className="allergies-list">
          {allergies.length === 0 ? (
            <div>No allergies found.</div>
          ) : (
            allergies.map((allergy, index) => (
              <div key={index} className="allergy-item">
                <span className="allergy-name">{allergy}</span>
                {isEditing && (
                  <button 
                    className="remove-button" 
                    onClick={() => handleRemoveClick(allergy)}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))
          )}
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
