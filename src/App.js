import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/cart";
import Checkout from "./pages/CheckOut";
import OrderHistory from "./pages/OrderHistory";
import "./App.css";

function App() {
  return (
    <Router>
      <nav>
        <div className="logo font-bold text-xl">☕ Coffee Shop</div>
        <div>
          <Link to="/">Sản phẩm</Link>
          <Link to="/cart">Giỏ hàng</Link>
          <Link to="/orders">Lịch sử</Link>
          <Link to="/login">Đăng nhập</Link>
          <Link to="/register">Đăng ký</Link>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      
    </Router>
  );
}
export default App;
