import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";

function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://backend-seven-nu-19.vercel.app/api/merchant/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Gagal ambil produk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container">
      <div className="banner">
        <img src="/img/banner.jpg" alt="Banner Nayrakuen Shop" />
      </div>

      <div className="section-title-img">
        <img src="/img/Produk-terbaru.png" alt="Produk Terbaru" />
      </div>

      <div className="product-grid">
        {loading
          ? Array(3).fill(0).map((_, i) => <ProductSkeleton key={i} />)
          : products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      <div className="section-title-img">
        <img src="/img/produk-lain.png" alt="Produk Lain" />
      </div>

      <div className="product-grid">
        {loading
          ? Array(3).fill(0).map((_, i) => (
              <ProductSkeleton key={`alt-${i}`} />
            ))
          : products.map((p) => (
              <ProductCard key={`alt-${p.id}`} product={p} />
            ))}
      </div>
    </div>
  );
}

export default Home;
