import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../styles/Home.css'; 
import { FaRegClock, FaChevronDown } from 'react-icons/fa';
import dadi from '../assets/dadi.jpg';


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


  useEffect(() => {
    const fetchRecentScans = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/recent-scans/:user_id`,{
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
      <div className="small-card-user-container" onClick={handleCardClick}>
        <img
          src={dadi} 
          alt="User Avatar"
          className="user-avatar-small-card"
        />
        <div className="user-info-small-card">
          <p className="welcome-text-small-card">Welcome Back,</p>
          <p className="username-small-card">{username}</p> 
        </div>
        <FaChevronDown color="gray" className="arrow-down"/>
      </div>

      <div className="scanner-container">
        <div className="scanner">
          <button className="scan-button" onClick={handleStartScan}>
            Start Scan
          </button>
        </div>
      </div>

      <div className="recent-scans-container">
        <h3 className="recent-scans-h3">
          <FaRegClock style={{ color: "black", marginRight: '8px' }} /> Recent Scans
        </h3>
        <h3 className="product-info-h3">
          Product Info
        </h3>
        <div className="recent-scans">
          {recentScans.length === 0 ? (
            <div>No recent scans.</div>
          ) : (
            recentScans.map((scan, index) => (
              <div key={index} className="scan-row">
                <div className="scan-item">{scan.product_name}</div>
                <div className="scan-item">{scan.price}</div>
                <div className="scan-item">{scan.scanDateTime}</div> {/* Display the scan date */}
                <div className="scan-item">{scan.barcode_num}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
