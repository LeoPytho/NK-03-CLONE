import React, { useState } from "react";
import "../styles/header.css";
import { FaPhone, FaEnvelope, FaBell, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [cartCount, setCartCount] = useState(3);
  const [notificationCount, setNotificationCount] = useState(2);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCartClick = () => {
    console.log("Cart clicked");
    // Tambahkan fungsi keranjang di sini
  };

  const handleNotificationClick = () => {
    console.log("Notification clicked");
    // Tambahkan fungsi notifikasi di sini
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      {/* Top Bar - sama seperti aslinya */}
      <div className="top-bar">
        <div className="contact-info">
          <div className="contact-item">
            <FaPhone className="contact-icon phone-icon" />
            0852-1514-7628
          </div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            support@nayrakuen.com
          </div>
        </div>
        <div>
          <a href="#">Tentang Nayrakuen Shop</a>
        </div>
      </div>

      {/* Navbar - sama seperti aslinya dengan tambahan responsif */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-bold">Nayrakuen</span> Shop
          </div>

          {/* Desktop Icons */}
          <div className="desktop-icons">
            <button 
              className="icon-button"
              onClick={handleNotificationClick}
              aria-label="Notifikasi"
            >
              <FaBell />
              {notificationCount > 0 && (
                <span className="badge notification-badge">{notificationCount}</span>
              )}
            </button>
            
            <button 
              className="icon-button"
              onClick={handleCartClick}
              aria-label="Keranjang"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="badge cart-badge">{cartCount}</span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-icons">
            <button 
              className="mobile-icon-button"
              onClick={handleNotificationClick}
            >
              <FaBell className="icon" />
              <span>Notifikasi</span>
              {notificationCount > 0 && (
                <span className="badge">{notificationCount}</span>
              )}
            </button>
            
            <button 
              className="mobile-icon-button"
              onClick={handleCartClick}
            >
              <FaShoppingCart className="icon" />
              <span>Keranjang</span>
              {cartCount > 0 && (
                <span className="badge">{cartCount}</span>
              )}
            </button>
          </div>
          
          <div className="mobile-contact">
            <div className="contact-item">
              <FaPhone className="contact-icon phone-icon" />
              <span>0852-1514-7628</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>support@nayrakuen.com</span>
            </div>
            <a href="#" className="about-link">Tentang Nayrakuen Shop</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
