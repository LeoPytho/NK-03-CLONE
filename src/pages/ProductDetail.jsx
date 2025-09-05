import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/product-details.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://backend-seven-nu-19.vercel.app/api/merchant/products/${id}`
        );
        const data = await res.json();

        if (res.ok) {
          setProduct(data);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Gagal ambil detail produk:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (!loading && !product) return <p>Produk tidak ditemukan</p>;

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
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
            />
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
              <p>{product.description || "Tidak ada deskripsi"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
