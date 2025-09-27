import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";
import { FaPhone, FaEnvelope, FaBell, FaShoppingCart, FaUser, FaChevronDown, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(2);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [dropdowns, setDropdowns] = useState({
    kategori: false,
    akun: false,
    bantuan: false
  });

  const dropdownRefs = useRef({
    kategori: null,
    akun: null,
    bantuan: null
  });

  // Function to get cart count from localStorage
  const getCartCount = () => {
    try {
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cartData.reduce((total, item) => total + (item.quantity || 1), 0);
      return totalItems;
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return 0;
    }
  };

  // Function to check login status
  const checkAuthStatus = () => {
    try {
      // Check for login data in sessionStorage
      const loginData = JSON.parse(sessionStorage.getItem('userLogin') || 'null');
      if (loginData && loginData.isLoggedIn && loginData.token) {
        setIsLoggedIn(true);
        setUserInfo(loginData.user || { username: 'User' });
        return;
      }

      // Check for registration data in sessionStorage (auto-login after registration)
      const registrationData = JSON.parse(sessionStorage.getItem('userRegistration') || 'null');
      if (registrationData && registrationData.isRegistered) {
        setIsLoggedIn(true);
        setUserInfo({ 
          username: registrationData.username || 'User',
          ...registrationData.userData 
        });
        return;
      }

      // Check for successful registration in localStorage (persistent)
      const successfulRegData = JSON.parse(localStorage.getItem('successfulRegistration') || 'null');
      if (successfulRegData && successfulRegData.isSuccessfullyRegistered) {
        setIsLoggedIn(true);
        setUserInfo({ 
          username: successfulRegData.username || 'User',
          email: successfulRegData.email,
          full_name: successfulRegData.full_name
        });
        return;
      }

      // No valid authentication found
      setIsLoggedIn(false);
      setUserInfo(null);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    try {
      // Clear all authentication related data
      sessionStorage.removeItem('userLogin');
      sessionStorage.removeItem('userRegistration');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('successfulRegistration');
      localStorage.removeItem('registerFormData');
      
      // Reset state
      setIsLoggedIn(false);
      setUserInfo(null);
      
      // Close any open dropdowns
      setDropdowns({
        kategori: false,
        akun: false,
        bantuan: false
      });
      
      // Close mobile menu
      setIsMobileMenuOpen(false);
      
      // Navigate to home page
      navigate('/');
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Update cart count on component mount and when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    // Initial count
    updateCartCount();

    // Listen for storage changes (when cart is updated from other tabs/components)
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for custom cart update events (for same-tab updates)
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Check authentication status on component mount and when storage changes
  useEffect(() => {
    checkAuthStatus();

    // Listen for storage changes to update auth status
    const handleStorageChange = (e) => {
      if (e.key === 'userLogin' || e.key === 'userRegistration' || e.key === 'successfulRegistration') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for sessionStorage changes
    const authCheckInterval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(authCheckInterval);
    };
  }, []);

  // Also update cart count periodically (optional - for better UX)
  useEffect(() => {
    const interval = setInterval(() => {
      setCartCount(getCartCount());
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const handleDropdownToggle = (dropdownName) => {
    setDropdowns(prev => {
      const newState = {
        kategori: dropdownName === 'kategori' ? !prev.kategori : false,
        akun: dropdownName === 'akun' ? !prev.akun : false,
        bantuan: dropdownName === 'bantuan' ? !prev.bantuan : false
      };
      
      // Auto-adjust dropdown position to prevent cutoff
      setTimeout(() => {
        const dropdownElement = dropdownRefs.current[dropdownName];
        if (dropdownElement && newState[dropdownName]) {
          const dropdownMenu = dropdownElement.querySelector('.dropdown-menu');
          if (dropdownMenu) {
            const dropdownRect = dropdownElement.getBoundingClientRect();
            const menuRect = dropdownMenu.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            
            // Reset classes first
            dropdownMenu.classList.remove('dropdown-menu-right');
            
            // Check if dropdown would go off-screen to the right
            if (dropdownRect.left + 200 > viewportWidth - 20) {
              dropdownMenu.classList.add('dropdown-menu-right');
            }
          }
        }
      }, 10);
      
      return newState;
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideDropdown = Object.values(dropdownRefs.current).some(ref => 
        ref && ref.contains(event.target)
      );
      
      if (!isClickInsideDropdown) {
        setDropdowns({
          kategori: false,
          akun: false,
          bantuan: false
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu and dropdowns when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
      setDropdowns({
        kategori: false,
        akun: false,
        bantuan: false
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Modified handleCartClick function to navigate to /keranjang
  const handleCartClick = () => {
    console.log("Cart clicked - navigating to /keranjang");
    navigate('/keranjang');
  };

  const handleNotificationClick = () => {
    console.log("Notification clicked");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close all dropdowns when mobile menu is toggled
    setDropdowns({
      kategori: false,
      akun: false,
      bantuan: false
    });
  };

  // Function to handle logo/beranda click
  const handleLogoClick = () => {
    navigate('/');
  };

  const handleBerandaClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
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
        <div className="logo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
          <span className="logo-bold">Nayrakuen</span> Shop
        </div>

        {/* Desktop Navigation Menu */}
        <div className="nav-menu">
          <a href="#" className="nav-link" onClick={handleBerandaClick}>Beranda</a>
          <a href="#" className="nav-link">Promo</a>
          
          {/* Dropdown Bantuan */}
          <div 
            className="dropdown"
            ref={el => dropdownRefs.current.bantuan = el}
          >
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
          <button className="icon-btn" onClick={handleCartClick}>
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="badge">{cartCount}</span>
            )}
          </button>

          {/* Conditional rendering based on login status */}
          {isLoggedIn ? (
            /* Logged in user dropdown */
            <div 
              className="dropdown desktop-only"
              ref={el => dropdownRefs.current.akun = el}
            >
              <button 
                className="dropdown-toggle user-btn logged-in"
                onClick={() => handleDropdownToggle('akun')}
              >
                <FaUser /> 
                <span className="username">{userInfo?.username || userInfo?.full_name || 'User'}</span>
                <FaChevronDown />
              </button>
              <div className={`dropdown-menu dropdown-menu-right ${dropdowns.akun ? 'show' : ''}`}>
                <div className="dropdown-user-info">
                  <strong>{userInfo?.full_name || userInfo?.username || 'User'}</strong>
                  {userInfo?.email && <small>{userInfo.email}</small>}
                </div>
                <div className="dropdown-divider"></div>
                <a href="/profile" className="dropdown-item">Profile Saya</a>
                <a href="/myorder" className="dropdown-item">Pesanan Saya</a>
                <a href="/wish" className="dropdown-item">Wishlist</a>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item logout-btn" 
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          ) : (
            /* Not logged in - show login/register buttons */
            <div className="auth-buttons desktop-only">
              <button className="auth-btn login-btn" onClick={handleLoginClick}>
                Login
              </button>
              <button className="auth-btn register-btn" onClick={handleRegisterClick}>
                Daftar
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-links">
            <a href="#" className="mobile-nav-link" onClick={handleBerandaClick}>Beranda</a>
            <a href="#" className="mobile-nav-link">Promo</a>
            <a href="#" className="mobile-nav-link">FAQ</a>
            <a href="/myorder" className="mobile-nav-link">Pesanan Saya</a>
            <a href="/wish" className="mobile-nav-link">Wishlist</a>
            <a href="/profile" className="mobile-nav-link">Profile Saya</a>
          </div>
          
          <div className="mobile-icons">
            <button className="mobile-icon-button" onClick={handleCartClick}>
              <FaShoppingCart className="icon" />
              <span>Keranjang</span>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>

            {/* Conditional rendering for mobile auth */}
            {isLoggedIn ? (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <FaUser className="user-icon" />
                  <div className="user-details">
                    <span className="username">{userInfo?.full_name || userInfo?.username || 'User'}</span>
                    {userInfo?.email && <small className="email">{userInfo.email}</small>}
                  </div>
                </div>
                <button className="mobile-logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <button className="mobile-auth-btn login" onClick={handleLoginClick}>
                  Login
                </button>
                <button className="mobile-auth-btn register" onClick={handleRegisterClick}>
                  Daftar
                </button>
              </div>
            )}
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
