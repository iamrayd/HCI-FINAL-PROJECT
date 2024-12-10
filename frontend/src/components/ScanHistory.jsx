import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ScanHistory.css';
import dadi from '../assets/dadi.jpg';
import { FaChevronDown } from 'react-icons/fa';

const ScanHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [scanHistory, setScanHistory] = useState([]);
  const [error, setError] = useState(null);
  const [username] = useState(localStorage.getItem('username' || "error"));
  const user_id = localStorage.getItem('user_id');

  // Function to fetch scan history based on the filter
  const fetchScanHistory = async (category) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/scan-history/${category}/${user_id}`, {
        params: { user_id },
      });
      setScanHistory(response.data);
    } catch (err) {
      console.error("Error fetching scan history:", err);
      setError("Error fetching scan history");
    }
  };

  // Fetch scan history whenever the filter or user_id changes
  useEffect(() => {
    fetchScanHistory(filter); // Pass the filter to fetch the appropriate data
  }, [filter, user_id]);

  // Handle category click, change filter and fetch data
  const handleCategoryClick = (category) => {
    setFilter(category);
    setActiveCategory(category);
  };

  const handleViewInfoClick = (barcode) => {
    navigate(`/barcode/${barcode}`, { state: { barcode } });
  };

  const handleCardClick = () => {
    navigate('/dietaryprofile');
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="scan-history">
      <div className="small-card-user-container" onClick={handleCardClick}>
        <img src={dadi} alt="User Avatar" className="user-avatar-small-card" />
        <div className="user-info-small-card">
          <p className="welcome-text-small-card">Welcome Back,</p>
          <p className="username-small-card">{username}</p>
        </div>
        <FaChevronDown color="gray" className="arrow-down" />
      </div>

      <div className="scan-history-container">
        <h2>Scan History</h2>

        {/* Category Buttons */}
        <div className="scan-history-categories">
          <button
            className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('all')}
          >
            All
          </button>
          <button
            className={`category-btn ${activeCategory === 'safe' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('safe')}
          >
            Safe
          </button>
          <button
            className={`category-btn ${activeCategory === 'detect' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('detected')}
          >
            Allergies Detect
          </button>
        </div>

        <div className="all-history-scan-records-container">
          <div className="table-header">
            <div className="table-header-item">Barcode No.</div>
            <div className="table-header-item">Date</div>
            <div className="table-header-item">Product</div>
            <div className="table-header-item">Product Info</div>
            <div className="table-header-item">Price</div>
            <div className="table-header-item">Status</div>
          </div>

          {Array.isArray(scanHistory) && scanHistory.length > 0 ? (
            scanHistory.map((record, index) => (
              <div key={index} className={`table-row ${record.allergen_status === 'Detected' ? 'allergy-detected' : ''}`}>
                <div className="table-item">{record.barcode_num}</div>
                <div className="table-item">{record.date}</div>
                <div className="table-item">{record.product_name}</div>
                <div className="table-item-bold">
                  <button
                    onClick={() => handleViewInfoClick(record.barcode_num)}
                    className="view-info-btn"
                  >
                    View Info
                  </button>
                </div>
                <div className="table-item">{record.price}</div>
                <div className={`table-item-stats ${record.allergen_status === 'Detected' ? 'allergy-detected' : 'safe'}`}>
                  {record.allergen_status === 'Detected' ? 'Allergy Detected' : 'Safe'}
                </div>
              </div>
            ))
          ) : (
            <div>No scan history found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanHistory;
