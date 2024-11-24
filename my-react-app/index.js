// index.js (entry point of your React app)

import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18's root API
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import App from './App';  // Import your App component

// Wrap App inside BrowserRouter here (not inside App.jsx)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
