import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckSquare, FaRegSquare, FaFacebookF, FaTwitter, FaInstagram, FaArrowLeft } from "react-icons/fa";
import { FiMail, FiLock, FiEyeOff, FiEye } from "react-icons/fi";
import '../styles/Overlay.css';
import '../styles/Signup.css';
import '../styles/SignIn.css';

function SignIn({ onSignIn, setIsRightPanelActive }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [check, setCheck] = useState(false);
  const [error, setError] = useState(''); // State for error messages

  const handleBackClick = () => {
    console.log("Back button clicked");
    navigate('/');  
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SignIn form submitted with email:", email);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        if (onSignIn) {
          console.log("Calling onSignIn()...");
          onSignIn();
        }
        const { user } = data;
        setUsername(user.username);
        localStorage.setItem('username', user.username);
        localStorage.setItem('user_id', user.user_id);
        localStorage.setItem('email', user.email);
        navigate('/home');  
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
      <button className="back-btn-landing back-button" onClick={handleBackClick}>
        <FaArrowLeft color="black"/>
      </button>
      <h1>Login</h1>
      <div className="input-container">
        <FiMail className="input-icon" color="black" size={24}/>
        <input
          className="login-input"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
        />
      </div>
      <div className="input-container">
        <FiLock className="input-icon" size={24}/>
        <input
          className="login-input"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
        <span onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FiEye className="password-toggle-icon" color='black'/> : <FiEyeOff className="password-toggle-icon" color='black'/>}
        </span>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}

      </div>

      <button className="signin-btn" type="submit">Sign In</button>
      
      <div className="additional-options">
          <label onClick={() => setCheck(!check)}>
            {check ? <FaCheckSquare color="black"/> : <FaRegSquare color="black"/>}
            Remember me
          </label>
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </div>

      <div className="divider">OR</div>
      <div className="social-container">
        <a href="#" className="social"><FaFacebookF color="black" size={30}/></a>
        <a href="#" className="social"><FaTwitter color="black" size={30}/></a>
        <a href="#" className="social"><FaInstagram color="black" size={30 }/></a>
      </div>
    </form>
  );
}

export default SignIn;
