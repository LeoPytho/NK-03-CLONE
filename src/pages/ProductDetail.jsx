import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/product-details.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://backend-seven-nu-19.vercel.app/api/merchant/products/${id}`
        );
        const data = await res.json();

        if (res.ok) {
          setProduct(data);

          if (Array.isArray(data.image_url) && data.image_url.length > 0) {
            setMainImage(data.image_url[0]);
          } else {
            setMainImage(data.image_url);
          }
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
            <div className="main-image-container">
              <img
                src={mainImage}
                alt={product.name}
                className="product-image"
              />

              {Array.isArray(product.image_url) &&
                product.image_url.length > 1 && (
                  <div className="product-thumbnails">
                    {product.image_url.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`${product.name}-${index}`}
                        className={`thumbnail ${
                          url === mainImage ? "active" : ""
                        }`}
                        onClick={() => setMainImage(url)}
                      />
                    ))}
                  </div>
                )}
            </div>
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price">
              Rp {product.price.toLocaleString()}
            </p>

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
