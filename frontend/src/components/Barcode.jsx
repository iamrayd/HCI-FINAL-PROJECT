import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; 
import "../styles/Barcode.css"; 
import dadi from '../assets/dadi.jpg';
import { FaChevronDown, FaStar } from 'react-icons/fa';

const Barcode = () => {
  const { state } = useLocation(); // Retrieve the barcode passed from Scanner.jsx
  const passedBarcode = state?.barcode || 'Unknown barcode'; // Get the barcode from the passed state
  const navigate = useNavigate();

  // Set state to hold product details
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details based on barcode
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${passedBarcode}`);
        console.log("Product details fetched:", response.data);
        setProduct(response.data);  // Set the product data from the response
        setLoading(false);  // Stop loading
      } catch (err) {
        setError("Error fetching product details.");
        setLoading(false);  // Stop loading in case of error
      }
    };

    fetchProductDetails();
  }, [passedBarcode]); // Re-run when passedBarcode changes

  // If loading, show loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error, show the error message
  if (error) {
    return <div>{error}</div>;
  }

  // Ensure allergens is always an array (in case it is a string or undefined)
  const allergens = Array.isArray(product.allergens) ? product.allergens : (product.allergens ? product.allergens.split(',') : []);

  return (
    <div className="barcode-con">
      <div className="small-card-user-container" onClick={() => navigate('/dietaryprofile')}>
        <img
          src={dadi} // Placeholder image, replace with actual user image
          alt="User Avatar"
          className="user-avatar-small-card"
        />
        <div className="user-info-small-card">
          <p className="welcome-text-small-card">Welcome Back,</p>
          <p className="username-small-card">John Doe</p>
        </div>
        <FaChevronDown color="gray" className="arrow-down" />
      </div>

      <div className="food-label-container">
        {/* Top Row */}
        <div className="top-row">
          <div className="barcode">
            <strong>Barcode#</strong> {passedBarcode}
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
              <p>{product.calories} kcal</p>
            </div>
            <div className="box allergens">
              <h3>Allergens</h3>
              <p>{allergens.join(", ")}</p> {/* Display allergens dynamically */}
            </div>
          </div>

          {/* Nutrients Section */}
          <div className="box nutrients">
            <h3>Nutrients</h3>
            <ul>
              {product.nutrients?.split(',').map((nutrient, index) => (
                <li key={index}><strong>{nutrient}:</strong> {product.nutrient_quantities?.split(',')[index]} {product.unit || ''}</li>
              ))}
            </ul>
          </div>

          {/* Nutrient Information */}
          <div className="box nutrient-info">
            <h3>Nutrient Information</h3>
            <ul>
              <li><strong>Calories:</strong> {product.calories} kcal</li>
              {/* You can add more nutrient details dynamically here as needed */}
            </ul>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="ingredients-section">
          <h3>Ingredients</h3>
          <p>{product.ingredients}</p>  {/* Display ingredients dynamically */}
          <button className="star">
            <FaStar className="star-icon" size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Barcode;
