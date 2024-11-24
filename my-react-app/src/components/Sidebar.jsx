import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // useNavigate for programmatic navigation
import { FaHome, FaUser, FaClipboardList, FaHeart, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Sidebar.css';
import logo from '../assets/mainLogo.png';

const Sidebar = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="sidebar">
      {/* Logo and Website Name */}
      <div className="logo-container-sidebar">
        <img src={logo} alt="Barcode Health Logo" className="logo-img" />
        <h2 className="website-name">Barcode Health</h2>
      </div>

      {/* Navigation Links */}
      <ul>
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaHome className="sidebar-icon"/>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dietaryprofile"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaUser className="sidebar-icon"/>
            Dietary Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/healthytips"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaInfoCircle className="sidebar-icon"/>
            Healthy Tips
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/scanhistory"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaClipboardList className="sidebar-icon"/>
            Scan History
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/favorites"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaHeart className="sidebar-icon"/>
            Favorites
          </NavLink>
        </li>
      </ul>

      {/* Log Out Button */}
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt className="sidebar-icon" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
