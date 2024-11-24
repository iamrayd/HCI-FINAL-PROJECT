import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ScanHistory.css';
import dadi from '../assets/dadi.jpg';
import { FaChevronDown } from 'react-icons/fa';

const ScanHistory = () => {
    const navigate = useNavigate();
  
    // State to manage the active filter category and selected button
    const [filter, setFilter] = useState('all'); // Default to 'all'
    const [activeCategory, setActiveCategory] = useState('all'); // Track the active button
  
    const handleCardClick = () => {
        navigate('/dietaryprofile');  // Navigate to the DietaryProfile page when the user clicks on the card
    };
  
    // Example data for scan records
    const scanRecords = [
        {
            barcode: '1234567890123', 
            date: '2024-11-18', 
            product: 'Apple', 
            productInfo: 'View Info', 
            price: '$1.50', 
            status: 'Safe', 
            isAllergy: false
        },
        {
            barcode: '9876543210123', 
            date: '2024-11-17', 
            product: 'Peanut Butter', 
            productInfo: 'View Info', 
            price: '$3.75', 
            status: 'Allergy Detected', 
            isAllergy: true
        },
        {
            barcode: '4567891234567', 
            date: '2024-11-16', 
            product: 'Orange Juice', 
            productInfo: 'View Info', 
            price: '$2.50', 
            status: 'Safe', 
            isAllergy: false
        },
        {
            barcode: '1234567890123', 
            date: '2024-11-18', 
            product: 'Apple', 
            productInfo: 'View Info', 
            price: '$1.50', 
            status: 'Safe', 
            isAllergy: false
        },
        {
            barcode: '9876543210123', 
            date: '2024-11-17', 
            product: 'Peanut Butter', 
            productInfo: 'View Info', 
            price: '$3.75', 
            status: 'Allergy Detected', 
            isAllergy: true
        },
        {
            barcode: '4567891234567', 
            date: '2024-11-16', 
            product: 'Orange Juice', 
            productInfo: 'View Info', 
            price: '$2.50', 
            status: 'Safe', 
            isAllergy: false
        },
        {
            barcode: '1234567890123', 
            date: '2024-11-18', 
            product: 'Apple', 
            productInfo: 'View Info', 
            price: '$1.50', 
            status: 'Safe', 
            isAllergy: false
        },
        {
            barcode: '9876543210123', 
            date: '2024-11-17', 
            product: 'Peanut Butter', 
            productInfo: 'View Info', 
            price: '$3.75', 
            status: 'Allergy Detected', 
            isAllergy: true
        },
        {
            barcode: '4567891234567', 
            date: '2024-11-16', 
            product: 'Orange Juice', 
            productInfo: 'View Info', 
            price: '$2.50', 
            status: 'Safe', 
            isAllergy: false
        },
        {
            barcode: '1234567890123', 
            date: '2024-11-18', 
            product: 'Apple', 
            productInfo: 'View Info', 
            price: '$1.50', 
            status: 'Safe', 
            isAllergy: false
        },
        {
            barcode: '9876543210123', 
            date: '2024-11-17', 
            product: 'Peanut Butter', 
            productInfo: 'View Info', 
            price: '$3.75', 
            status: 'Allergy Detected', 
            isAllergy: true
        },
        {
            barcode: '4567891234567', 
            date: '2024-11-16', 
            product: 'Orange Juice', 
            productInfo: 'View Info', 
            price: '$2.50', 
            status: 'Safe', 
            isAllergy: false
        },
        {
            barcode: '1234567890123', 
            date: '2024-11-18', 
            product: 'Apple', 
            productInfo: 'View Info', 
            price: '$1.50', 
            status: 'Safe', 
            isAllergy: false
        },
        {
            barcode: '9876543210123', 
            date: '2024-11-17', 
            product: 'Peanut Butter', 
            productInfo: 'View Info', 
            price: '$3.75', 
            status: 'Allergy Detected', 
            isAllergy: true
        },
        {
            barcode: '4567891234567', 
            date: '2024-11-16', 
            product: 'Orange Juice', 
            productInfo: 'View Info', 
            price: '$2.50', 
            status: 'Safe', 
            isAllergy: false
        },
        // Add more records as needed...
    ];

    // Function to filter the records based on selected category
    const filterRecords = (records, filter) => {
        if (filter === 'safe') {
            return records.filter(record => record.status === 'Safe');
        } else if (filter === 'detect') {
            return records.filter(record => record.isAllergy);
        } else {
            return records;  // For 'all', show all records
        }
    };

    // Function to handle category button click
    const handleCategoryClick = (category) => {
        setFilter(category); 
        setActiveCategory(category); // Set the clicked button as active
    };

    return (
        <div className="scan-history">
            {/* Small Card User Container */}
            <div className="small-card-user-container" onClick={handleCardClick}>
                <img
                    src={dadi} // Placeholder image, replace with actual user image
                    alt="User Avatar"
                    className="user-avatar-small-card"
                />
                <div className="user-info-small-card">
                    <p className="welcome-text-small-card">Welcome Back,</p>
                    <p className="username-small-card">John Doe</p>
                </div>
                <FaChevronDown color="gray" className="arrow-down"/>
            </div>

            <div className="scan-history-container">
                <h2>Scan History</h2>
                
                {/* Category buttons */}
                <div className="scan-history-categories">
                    <button 
                        className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
                        onClick={() => handleCategoryClick('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`category-btn ${activeCategory === 'safe' ? 'active' : ''}`}
                        onClick={() => handleCategoryClick('safe')}
                    >
                        Safe
                    </button>
                    <button 
                        className={`category-btn ${activeCategory === 'detect' ? 'active' : ''}`}
                        onClick={() => handleCategoryClick('detect')}
                    >
                        Allergies Detect
                    </button>
                </div>

                {/* Scan Records Table */}
                <div className="all-history-scan-records-container">
                    <div className="table-header">
                        <div className="table-header-item">Barcode No.</div>
                        <div className="table-header-item">Date</div>
                        <div className="table-header-item">Product</div>
                        <div className="table-header-item">Product Info</div>
                        <div className="table-header-item">Price</div>
                        <div className="table-header-item">Status</div>
                    </div>

                    {/* Table rows */}
                    {filterRecords(scanRecords, filter).map((record, index) => (
                        <div
                            key={index}
                            className= {`table-row ${record.isAllergy ? 'allergy-detected': ''}`} 
                        >
                            <div className="table-item">{record.barcode}</div>
                            <div className="table-item">{record.date}</div>
                            <div className="table-item">{record.product}</div>
                            <div className="table-item-bold">{record.productInfo}</div>
                            <div className="table-item">{record.price}</div>
                            <div key={index} className={`table-item-stats ${record.isAllergy===false ? 'safe' : ''}`}>{record.status}</div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default ScanHistory;
