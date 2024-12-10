import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Quagga from '@ericblade/quagga2'; 
import '../styles/Scanner.css';
import { FaChevronDown, FaArrowDown } from 'react-icons/fa';
import dadi from '../assets/dadi.jpg';
import axios from 'axios';

const Scanner = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); 
  const [isScanning, setIsScanning] = useState(false); 
  const [hasScanned, setHasScanned] = useState(false);
  const videoRef = useRef(null);

  const user_id = localStorage.getItem('user_id');

  const addToRecentScans = async (productId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/products/recent-scans', {
        user_id: user_id,  
        product_id: productId,
      });
      console.log("Scan added to recent scans:", response.data);
    } catch (err) {
      console.error("Error adding to recent scans:", err);
    }
  };

  const startScanning = () => {
    if (videoRef.current && !hasScanned) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          videoRef.current.srcObject = stream;

          Quagga.init(
            {
              inputStream: {
                name: "Live",
                type: "LiveStream",
                target: videoRef.current,
                constraints: {
                  facingMode: "environment",
                },
              },
              decoder: {
                readers: ["ean_reader"],              
              }
            },
            (err) => {
              if (err) {
                console.error(err);
                return;
              }
              Quagga.start();
              setIsScanning(true); 
            }
          );

          Quagga.onDetected((result) => {
            if (hasScanned) return;
            const barcode = result.codeResult.code;
            setIsScanning(false);
            Quagga.stop();
            if (videoRef.current && videoRef.current.srcObject) {
              const tracks = videoRef.current.srcObject.getTracks();
              tracks.forEach(track => track.stop());
              videoRef.current.srcObject = null;
            }

            // Fetch the product details and trigger addToRecentScans
            axios.get(`http://localhost:5000/api/products/${barcode}`)
              .then((response) => {
                const product = response.data;
                if (product.product_id) {
                  addToRecentScans(product.product_id);
                } else {
                  console.error("Product ID is missing");
                }
              })
              .catch((error) => {
                console.error("Error fetching product details:", error);
              });

            navigate(`/barcode/${barcode}`, { state: { barcode } });
          });
        })
        .catch((err) => {
          console.error("Error accessing camera: ", err);
        });
    }
  };

  const handleStopScanning = () => {
    setHasScanned(false);
    setIsScanning(false);
    Quagga.stop();
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      if (isScanning) {
        Quagga.stop();
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    };
  }, [isScanning]);

  return (
    <div className="scan-section">
      <div className="small-card-user-container" onClick={() => navigate('/dietaryprofile')}>
        <img src={dadi} alt="User Avatar" className="user-avatar-small-card" />
        <div className="user-info-small-card">
          <p className="welcome-text-small-card">Welcome Back,</p>
          <p className="username-small-card">{username}</p>
        </div>
        <FaChevronDown color="gray" className="arrow-down" />
      </div>

      <div className="scan-title">
        <h2>Scan product here <span><FaArrowDown /></span></h2>
      </div>

      <div className="scan-container">
        <video
          ref={videoRef}
          style={{ width: '100%', height: '400px', borderRadius: '10px' }}  
          autoPlay
          muted
        />
        <div className="scan-buttons">
          <button 
            onClick={startScanning} 
            className="scan-button-start" 
            disabled={isScanning} 
          >
            Start Scanning
          </button>
          <button 
            onClick={handleStopScanning} 
            className="scan-button-stop" 
            disabled={!isScanning} 
          >
            Stop Scanning
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
