import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaLock,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { BiMaleFemale, BiUser } from "react-icons/bi";
import Allergies from "./Allergies";
import "../styles/Overlay.css";
import "../styles/SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    midint: "",
    lastname: "",
    email: "",
    gender: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [success, setSuccess] = useState("");

  const handleBackClick = () => {
    navigate("/"); 
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
      
    }));
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.firstname) newErrors.firstname = "First name is required.";
    if (!formData.lastname) newErrors.lastname = "Last name is required.";
    if (!formData.username) newErrors.username = "Username is required.";
    if (formData.midint && formData.midint.length !== 1) {
      newErrors.midint = "Middle initial must be a single character.";
    }
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Email must contain '@'.";
    }
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Check if email is already in use
      const emailCheckResponse = await axios.post(
        "http://localhost:5000/api/users/check-email",
        { email: formData.email }
      );

      if (emailCheckResponse.data.exists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email already in use.",
        }));
        return;
      }

      setIsModalVisible(true); // Open the modal to select allergies
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      setErrors({
        general: "An error occurred while checking email. Please try again.",
      });
    }
  };

  const closeModal = () => {
    setIsModalVisible(false); // Close allergies modal
  };

  const handleAllergiesSubmit = (allergies) => {
    setSelectedAllergies(allergies);
    closeModal(); 
    sendDataToBackend(allergies);
  };


  const sendDataToBackend = async (allergies) => {
    try {
      console.log("ALLERGYYYY", allergies);

      // Send data to backend API
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        firstname: formData.firstname,
        midint: formData.midint,
        lastname: formData.lastname,
        email: formData.email,
        gender: formData.gender,
        password: formData.password,
        username: formData.username,
        allergies: allergies
      });
      console.log("Backend response:", response.data);
      console.log("ALLERGYYYY", allergies);
      setSuccess("User created successfully!");
      setErrors({}); // Clear errors
      setFormData({
        firstname: "",
        midint: "",
        lastname: "",
        email: "",
        gender: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      setSelectedAllergies([]);
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      setErrors({
        general: "An error occurred while signing up. Please try again.",
      });
    }
  };

 
  return (
    <div className="signup-form">
      <button
        className="back-btn-landing back-button signup-back-btn"
        onClick={handleBackClick}
      >
        <FaArrowLeft color="black" />
      </button>
      <h1 className="signup-title">Create Account</h1>
      <form className="signup-form2" onSubmit={handleSubmit}>
        <div className="form-row">
          {/* First Name */}
          <div className="signup-input-container">
            <FaUser className="input-icon" color="black" />
            <input
              className="signup-input"
              type="text"
              name="firstname"
              placeholder="First name"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>
          {errors.firstname && (
            <span className="error-message">{errors.firstname}</span>
          )}

          {/* Gender */}
          <div className="signup-input-container">
            <BiMaleFemale className="input-icon" color="black" />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          {errors.gender && (
            <span className="error-message-right">{errors.gender}</span>
          )}
        </div>

        <div className="form-row">
          {/* Middle Initial */}
          <div className="signup-input-container">
            <FaUser className="input-icon" color="black" />
            <input
              className="signup-input"
              type="text"
              name="midint"
              placeholder="Middle initial"
              value={formData.midint}
              onChange={handleChange}
            />
          </div>
          {errors.midint && <span className="error-message">{errors.midint}</span>}

          {/* Username */}
          <div className="signup-input-container">
            <BiUser className="input-icon" color="black" />
            <input
              className="signup-input"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          {errors.username && (
            <span className="error-message-right">{errors.username}</span>
          )}
        </div>

        <div className="form-row">
          {/* Last Name */}
          <div className="signup-input-container">
            <FaUser className="input-icon" color="black" />
            <input
              className="signup-input"
              type="text"
              name="lastname"
              placeholder="Last name"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>
          {errors.lastname && (
            <span className="error-message">{errors.lastname}</span>
          )}

          {/* Password */}
          <div className="signup-input-container">
            <FaLock className="input-icon" color="black" />
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
              {showPassword ? (
                <FiEye className="password-toggle-icon2" color="black" />
              ) : (
                <FiEyeOff className="password-toggle-icon2" color="black" />
              )}
            </span>
          </div>
          {errors.password && (
            <span className="error-message-right">{errors.password}</span>
          )}
        </div>

        <div className="form-row">
          {/* Email */}
          <div className="signup-input-container">
            <FaEnvelope className="input-icon" color="black" />
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
          {errors.email && <span className="error-message">{errors.email}</span>}

          {/* Confirm Password */}
          <div className="signup-input-container">
            <FaLock className="input-icon" color="black" />
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
              {showConPassword ? (
                <FiEye className="password-toggle-icon2" color="black" />
              ) : (
                <FiEyeOff className="password-toggle-icon2" color="black" />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <span className="error-message-right">{errors.confirmPassword}</span>
          )}
        </div>

        {success && <p className="success-message">{success}</p>}

        <button type="submit" className="signup-btn2">
          Sign Up
        </button>
        <div className="signup-divider">OR</div>
        <div className="signup-social-container">
          <a href="#" className="signup-social">
            <FaFacebookF color="black" size={30} />
          </a>
          <a href="#" className="signup-social">
            <FaTwitter color="black" size={30} />
          </a>
          <a href="#" className="signup-social">
            <FaInstagram color="black" size={30} />
          </a>
        </div>
      </form>
      <Allergies
        isVisible={isModalVisible}
        onClose={closeModal}
        onSubmit={handleAllergiesSubmit}
      />
    </div>
  );
}

export default SignUp;