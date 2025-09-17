import React from "react";
import { FaInstagram, FaTwitter, FaTiktok, FaFacebook } from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
  const handleSocialClick = (platform) => {
    const socialLinks = {
      instagram: "https://instagram.com/nayrakuenshop",
      twitter: "https://twitter.com/nayrakuenshop",
      tiktok: "https://tiktok.com/@nayrakuenshop",
      facebook: "https://facebook.com/nayrakuenshop",
    };
    window.open(socialLinks[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="footer footer-simple">
      <div className="footer-container footer-simple-content">
        {/* Logo + Nama */}
        <div className="footer-logo">
          <span className="logo-bold">Nayrakuen</span> Shop
        </div>

        {/* Social Media */}
        <div className="social-links">
          <button
            className="social-btn instagram"
            onClick={() => handleSocialClick("instagram")}
            title="Instagram"
          >
            <FaInstagram />
          </button>
          <button
            className="social-btn twitter"
            onClick={() => handleSocialClick("twitter")}
            title="Twitter/X"
          >
            <FaTwitter />
          </button>
          <button
            className="social-btn tiktok"
            onClick={() => handleSocialClick("tiktok")}
            title="TikTok"
          >
            <FaTiktok />
          </button>
          <button
            className="social-btn facebook"
            onClick={() => handleSocialClick("facebook")}
            title="Facebook"
          >
            <FaFacebook />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
