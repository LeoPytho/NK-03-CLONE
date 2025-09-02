import React from "react";
import "../styles/header.css";
import { FaPhone, FaEnvelope, FaBell, FaShoppingCart } from "react-icons/fa";

const Header = () => {
  return (
    <header>
      <div className="top-bar">
        <div>
          <FaPhone className="phone-icon" />0852-1514-7628
          <FaEnvelope className="ml" /> support@nayrakuen.com
        </div>
        <div>
          <a href="#">Tentang Nayrakuen Shop</a>
        </div>
      </div>

      <nav className="navbar">
        <div className="logo">
          <span className="logo-bold">Nayrakuen</span> Shop
        </div>
        <div className="nav-icons">
          <FaBell />
          <FaShoppingCart />
        </div>
      </nav>
    </header>
  );
};

export default Header;
