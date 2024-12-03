import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Quagga from 'quagga'; // Import Quagga for barcode scanning
import '../styles/Scanner.css';
import { FaChevronDown, FaArrowDown } from 'react-icons/fa';
import dadi from '../assets/dadi.jpg';

const Scanner = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false); // Track scanning state
  const videoRef = useRef(null);

  const startScanning = () => {
    if (videoRef.current) {
      // Test camera access directly first
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          videoRef.current.srcObject = stream;

          // Initialize Quagga after the video stream is set
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
              },
            },
            (err) => {
              if (err) {
                console.error(err);
                return;
              }
              Quagga.start();
              setIsScanning(true); // Set scanning state to true
            }
          );

          Quagga.onDetected((result) => {
            const barcode = result.codeResult.code; // Get the scanned barcode
            setIsScanning(false);
            Quagga.stop();
            if (videoRef.current && videoRef.current.srcObject) {
              const tracks = videoRef.current.srcObject.getTracks();
              tracks.forEach(track => track.stop()); // Stop all tracks
              videoRef.current.srcObject = null; // Clear the video source
            }
  
            navigate(`/barcode/${barcode}`, { state: { barcode } });
          });
        })
        .catch((err) => {
          console.error("Error accessing camera: ", err);
        });
    }
  };

  const handleCardClick = () => {
    navigate('/dietaryprofile'); 
  };

  const handleStopScanning = () => {
    setIsScanning(false);
    Quagga.stop();
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop()); // Stop all tracks
      videoRef.current.srcObject = null; // Clear the video source
    }
  };

  // Cleanup on component unmount or route change
  useEffect(() => {
    return () => {
      // Stop Quagga and camera when leaving the scanner page
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

      <div className="scan-title">
        <h2>
          Scan product here <span><FaArrowDown /></span>
        </h2>
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
