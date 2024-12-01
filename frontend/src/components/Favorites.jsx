import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import '../styles/Favorites.css';
import { FaStar, FaChevronDown } from 'react-icons/fa';  // Importing the star icon
import dadi from '../assets/dadi.jpg';

const Favorites = () => {
  const navigate = useNavigate();  // Initialize the navigate function

  // Sample data for the saved products (this can be dynamic in a real app)
  const savedProducts = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
    { id: 4, name: 'Product 4' },
    { id: 5, name: 'Product 5' },
    { id: 6, name: 'Product 6' },
    { id: 7, name: 'Product 7' },
    { id: 8, name: 'Product 8' },
    { id: 9, name: 'Product 9' },
    { id: 10, name: 'Product 10' },
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
    { id: 4, name: 'Product 4' },
    { id: 5, name: 'Product 5' },
    { id: 6, name: 'Product 6' },
    { id: 7, name: 'Product 7' },
    { id: 8, name: 'Product 8' },
    { id: 9, name: 'Product 9' },
    { id: 10, name: 'Product 10' },
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
    { id: 4, name: 'Product 4' },
    { id: 5, name: 'Product 5' },
    { id: 6, name: 'Product 6' },
    { id: 7, name: 'Product 7' },
    { id: 8, name: 'Product 8' },
    { id: 9, name: 'Product 9' },
    { id: 10, name: 'Product 10' },
  ];

  const handleAddMore = () => {
    // Logic for adding more products
    console.log('Add More clicked');
  };

  const handleCardClick = () => {
    navigate('/dietaryprofile');  // Navigate to the DietaryProfile page when the user clicks on the card
  };

  return (
    <div className="favorites">
      {/* Small Card User Container */}
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

      <div className="favorites-user-container">
        <h3 className="saved-products-title">Saved Products</h3>
        <div className="product-grid">
          {savedProducts.map((product) => (
            <div key={product.id} className="product-item">
              <span className="product-name">{product.name}</span>
              <FaStar className="star-icon" />
            </div>
          ))}
        </div>

        {/* Add More Button */}
        <button className="add-more-button" onClick={handleAddMore}>
          Add More
        </button>
      </div>
    </div>
  );
};

export default Favorites;
