import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // For API requests
import { FaStar, FaChevronDown } from 'react-icons/fa';
import '../styles/Favorites.css';
import dadi from '../assets/dadi.jpg';
import moment from 'moment';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]); // Store the list of favorites
  const [error, setError] = useState(null); // Error state for handling failures
  const [selectedProduct, setSelectedProduct] = useState(null); // Product to display in the popup
  const [productDetails, setProductDetails] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // Manage the confirmation popup visibility
  const [productToRemove, setProductToRemove] = useState(null); // Track the product being removed

  const user_id = localStorage.getItem('user_id');

  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY'); 
  };

  const handleViewInfoClick = (barcode) => {
    navigate(`/barcode/${barcode}`, { state: { barcode } });
  };

  // Fetch favorites from the backend
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/favorites/${user_id}`);
        setFavorites(response.data);
      } catch (err) {
        setError("Error fetching favorite products");
      }
    };

    fetchFavorites();
  }, [user_id]);

  useEffect(() => {
    if (selectedProduct) {
      console.log("Selected product barcode:", selectedProduct.barcode_num);
      const fetchProductDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${selectedProduct.barcode_num}`);
          setProductDetails(response.data);
        } catch (err) {
          console.error("Error fetching product details:", err);
        }
      };
      fetchProductDetails();
    }
  }, [selectedProduct]);

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const handleRemoveFavorite = async () => {
    try {
      const response = await axios.delete('http://localhost:5000/api/users/remove-favorite', {
        data: {
          user_id: user_id,
          product_id: productToRemove.product_id,
        },
      });
      console.log("Product removed from favorites:", response.data);

      setFavorites(favorites.filter(product => product.product_id !== productToRemove.product_id));
      setShowConfirmPopup(false); 
      setProductToRemove(null); 
    } catch (err) {
      console.error("Error removing product from favorites:", err);
    }
  };

  const handleShowConfirmPopup = (product) => {
    setShowConfirmPopup(true);
    setProductToRemove(product);
  };

  const handleCancelRemove = () => {
    setShowConfirmPopup(false); 
    setProductToRemove(null); 
  };

  const handleStarClick = (product, event) => {
    event.stopPropagation();
    handleShowConfirmPopup(product); 
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="favorites">
      <div className="favorites-user-container">
        <div className="favorites-header">
          <h3 className="saved-products-title">Saved Products</h3>
        </div>

        <hr className="custom-hr" />

        <div className="favorites-scan-records-container">
          {Array.isArray(favorites) && favorites.length > 0 ? (
            favorites.map((record, index) => (
              <div
                key={index}
                className={`table-favorites-row ${
                  record.allergen_status === "Detected" ? "allergy-detected" : ""
                }`}
              >
                <div className="table-favorites-item">{record.product_name}</div>
                <div className="table-favorites-item">Php {record.price}</div>
                <div className="table-favorites-item">{record.barcode_num}</div>
                <div
                  className={`table-favorites-item-stats ${
                    record.allergen_status === "Detected" ? "allergy-detected" : "safe"
                  }`}
                >
                  {record.allergen_status === "Detected" ? "Allergy Detected" : "Safe"}
                </div>
                <div className="table-favorites-item-bold">
                  <button
                    onClick={() => handleViewInfoClick(record.barcode_num)}
                    className="view-favorite-info-btn"
                  >
                    Product Info
                  </button>
                </div>
                <FaStar 
                    className="star-icon" 
                    onClick={(event) => handleStarClick(record, event)} 
                  />
              </div>
            ))
          ) : (
            <div>No favorite products found.</div>
          )}
        </div>
      </div>

      {/* Product Detail Popup */}
      {selectedProduct && (
        <div className="product-detail-popup">
          <div className="popup-content">
            <h4>{selectedProduct.product_name}</h4>
            <p>
              <strong>Price: </strong> Php {selectedProduct.price}
            </p>
            <p>
              <strong>Ingredients:</strong> {selectedProduct.ingredients}
            </p>
            <p>
              <strong>Allergens:</strong> {selectedProduct.allergens}
            </p>
            <p>
              <strong>Barcode:</strong> {selectedProduct.barcode_num}
            </p>
            <button
              onClick={() => handleViewInfoClick(selectedProduct.barcode_num)}
              className="view-info-btn"
            >
              View Info
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Popup for removing favorite (styled like the product detail popup) */}
      {showConfirmPopup && (
        <div className="product-detail-popup">
          <div className="popup-content">
            <p>Are you sure you want to remove this product from your favorites?</p>
            <button onClick={handleRemoveFavorite}>Yes</button>
            <button onClick={handleCancelRemove}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
