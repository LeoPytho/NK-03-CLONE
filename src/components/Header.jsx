import React, { useState } from "react";
import "../styles/header.css";
import { FaPhone, FaEnvelope, FaBell, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [cartCount, setCartCount] = useState(3);
  const [notificationCount, setNotificationCount] = useState(2);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCartClick = () => {
    console.log("Cart clicked");
  };

  const handleNotificationClick = () => {
    console.log("Notification clicked");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header>
      {/* Top Bar */}
      <div className="top-bar">
        <div>
          <FaPhone className="phone-icon" />0852-1514-7628
          <FaEnvelope style={{marginLeft: '20px'}} /> support@nayrakuen.com
        </div>
        <div>
          <a href="#">Tentang Nayrakuen Shop</a>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-bold">Nayrakuen</span> Shop
        </div>
        
        <div className="nav-icons">
          <button onClick={handleNotificationClick}>
            <FaBell />
            {notificationCount > 0 && (
              <span className="badge">{notificationCount}</span>
            )}
          </button>
          
          <button onClick={handleCartClick}>
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="badge">{cartCount}</span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-icons">
            <button className="mobile-icon-button" onClick={handleNotificationClick}>
              <FaBell className="icon" />
              <span>Notifikasi</span>
              {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
            </button>
            
            <button className="mobile-icon-button" onClick={handleCartClick}>
              <FaShoppingCart className="icon" />
              <span>Keranjang</span>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </div>
          
          <div className="mobile-contact">
            <div>
              <FaPhone className="phone-icon" />
              <span>0852-1514-7628</span>
            </div>
            <div>
              <FaEnvelope />
              <span>support@nayrakuen.com</span>
            </div>
            <a href="#">Tentang Nayrakuen Shop</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
