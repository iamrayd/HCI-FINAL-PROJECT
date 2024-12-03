import React, { useState } from "react";
import "../styles/Allergies.css"; // Create a CSS file for styling
import { useNavigate } from "react-router-dom";

function Allergies({ isVisible, onClose, onSubmit }) {
  const navigate = useNavigate();
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  const allergiesList = [
    "Celery",
    "Crustaceans",
    "Fish",
    "Milk",
    "Mustard",
    "Sesame",
    "Soybeans",
    "Gluten",
    "Eggs",
    "Lupin",
    "Mollusks",
    "Peanuts",
    "Sulphur Oxide and Sulphites",
    "Tree Nuts",
  ];

  const handleCheckboxChange = (allergy) => {
    setSelectedAllergies((prevSelected) =>
      prevSelected.includes(allergy)
        ? prevSelected.filter((item) => item !== allergy) // Remove if already selected
        : [...prevSelected, allergy] // Add if not selected
    );
  };

  const handleSave = () => {
    console.log("Final selectedAllergies on Save:", selectedAllergies);
    onSubmit(selectedAllergies);
  };

  const handleCancel = () => {
    // Simply close the modal without saving
    onClose();
  };

  if (!isVisible) return null; // Don't render if modal is not visible

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={handleCancel}>
          ✖
        </button>
        <h2>Select Your Allergies</h2>
        <div className="checkbox-container">
          {allergiesList.map((allergy) => (
            <div key={allergy} className="checkbox-item">
              <input
                type="checkbox"
                id={allergy}
                value={allergy}
                checked={selectedAllergies.includes(allergy)}
                onChange={() => handleCheckboxChange(allergy)}
              />
              <label htmlFor={allergy}>{allergy}</label>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="save-btn2" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Allergies;
