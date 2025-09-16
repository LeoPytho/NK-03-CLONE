import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import PurchaseForm from "./pages/PurchaseForm";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Order from "./pages/Order";
import Header from "./components/Header";
import Cart from "./pages/Cart";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/purchase/:id" element={<PurchaseForm />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/order" element={<Order />} />
       <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
