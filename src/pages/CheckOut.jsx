import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", address: "", phone: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrder = {
      id: Date.now(),
      items: cart,
      user: userInfo,
      date: new Date().toLocaleString(),
    };
    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));
    localStorage.removeItem("cart");
    navigate("/orders");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Thanh toán</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={userInfo.name}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ giao hàng"
          value={userInfo.address}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={userInfo.phone}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <div className="text-right text-lg font-semibold">
          Tổng thanh toán: {total.toLocaleString()}đ
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded"
        >
          Xác nhận đặt hàng
        </button>
      </form>
    </div>
  );
}
