import React, { useState, useEffect, Component} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ScanHistory.css';
import dadi from '../assets/dadi.jpg';
import { FaChevronDown } from 'react-icons/fa';
import moment from 'moment';


const ScanHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [scanHistory, setScanHistory] = useState([]);
  const [error, setError] = useState(null);
  const user_id = localStorage.getItem('user_id');

    // Date formatting function
    const formatDate = (dateString) => {
      return moment(dateString).format('MMMM D, YYYY'); 
    };
  

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

  useEffect(() => {
    fetchScanHistory(filter); 
  }, [filter, user_id]);

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


      <div className="scan-history-container">
        <div className="scan-history-header">
          <h5>Scan History</h5>
        </div>


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
            Not Safe
          </button>
          
        </div>

        <hr className="custom-hr"/>
      

        <div className="all-history-scan-records-container">


          {Array.isArray(scanHistory) && scanHistory.length > 0 ? (
            scanHistory.map((record, index) => (
              <div key={index} className={`table-row ${record.allergen_status === 'Detected' ? 'allergy-detected' : ''}`}>
                <div className="table-item">{record.barcode_num}</div>
                <div className="table-item-date">{formatDate(record.date)}</div>
                <div className="table-item">{record.product_name}</div>
                <div className="table-item-bold">
                  <button
                    onClick={() => handleViewInfoClick(record.barcode_num)}
                    className="view-info-btn"
                  >
                    View Info
                  </button>
                </div>
                <div className="table-item">Php {record.price}</div>
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
