import React, { useState } from "react";
import "../styles/Allergies.css"; // Create a CSS file for styling

function Allergies({ isVisible, onClose, onSubmit }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedAllergies); // Pass selected allergies back to parent
    onClose(); // Close the modal
  };

  if (!isVisible) return null; // Don't render if modal is not visible

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2>Select Your Allergies</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="save-btn2">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default Allergies;
