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
  const [product, setProduct] = useState({});
  const [userAllergens, setUserAllergens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username] = useState(localStorage.getItem('username' || "error"));
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch Product Details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${passedBarcode}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Product not found for the given barcode.");
        }
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [passedBarcode]);

  // Check if product is already a favorite
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/favorites/${user_id}`);
        const isFav = response.data.some(fav => fav.product_id === product.product_id);
        setIsFavorite(isFav);
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    };

    if (product.product_id) {
      checkFavoriteStatus();
    }
  }, [user_id, product.product_id]);

  useEffect(() => {
    const fetchUserAllergens = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/allergens/${user_id}`);
        setUserAllergens(response.data.allergens || []);
      } catch (err) {
        setError('Error fetching user allergens');
      }
    };

    if (user_id) {
      fetchUserAllergens();
    } else {
      setError("User is not authenticated.");
    }
  }, [user_id]);

  const handleFavoriteClick = async () => {
    try {
      {
        await axios.post(`http://localhost:5000/api/users/favorites`, {
          user_id, product_id: product.product_id
        });
        setIsFavorite(true);
        alert("Added to favorites.");
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
      alert("Failed to update favorites.");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return (
    <div className="error-container">
      <FaExclamationTriangle className="icon-warning" />
      <h2>{error}</h2>
      <button onClick={() => navigate('/scanner')} className="retry-button">
        Scan Again
      </button>
    </div>
  );

  const allergens = Array.isArray(product.allergens)
    ? product.allergens
    : (product.allergens ? product.allergens.split(',') : []);

  const containsAllergen = allergens.some(allergen => userAllergens.includes(allergen));

  return (
    <div className="barcode-con">
      <div className="food-label-container">
        <div className="top-row">
          <div className="barcode">
            <strong>Barcode#</strong> {passedBarcode}
          </div>
          <div className={`allergen-status ${containsAllergen ? "warning" : "safe"}`}>
            {containsAllergen ? "Contains Allergens" : "No Allergens Detected"}
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
              <p>{allergens.join(", ")}</p>
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
          <p>{product.ingredients}</p>
          <button className="star" onClick={handleFavoriteClick}>
            <FaStar className={`star-icon-scanner ${isFavorite ? 'filled' : ''}`} size={30} />
          </button>
        </div>

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
