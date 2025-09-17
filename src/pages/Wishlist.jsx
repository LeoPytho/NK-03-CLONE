import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/wishlist.css";

function Wishlist() {
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const getWishlistItems = () => {
      try {
        const wishlistData = JSON.parse(localStorage.getItem('wishlist') || '[]');
        return wishlistData;
      } catch (error) {
        console.error('Error reading wishlist from localStorage:', error);
        return [];
      }
    };

    const items = getWishlistItems();
    setWishlistItems(items);
    setLoading(false);
  }, []);

  const saveWishlistItems = (items) => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(items));
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const removeFromWishlist = (productId, productName) => {
    const updatedItems = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedItems);
    saveWishlistItems(updatedItems);
    showToast(`${productName} berhasil dihapus dari wishlist`);
  };

  const handleBuyItem = (item) => {
    navigate(`/purchase/${item.id}`);
  };

  const handleViewProduct = (item) => {
    navigate(`/product/${item.id}`);
  };

  const continueShopping = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="wishlist-loading">
          <div className="loading-spinner"></div>
          <p>Memuat wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <div className="toast-icon">
              {toast.type === 'success' ? '✅' : '❌'}
            </div>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="wishlist-header">
        <h1>❤️ Wishlist Saya</h1>
        <p>{wishlistItems.length} produk tersimpan</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-wishlist-icon">❤️</div>
          <h2>Wishlist Anda Kosong</h2>
          <p>Belum ada produk yang ditambahkan ke wishlist</p>
          <button className="btn btn-primary" onClick={continueShopping}>
            Mulai Berbelanja
          </button>
        </div>
      ) : (
        <div className="wishlist-content">
          <div className="wishlist-items">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-item">
                <div className="wishlist-item-image" onClick={() => handleViewProduct(item)}>
                  <img src={item.image_url} alt={item.name} />
                </div>
                
                <div className="wishlist-item-details">
                  <h3 className="wishlist-item-name" onClick={() => handleViewProduct(item)}>
                    {item.name}
                  </h3>
                  <p className="wishlist-item-price">Rp {item.price.toLocaleString()}</p>
                  <p className="wishlist-item-added">
                    Ditambahkan: {new Date(item.addedAt).toLocaleDateString('id-ID')}
                  </p>
                </div>

                <div className="wishlist-item-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleBuyItem(item)}
                  >
                    Beli Sekarang
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleViewProduct(item)}
                  >
                    Lihat Detail
                  </button>
                  <button 
                    className="btn btn-danger btn-remove"
                    onClick={() => removeFromWishlist(item.id, item.name)}
                    title="Hapus dari wishlist"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="wishlist-actions">
            <button className="btn btn-primary btn-full" onClick={continueShopping}>
              Lanjut Berbelanja
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
