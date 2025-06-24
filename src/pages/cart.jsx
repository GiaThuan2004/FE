import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateQuantity = (id, amount) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Giỏ hàng</h2>
      {cart.length === 0 ? (
        <p>Không có sản phẩm nào trong giỏ hàng.</p>
      ) : (
        <>
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Sản phẩm</th>
                <th className="px-4 py-2">Giá</th>
                <th className="px-4 py-2">Số lượng</th>
                <th className="px-4 py-2">Tổng</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.price.toLocaleString()}đ</td>
                  <td className="px-4 py-2 flex gap-2 items-center">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2">-</button>
                    {item.quantity}
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2">+</button>
                  </td>
                  <td className="px-4 py-2">{(item.price * item.quantity).toLocaleString()}đ</td>
                  <td className="px-4 py-2">
                    <button onClick={() => removeItem(item.id)} className="text-red-500">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-4">
            <p className="text-lg font-semibold">Tổng cộng: {total.toLocaleString()}đ</p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Tiến hành thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
}