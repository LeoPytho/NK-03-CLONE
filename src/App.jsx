import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import PurchaseForm from "./pages/PurchaseForm";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Success from "./pages/Success";
import Order from "./pages/Order";
import Header from "./components/Header";

function App() {
  return (
    <Router>
     <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/keranjang" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/purchase/:id" element={<PurchaseForm />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wish" element={<Wishlist />} />
        <Route path="/success" element={<Success />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </Router>
  );
}

export default App;
