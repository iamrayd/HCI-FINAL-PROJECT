import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../styles/Home.css'; 
import { FaRegClock, FaChevronDown } from 'react-icons/fa';
import dadi from '../assets/dadi.jpg';
import moment from 'moment';

const Home = () => {
  const navigate = useNavigate(); 

  const [username] = useState(localStorage.getItem('username' || "error"));
  const [recentScans, setRecentScans] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const user_id = localStorage.getItem('user_id');

  const handleCardClick = () => {
    navigate('/dietaryprofile');
  };

  const handleStartScan = () => {
    navigate('/scanner'); 
  };

  // Date formatting function
  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY'); 
  };

  useEffect(() => {
    const fetchRecentScans = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/recent-scans/${user_id}`,{
          params: { user_id},
        });
        console.log("Fetched recent scans data:", response.data);
        setRecentScans(response.data);
      } catch (err) {
        console.error("Error fetching recent scans:", err);
        setError('Error fetching recent scans');
      } finally {
        setLoading(false);
      }
    };
    fetchRecentScans();
  }, [user_id]);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="home-page">
      <div className="home-header">
        <h5>Discover more by scanning your food. Eat healthy for a healthy living</h5>
      </div>

      <div className="scanner-container">
        <div className="scanner">
          <h1>Start Scanning Now</h1>
          <button className="scan-button" onClick={handleStartScan}>
            Start Scan
          </button>
        </div>
      </div>

      <div className="recent-scans-container">
        <h3 className="recent-scans-h3">
          <FaRegClock style={{ color: "black", marginRight: '8px' }} /> Recent Scans
        </h3>

        <div className="recent-scans">
          {recentScans.length === 0 ? (
            <div>No recent scans.</div>
          ) : (
            <>
              <div className="scan-header-row">
                <div className="scan-item-header">Item</div>
                <div className="scan-item-header">Price</div>
                <div className="scan-item-header">Date</div>
                <div className="scan-item-header">Barcode</div>
              </div>

              {recentScans.map((scan, index) => (
                <div key={index} className="scan-row">
                  <div className="scan-item">{scan.product_name}</div>
                  <div className="scan-item">Php {scan.price}</div>
                  <div className="scan-item">{formatDate(scan.date)}</div> 
                  <div className="scan-item">{scan.barcode_num}</div>
                </div>
              ))}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;
