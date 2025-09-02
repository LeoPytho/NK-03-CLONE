import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/product.css";

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <img src={product.image} alt={product.name} className="product-img" />
      <div className="product-body">
        <h3 className="product-title">{product.name}</h3>
        <p className="price">Rp{product.price.toLocaleString()}</p>
        <div className="product-info">
          <p>
            <FaStar color="gold" /> {product.rating} | {product.sold}
          </p>
          <p>
            <FaMapMarkerAlt /> {product.location}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
