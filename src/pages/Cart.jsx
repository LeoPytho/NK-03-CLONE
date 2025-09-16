import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";

function Cart() {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  // Function to get cart items from localStorage
  const getCartItems = () => {
    try {
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      return cartData;
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  };

  // Function to save cart items to localStorage
  const saveCartItems = (items) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      // Trigger event untuk update header cart count
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  // Load cart items on component mount
  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
    setLoading(false);
  }, []);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Update quantity of cart item
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) return;

    const updatedItems = cartItems.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCartItems(updatedItems);
    saveCartItems(updatedItems);
    showToast('Jumlah produk berhasil diupdate');
  };

  // Remove item from cart
  const removeFromCart = (productId, productName) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    saveCartItems(updatedItems);
    showToast(`${productName} berhasil dihapus dari keranjang`);
  };

  // Clear entire cart
  const clearCart = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh keranjang?')) {
      setCartItems([]);
      saveCartItems([]);
      showToast('Keranjang berhasil dikosongkan');
    }
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate total items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Keranjang kosong, silakan tambahkan produk terlebih dahulu', 'error');
      return;
    }

    // You can implement checkout logic here
    // For now, just show a message and navigate
    showToast('Menuju ke halaman checkout...', 'success');
    setTimeout(() => {
      // navigate('/checkout');
      console.log('Checkout with items:', cartItems);
    }, 1500);
  };

  // Handle buy single item
  const handleBuyItem = (item) => {
    console.log('Buy single item:', item);
    // navigate(`/purchase/${item.id}`);
    showToast(`Menuju ke halaman pembelian ${item.name}...`);
  };

  // Continue shopping
  const continueShopping = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="cart-loading">
          <div className="loading-spinner"></div>
          <p>Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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

      <div className="container">
        <div className="cart-header">
          <h1><FaShoppingCart /> Keranjang Belanja</h1>
          <p>{getTotalItems()} item dalam keranjang</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <FaShoppingCart />
            </div>
            <h2>Keranjang Anda Kosong</h2>
            <p>Belum ada produk yang ditambahkan ke keranjang</p>
            <button 
              className="btn btn-primary"
              onClick={continueShopping}
            >
              Mulai Berbelanja
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image_url} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">
                      Rp {item.price.toLocaleString()}
                    </p>
                    <p className="cart-item-added">
                      Ditambahkan: {new Date(item.addedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>

                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <div className="item-total">
                      <strong>Rp {(item.price * item.quantity).toLocaleString()}</strong>
                    </div>

                    <div className="item-actions">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleBuyItem(item)}
                      >
                        Beli
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => removeFromCart(item.id, item.name)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Ringkasan Belanja</h3>
                <div className="summary-row">
                  <span>Total Item:</span>
                  <span>{getTotalItems()} item</span>
                </div>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>Rp {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="summary-row total">
                  <span><strong>Total:</strong></span>
                  <span><strong>Rp {getTotalPrice().toLocaleString()}</strong></span>
                </div>

                <div className="summary-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={continueShopping}
                  >
                    Lanjut Belanja
                  </button>
                  <button 
                    className="btn btn-primary btn-full"
                    onClick={handleCheckout}
                  >
                    Checkout Semua
                  </button>
                  <button 
                    className="btn btn-danger btn-outline"
                    onClick={clearCart}
                  >
                    Kosongkan Keranjang
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .cart-header {
          margin-bottom: 30px;
          text-align: center;
        }

        .cart-header h1 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #333;
          margin-bottom: 10px;
        }

        .cart-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-cart {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-cart-icon {
          font-size: 80px;
          color: #ccc;
          margin-bottom: 20px;
        }

        .empty-cart h2 {
          color: #666;
          margin-bottom: 10px;
        }

        .empty-cart p {
          color: #888;
          margin-bottom: 30px;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cart-item {
          display: flex;
          gap: 20px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .cart-item-image {
          flex-shrink: 0;
        }

        .cart-item-image img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
        }

        .cart-item-details {
          flex: 1;
        }

        .cart-item-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        .cart-item-price {
          font-size: 16px;
          color: #007bff;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .cart-item-added {
          font-size: 12px;
          color: #666;
        }

        .cart-item-controls {
          display: flex;
          flex-direction: column;
          gap: 15px;
          align-items: flex-end;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .qty-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .qty-btn:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: #007bff;
        }

        .qty-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity {
          min-width: 40px;
          text-align: center;
          font-weight: bold;
        }

        .item-total {
          font-size: 16px;
          color: #333;
        }

        .item-actions {
          display: flex;
          gap: 8px;
        }

        .summary-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 25px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 20px;
        }

        .summary-card h3 {
          margin-bottom: 20px;
          color: #333;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 8px;
        }

        .summary-row.total {
          border-top: 2px solid #ddd;
          padding-top: 15px;
          margin-top: 15px;
          font-size: 18px;
        }

        .summary-actions {
          margin-top: 25px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn {
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-outline {
          background: transparent;
          border: 2px solid #007bff;
          color: #007bff;
        }

        .btn-outline:hover {
          background: #007bff;
          color: white;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .btn-sm {
          padding: 8px 12px;
          font-size: 12px;
        }

        .btn-full {
          width: 100%;
        }

        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          max-width: 400px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideIn 0.3s ease-out;
        }

        .toast-success {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .toast-error {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }

        .toast-content {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          gap: 10px;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .cart-content {
            grid-template-columns: 1fr;
          }

          .cart-item {
            flex-direction: column;
            gap: 15px;
          }

          .cart-item-image img {
            width: 100px;
            height: 100px;
          }

          .cart-item-controls {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .summary-card {
            position: static;
          }
        }
      `}</style>
    </>
  );
}

export default Cart;
