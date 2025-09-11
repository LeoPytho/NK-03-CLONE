import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/product.css";

function ProductCard({ product }) {
  const thumbnail =
    Array.isArray(product.image_url) && product.image_url.length > 0
      ? product.image_url[0]
      : "/img/no-image.png";

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <img
        src={thumbnail}
        alt={product.name}
        className="product-img"
      />
      <div className="product-body">
        <h3 className="product-title">{product.name}</h3>

        <p className="price">
          Rp{Number(product.price || 0).toLocaleString("id-ID")}
        </p>

        <div className="product-info">
          <p>
            <FaStar color="gold" /> {product.rating || 0} | {product.sold || 0}
          </p>
          <p>
            <FaMapMarkerAlt /> {product.location || "Jakarta"}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
