import { useParams } from "react-router-dom";
import "../styles/product-details.css";

const products = [
  { id: 1, name: "Kaos JKT48 Birthday T-Shirt", price: 199000, image: "/img/product.jpeg", detail: "Kaos eksklusif JKT48 edisi ulang tahun." },
  { id: 2, name: "Kaos JKT48 Hoodie", price: 250000, image: "/img/product.jpeg", detail: "Hoodie nyaman dengan desain JKT48." },
  { id: 3, name: "Kaos JKT48 Polo Shirt", price: 180000, image: "/img/product.jpeg", detail: "Polo shirt kasual untuk fans JKT48." },
];

function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) return <p>Produk tidak ditemukan</p>;

  return (
    <div className="product-detail container">
      <div className="product-detail-grid">
        
        <div className="product-image-wrapper">
          <img src={product.image} alt={product.name} className="product-image" />
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">Rp {product.price.toLocaleString()}</p>

          <div className="product-actions">
            <button className="btn btn-cart">Masukkan Keranjang</button>
            <button className="btn btn-buy">Beli Sekarang</button>
          </div>

          <div className="product-section">
            <h3>Detail Produk</h3>
            <p>{product.detail}</p>
          </div>
        </div>
      </div>

      <div className="product-description">
        <h3>Deskripsi Produk</h3>
        <p>
          {product.detail} Produk ini dibuat dengan bahan berkualitas tinggi,
          nyaman dipakai, dan cocok untuk kegiatan sehari-hari maupun acara
          spesial fans JKT48.
        </p>
      </div>
    </div>
  );
}

export default ProductDetail;
