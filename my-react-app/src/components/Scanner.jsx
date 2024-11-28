import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Quagga from 'quagga'; // Import Quagga for barcode scanning
import '../styles/Scanner.css';
import { FaChevronDown, FaArrowDown } from 'react-icons/fa';
import dadi from '../assets/dadi.jpg';

const Scanner = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const videoRef = useRef(null);

  // Start scanning once the component is mounted
  useEffect(() => {
    if (videoRef.current) {
      // Test camera access directly first
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing camera: ", err);
        });

      if (isScanning) {
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
              readers: ["ean_reader"], // EAN-13 barcode reader
            },
          },
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
            Quagga.start();
          }
        );

        // Event listener for when a barcode is detected
        Quagga.onDetected((result) => {
          const barcode = result.codeResult.code; // Get the scanned barcode
          // Stop the scanner once the barcode is detected
          Quagga.stop();
          // Navigate to the Barcode component with the scanned barcode
          navigate(`/barcode/${barcode}`);
        });
      }
    }

    return () => {
      // Clean up QuaggaJS when the component is unmounted
      Quagga.stop();
    };
  }, [isScanning, navigate]);

  const handleCardClick = () => {
    navigate('/dietaryprofile');  // Navigate to the DietaryProfile page when the user clicks on the card
  };

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
        <FaChevronDown color="gray" className="arrow-down"/>
      </div>

      <div className="scan-title">
        <h2>Scan product here<span><FaArrowDown/></span></h2>
      </div>

      <div className="scan-container">
        {/* The camera feed will be rendered inside this container */}
        <video
          ref={videoRef}
          style={{ width: '100%', height: '400px', borderRadius: '10px' }}  // Explicit height
          autoPlay
          muted
        />
      </div>
    </div>
  );
};

export default Scanner;