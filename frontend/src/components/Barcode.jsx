import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaChevronDown, FaStar, FaExclamationTriangle } from 'react-icons/fa'; 
import "../styles/Barcode.css";
import dadi from '../assets/dadi.jpg';

const Barcode = () => {
  const { state } = useLocation(); 
  const passedBarcode = state?.barcode || 'Unknown barcode'; 
  const navigate = useNavigate();

  const user_id = localStorage.getItem('user_id');
  console.log("-->",user_id);
  console.log("-->",passedBarcode);

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProductDetails = async () => {
      console.log("User ID:", user_id); 

      try {
        if (!user_id) {
          setError("User is not authenticated.");
          setLoading(false);
          return;
        }
          const response = await axios.get(`http://localhost:5000/api/products/${passedBarcode}`);
        console.log("Product details fetched:", response.data);
        setProduct(response.data);
        console.log("Product id:", response.data.product_id);
        addToRecentScans(response.data.product_id);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Product not found for the given barcode.");
        } else {
          setError("Error fetching product details.");
        }
        setLoading(false);
      }
    };
  
    fetchProductDetails();
  }, [passedBarcode, user_id]);  
  


  if (loading) {
    return <div>Loading...</div>;
  }

  const addToRecentScans = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/products/recent-scans', {
        user_id: user_id,  
        product_id: product.product_id,
      });
      console.log("Scan added to recent scans:", response.data);
    } catch (err) {
      console.error("Error adding to recent scans:", err);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="icon-warning" />
        <h2>{error}</h2>
        <button onClick={() => navigate('/scanner')} className="retry-button">
          Scan Again
        </button>
      </div>
    );
  }

  const allergens = Array.isArray(product.allergens)
    ? product.allergens
    : (product.allergens ? product.allergens.split(',') : []);

  return (
    <div className="barcode-con">
      <div className="small-card-user-container" onClick={() => navigate('/dietaryprofile')}>
        <img src={dadi} alt="User Avatar" className="user-avatar-small-card" />
        <div className="user-info-small-card">
          <p className="welcome-text-small-card">Welcome Back,</p>
          <p className="username-small-card">John Doe</p>
        </div>
        <FaChevronDown color="gray" className="arrow-down" />
      </div>

      <div className="food-label-container">
        <div className="top-row">
          <div className="barcode">
            <strong>Barcode#</strong> {passedBarcode}
          </div>
          <div className={`allergen-status ${allergens.length === 0 ? "safe" : "warning"}`}>
            {allergens.length === 0 ? "No Allergens Detected" : "Contains Allergens"}
          </div>
        </div>

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

          <div className="box nutrients">
            <h3>Nutrients</h3>
            <ul>
              {product.nutrients?.split(',').map((nutrient, index) => (
                <li key={index}>
                  <strong>{nutrient}:</strong> {product.nutrient_quantities?.split(',')[index]}
                </li>
              ))}
            </ul>
          </div>

          <div className="box nutrient-info">
            <h3>Nutrient Information</h3>
            <ul>
              <li><strong>Calories:</strong> {product.calories} kcal</li>
            </ul>
          </div>
        </div>

        <div className="ingredients-section">
          <h3>Ingredients</h3>
          <p>{product.ingredients}</p> {/* Display ingredients dynamically */}
          <button className="star">
            <FaStar className="star-icon" size={30} />
          </button>
        </div>

        {/* Scan Again Button */}
        <div className="scan-again-container">
          <button onClick={() => navigate('/scanner')} className="retry-button">
            Scan Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Barcode;
