import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/product-details.css";

const products = [
  { id: 1, name: "Kaos JKT48 Birthday T-Shirt", price: 199000, image: "/img/product.jpg", detail: "Kaos eksklusif JKT48 edisi ulang tahun." },
  { id: 2, name: "Kaos JKT48 Hoodie", price: 250000, image: "/img/product.jpg", detail: "Hoodie nyaman dengan desain JKT48." },
  { id: 3, name: "Kaos JKT48 Polo Shirt", price: 180000, image: "/img/product.jpg", detail: "Polo shirt kasual untuk fans JKT48." },
];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  const product = products.find((p) => p.id === parseInt(id));

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [id]);

  if (!product) return <p>Produk tidak ditemukan</p>;

  const handleBuyNow = () => {
    setBuying(true);
    setTimeout(() => {
      navigate(`/purchase/${product.id}`);
    }, 1500);
  };

  return (
    <div className="product-detail container">
      {loading ? (
        <div className="product-detail-grid">
          <div className="skeleton-img"></div>
          <div className="product-info">
            <div className="skeleton-text long"></div>
            <div className="skeleton-text short"></div>
            <div className="skeleton-text long"></div>
            <div className="skeleton-text short"></div>
          </div>
        </div>
      ) : (
        <div className="product-detail-grid">
          <div className="product-image-wrapper">
            <img src={product.image} alt={product.name} className="product-image" />
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price">Rp {product.price.toLocaleString()}</p>

            <div className="product-actions">
              <button className="btn btn-cart">Masukkan Keranjang</button>
              <button
                className={`btn btn-buy ${buying ? "loading-ring" : ""}`}
                onClick={handleBuyNow}
                disabled={buying}
              >
                {buying ? <span className="ring"></span> : "Beli Sekarang"}
              </button>
            </div>

            <div className="product-section">
              <h3>Detail Produk</h3>
              <p>{product.detail}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
