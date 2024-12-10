import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ScanHistory.css';
import dadi from '../assets/dadi.jpg';
import { FaChevronDown } from 'react-icons/fa';

const ScanHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // Default filter
  const [activeCategory, setActiveCategory] = useState('all'); // Track the active button
  const [scanHistory, setScanHistory] = useState([]);
  const [error, setError] = useState(null);

  const user_id = localStorage.getItem('user_id');
  const user_allergens = localStorage.getItem('user_allergens')?.split(',') || []; // Fetch user allergens

  useEffect(() => {
    const fetchScanHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/scan-history/${user_id}`);
        console.log("Fetched scan history:", response.data);
        setScanHistory(response.data);
      } catch (err) {
        console.error("Error fetching scan history:", err);
        setError("Error fetching scan history");
      }
    };

    fetchScanHistory();
  }, [user_id]);

  const filterRecords = (records, filter) => {
    if (filter === 'safe') {
      // Items without overlapping allergens
      return records.filter(record => {
        const recordAllergens = record.allergens?.split(',') || [];
        return !recordAllergens.some(allergen => user_allergens.includes(allergen));
      });
    } else if (filter === 'detect') {
      // Items with overlapping allergens
      return records.filter(record => {
        const recordAllergens = record.allergens?.split(',') || [];
        return recordAllergens.some(allergen => user_allergens.includes(allergen));
      });
    }
    return records; // Return all for "all"
  };

  const handleCategoryClick = (category) => {
    setFilter(category);
    setActiveCategory(category); // Set the clicked button as active
  };

  const handleViewInfoClick = (barcode) => {
    navigate(`/barcode/${barcode}`);
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
        <img
          src={dadi}
          alt="User Avatar"
          className="user-avatar-small-card"
        />
        <div className="user-info-small-card">
          <p className="welcome-text-small-card">Welcome Back,</p>
          <p className="username-small-card">John Doe</p>
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
            onClick={() => handleCategoryClick('detect')}
          >
            Allergies Detect
          </button>
        </div>

        {/* Scan Records Table */}
        <div className="all-history-scan-records-container">
          <div className="table-header">
            <div className="table-header-item">Barcode No.</div>
            <div className="table-header-item">Date</div>
            <div className="table-header-item">Product</div>
            <div className="table-header-item">Product Info</div>
            <div className="table-header-item">Price</div>
            <div className="table-header-item">Status</div>
          </div>

          {filterRecords(scanHistory, filter).map((record, index) => (
            <div
              key={index}
              className={`table-row ${record.allergens && user_allergens.some(a => record.allergens.includes(a)) ? 'allergy-detected' : ''}`} 
            >
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
              <div className={`table-item-stats ${record.allergens && user_allergens.some(a => record.allergens.includes(a)) ? 'allergy-detected' : 'safe'}`}>
                {record.allergens && user_allergens.some(a => record.allergens.includes(a)) ? 'Allergy Detected' : 'Safe'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanHistory;
