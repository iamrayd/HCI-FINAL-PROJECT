import React, {useState} from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { FiEyeOff, FiEye } from "react-icons/fi";
import { FaUser, FaEnvelope, FaLock, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'; // Import icons
import { GiHazardSign } from 'react-icons/gi';
import { BiMaleFemale, BiUser } from 'react-icons/bi';
import Allergies from "./Allergies";
import '../styles/Overlay.css';
import '../styles/SignUp.css';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    middleInitial: '',
    lastName: '',
    email: '',
    gender: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  const handleBackClick = () => {
    console.log("Back button clicked");
    navigate('/');  // Navigate back to Landing Page
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log(formData);
  };

  const openModal = () => {
    if (formData.firstName && formData.lastName && formData.username && formData.email && formData.password && formData.confirmPassword) {
      setIsModalVisible(true);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false); // Close allergies modal
  };

  const handleAllergiesSubmit = (allergies) => {
    console.log("Selected Allergies:", allergies);
    setSelectedAllergies(allergies); // Save selected allergies
    closeModal(); // Close modal
  };

  return (
    <form className="signup-form">
      <button className="back-btn-landing back-button signup-back-btn" onClick={handleBackClick}>
        <FaArrowLeft color="black"/>
      </button>
      <h1 className="signup-title">Sign Up</h1>
      <form className="signup-form2" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="signup-input-container">
            <FaUser className="input-icon" color="black"/>
            <input
              className="signup-input"
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signup-input-container">
            <BiMaleFemale className="input-icon" color="black"/>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="signup-input-container">
            <FaUser className="input-icon" color="black"/>
            <input
              className="signup-input"
              type="text"
              name="middleInitial"
              placeholder="Middle initial"
              value={formData.middleInitial}
              onChange={handleChange}
            />
          </div>
          <div className="signup-input-container">
            <BiUser className="input-icon" color="black"/>
            <input
              className="signup-input"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="signup-input-container">
            <FaUser className="input-icon" color="black"/>
            <input
              className="signup-input"
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signup-input-container">
            <FaLock className="input-icon" color="black"/>
            <input
              className="signup-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEye className="password-toggle-icon2" color="black"/> : <FiEyeOff className="password-toggle-icon2" color="black"/>}
            </span>
          </div>
        </div>
        <div className="form-row">
          <div className="signup-input-container">
            <FaEnvelope className="input-icon" color="black"/>
            <input
              className="signup-input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signup-input-container">
            <FaLock className="input-icon" color="black"/>
            <input
              className="signup-input"
              type={showConPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowConPassword(!showConPassword)}>
              {showConPassword ? <FiEye className="password-toggle-icon2" color="black"/> : <FiEyeOff className="password-toggle-icon2" color="black"/>}
            </span>
          </div>
        </div>

         {/* Display selected allergies */}
         {selectedAllergies.length > 0 && (
          <div className="selected-allergies">
            <h3>Selected Allergies:</h3>
            <ul>
              {selectedAllergies.map((allergy) => (
                <li key={allergy}>{allergy}</li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="signup-btn2" onClick={openModal}>
          Sign Up
        </button>
        <div className="signup-divider">OR</div>
      <div className="signup-social-container">
        <a href="#" className="signup-social"><FaFacebookF color="black" size={30}/></a>
        <a href="#" className="signup-social"><FaTwitter color="black" size={30}/></a>
        <a href="#" className="signup-social"><FaInstagram color="black" size={30}/></a>
      </div>
      </form>
      <Allergies
        isVisible={isModalVisible}
        onClose={closeModal}
        onSubmit={handleAllergiesSubmit}
      />
    </form>
  );
}

export default SignUp;
