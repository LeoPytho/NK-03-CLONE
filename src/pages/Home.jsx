import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton"; // skeleton yang kita buat tadi

const productsData = [
  {
    id: 1,
    name: "Kaos JKT48 Birthday T-Shirt",
    price: 199000,
    image: "/img/product.jpeg",
    rating: 4.9,
    sold: "10 terjual",
    location: "Kota Depok",
  },
  {
    id: 2,
    name: "Kaos JKT48 Hoodie",
    price: 250000,
    image: "/img/product.jpeg",
    rating: 4.8,
    sold: "8 terjual",
    location: "Jakarta",
  },
  {
    id: 3,
    name: "Kaos JKT48 Polo Shirt",
    price: 180000,
    image: "/img/product.jpeg",
    rating: 4.7,
    sold: "12 terjual",
    location: "Bandung",
  },
];

function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // simulasi ambil data
    const timer = setTimeout(() => {
      setProducts(productsData);
      setLoading(false);
    }, 1500); // 1.5 detik loading

    return () => clearTimeout(timer);
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
          ? Array(3).fill(0).map((_, i) => <ProductSkeleton key={`alt-${i}`} />)
          : products.map((p) => <ProductCard key={`alt-${p.id}`} product={p} />)}
      </div>
    </div>
  );
}

export default Home;
