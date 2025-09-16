import React, { useState } from "react";
import "../styles/header.css";
import { FaPhone, FaEnvelope, FaBell, FaShoppingCart, FaUser, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [cartCount, setCartCount] = useState(3);
  const [notificationCount, setNotificationCount] = useState(2);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    kategori: false,
    akun: false,
    bantuan: false
  });

  const handleDropdownToggle = (dropdownName) => {
    setDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

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

        {/* Desktop Navigation Menu */}
        <div className="nav-menu">
          <a href="#" className="nav-link">Beranda</a>
          
          {/* Dropdown Kategori */}
          <div className="dropdown">
            <button 
              className="dropdown-toggle"
              onClick={() => handleDropdownToggle('kategori')}
            >
              Kategori <FaChevronDown />
            </button>
            <div className={`dropdown-menu ${dropdowns.kategori ? 'show' : ''}`}>
              <a href="#" className="dropdown-item">Jersey Sepak Bola</a>
              <a href="#" className="dropdown-item">Merchandise</a>
              <a href="#" className="dropdown-item">Aksesoris</a>
              <a href="#" className="dropdown-item">Koleksi Terbaru</a>
            </div>
          </div>

          <a href="#" className="nav-link">Promo</a>
          
          {/* Dropdown Bantuan */}
          <div className="dropdown">
            <button 
              className="dropdown-toggle"
              onClick={() => handleDropdownToggle('bantuan')}
            >
              Bantuan <FaChevronDown />
            </button>
            <div className={`dropdown-menu ${dropdowns.bantuan ? 'show' : ''}`}>
              <a href="#" className="dropdown-item">FAQ</a>
              <a href="#" className="dropdown-item">Cara Pemesanan</a>
              <a href="#" className="dropdown-item">Kontak Support</a>
              <a href="#" className="dropdown-item">Kebijakan Return</a>
            </div>
          </div>
        </div>
        
        {/* Right Side Icons */}
        <div className="nav-icons">
          <button className="icon-btn" onClick={handleNotificationClick}>
            <FaBell />
            {notificationCount > 0 && (
              <span className="badge">{notificationCount}</span>
            )}
          </button>
          
          <button className="icon-btn" onClick={handleCartClick}>
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="badge">{cartCount}</span>
            )}
          </button>

          {/* Dropdown Akun */}
          <div className="dropdown">
            <button 
              className="dropdown-toggle user-btn"
              onClick={() => handleDropdownToggle('akun')}
            >
              <FaUser /> <FaChevronDown />
            </button>
            <div className={`dropdown-menu ${dropdowns.akun ? 'show' : ''}`}>
              <a href="#" className="dropdown-item">Profile Saya</a>
              <a href="#" className="dropdown-item">Pesanan Saya</a>
              <a href="#" className="dropdown-item">Wishlist</a>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item">Login</a>
              <a href="#" className="dropdown-item">Daftar</a>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-links">
            <a href="#" className="mobile-nav-link">Beranda</a>
            <a href="#" className="mobile-nav-link">Jersey Sepak Bola</a>
            <a href="#" className="mobile-nav-link">Merchandise</a>
            <a href="#" className="mobile-nav-link">Aksesoris</a>
            <a href="#" className="mobile-nav-link">Promo</a>
            <a href="#" className="mobile-nav-link">FAQ</a>
          </div>
          
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

            <button className="mobile-icon-button">
              <FaUser className="icon" />
              <span>Akun Saya</span>
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
