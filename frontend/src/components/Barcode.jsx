import React from "react";
import "../styles/Barcode.css"; // Import the CSS file for styling
import dadi from '../assets/dadi.jpg';
import { FaChevronDown, FaStar } from 'react-icons/fa';

const Barcode = () => {
  // Temporary data
  const barcode = "2-903819-405791";
  const calories = "200 kcal";
  const allergens = ["Milk", "Eggs", "Peanuts"];
  const nutrients = {
    Carbohydrates: "30 g",
    Proteins: "5 g",
    Fats: "8 g",
    Vitamins: "Vitamin A, Vitamin C",
  };
  const nutrientInfo = {
    Calories: "10 kcal",
    "Saturated Fats": "2 g",
    "Trans Fats": "2 g",
    Cholesterol: "5 mg",
    Sodium: "8 mg",
    "Dietary Fiber": "3 g",
    Sugars: "3 g",
    Proteins: "3 g",
  };
  const ingredients =
    "Whole Grain Oats, Sugar, Corn Syrup, Almonds, Wheat Flour, Skim Milk, Salt, Natural Flavor";

    const handleCardClick = () => {
        navigate('/dietaryprofile');
    };

  return (
    <div className="barcode-con">
        <div className="small-card-user-container" onClick={handleCardClick}>
            <img
                src={dadi} // Placeholder image, replace with actual user image
                alt="User Avatar"
                className="user-avatar-small-card"
            />
            <div className="user-info-small-card">
                <p className="welcome-text-small-card">Welcome Back,</p>
                <p className="username-small-card">John Doe</p>
            </div>
            <FaChevronDown color="gray" className="arrow-down"/>
        </div>

        <div className="food-label-container">
        {/* Top Row */}
        <div className="top-row">
            <div className="barcode">
            <strong>Barcode#</strong> {barcode}
            </div>
            <div className={`allergen-status ${allergens.length === 0 ? "safe" : "warning"}`}>
            {allergens.length === 0 ? "No Allergens Detected" : "Contains Allergens"}
            </div>
        </div>

        {/* Main Grid */}
        <div className="main-grid">
            <div className="group1">
                <div className="box calories">
                    <h3>Calories</h3>
                    <p>{calories}</p>
                </div>
                <div className="box allergens">
                    <h3>Allergens</h3>
                    <p>{allergens.join(", ")}</p>
                </div>
            </div>
            <div className="box nutrients">
            <h3>Nutrients</h3>
            <ul>
                {Object.entries(nutrients).map(([key, value]) => (
                <li key={key}>
                    <strong>{key}:</strong> {value}
                </li>
                ))}
            </ul>
            </div>
            <div className="box nutrient-info">
            <h3>Nutrient Information</h3>
            <ul>
                {Object.entries(nutrientInfo).map(([key, value]) => (
                <li key={key}>
                    <strong>{key}</strong>: {value}
                </li>
                ))}
            </ul>
            </div>
        </div>

        {/* Ingredients Section */}
        <div className="ingredients-section">
            <h3>Ingredients</h3>
            <p>
            {ingredients}
            </p>
            <button className="star"><FaStar className="star-icon" size={30}/></button>
        </div>
        </div>
    </div>
  );
};

export default Barcode;