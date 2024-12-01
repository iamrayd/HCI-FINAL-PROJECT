import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Quagga from 'quagga';
import '../styles/Scanner.css';
import { FaChevronDown, FaArrowDown } from 'react-icons/fa';
import dadi from '../assets/dadi.jpg';

const Scanner = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const initQuagga = () => {
      

      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current,
          constraints: { facingMode: "environment" },
        },
        decoder: { readers: ["ean_reader"] },
      }, (err) => {
        if (err) {
          console.error("Quagga initialization error: ", err);
          return;
        }
        console.log("Quagga initialized successfully");
        Quagga.start();
        
      });
    };
    setIsScanning(true);
    initQuagga();

    Quagga.onDetected(({ codeResult }) => {
      const barcode = codeResult.code;
      console.log("Barcode detected:", barcode);
      Quagga.stop(); // Stop Quagga scanning
      setIsScanning(false);
      navigate(`/barcode/${barcode}`);
    });

    return () => {
      console.log("Cleaning up Quagga");
      setIsScanning(false);
      Quagga.stop(); 
    };
  }, [navigate]);

  const handleCancelScan = () => {
    console.log("Cancel button clicked");
    setIsScanning(false);
    Quagga.stop(); 
  };

  return (
    <div className="scan-section">
      <div className="small-card-user-container" onClick={() => navigate('/dietaryprofile')}>
        <img src={dadi} alt="User  Avatar" className="user-avatar-small-card" />
        <div className="user-info-small-card">
          <p className="welcome-text-small-card">Welcome Back,</p>
          <p className="username-small-card">John Doe</p>
        </div>
        <FaChevronDown color="gray" className="arrow-down" />
      </div>

      <div className="scan-title">
        <h2>Scan product here<span><FaArrowDown /></span></h2>
      </div>

      <div className="scan-container">
        <video ref={videoRef} style={{ width: '100%', height: '400px', border: '1px solid black' }} autoPlay muted />
      </div>

      <button onClick={handleCancelScan} className="cancel-scan-button">Cancel Scan</button>
    </div>
  );
};

export default Scanner;