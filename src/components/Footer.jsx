import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/footer.css";
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaFacebook
} from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSocialClick = (platform) => {
    console.log(`Navigating to ${platform}`);
    // You can add actual social media links here
    const socialLinks = {
      instagram: 'https://instagram.com/nayrakuenshop',
      twitter: 'https://twitter.com/nayrakuenshop', 
      tiktok: 'https://tiktok.com/@nayrakuenshop',
      facebook: 'https://facebook.com/nayrakuenshop'
    };
    
    // Open in new tab
    window.open(socialLinks[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Company Info Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-bold">Nayrakuen</span> Shop
            </div>
            <p className="footer-description">
              Toko online terpercaya untuk jersey sepak bola, merchandise, dan aksesoris berkualitas. 
              Melayani pecinta sepak bola di seluruh Indonesia dengan produk original dan harga terbaik.
            </p>
            <div className="social-media">
              <h4>Ikuti Kami</h4>
              <div className="social-links">
                <button 
                  className="social-btn instagram"
                  onClick={() => handleSocialClick('instagram')}
                  title="Instagram"
                >
                  <FaInstagram />
                </button>
                <button 
                  className="social-btn twitter"
                  onClick={() => handleSocialClick('twitter')}
                  title="Twitter/X"
                >
                  <FaTwitter />
                </button>
                <button 
                  className="social-btn tiktok"
                  onClick={() => handleSocialClick('tiktok')}
                  title="TikTok"
                >
                  <FaTiktok />
                </button>
                <button 
                  className="social-btn facebook"
                  onClick={() => handleSocialClick('facebook')}
                  title="Facebook"
                >
                  <FaFacebook />
                </button>
              </div>
            </div>
          </div>
      
          {/* Contact Info Section */}
          <div className="footer-section">
            <h3 className="footer-title">Hubungi Kami</h3>
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone className="contact-icon phone-icon" />
                <div className="contact-details">
                  <span className="contact-label">Telepon</span>
                  <a href="tel:+6285215147628" className="contact-value">0852-1514-7628</a>
                </div>
              </div>
              
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <a href="mailto:support@nayrakuen.com" className="contact-value">support@nayrakuen.com</a>
                </div>
              </div>

              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div className="contact-details">
                  <span className="contact-label">Alamat</span>
                  <span className="contact-value">Jakarta, Indonesia</span>
                </div>
              </div>
            </div>


      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; 2024 Nayrakuen Shop. Semua hak cipta dilindungi.
            </p>
            <div className="footer-bottom-links">
              <button onClick={() => handleNavigation('/privacy-policy')}>Kebijakan Privasi</button>
              <span className="divider">|</span>
              <button onClick={() => handleNavigation('/syarat-ketentuan')}>Syarat & Ketentuan</button>
              <span className="divider">|</span>
              <button onClick={() => handleNavigation('/sitemap')}>Sitemap</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
