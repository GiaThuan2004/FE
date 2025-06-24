import React, { useEffect, useState } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const storedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    setOrders(storedOrders);
    setRatings(storedRatings);
  }, []);

  const handleRatingChange = (orderId, productName, value) => {
    const newRatings = {
      ...ratings,
      [`${orderId}-${productName}`]: value,
    };
    setRatings(newRatings);
    localStorage.setItem("ratings", JSON.stringify(newRatings));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h2>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-4 mb-6 rounded shadow">
            <div className="mb-2 font-semibold">Ngày đặt: {order.date}</div>
            <div className="mb-2">Khách hàng: {order.user.name}</div>
            <div className="mb-2">Địa chỉ: {order.user.address}</div>
            <div className="mb-2">SĐT: {order.user.phone}</div>
            <ul className="list-disc pl-5">
              {order.items.map((item, idx) => (
                <li key={idx} className="mb-1">
                  {item.name} - {item.quantity} x {item.price.toLocaleString()}đ
                  <div className="mt-1">
                    { <label className="mr-2">Đánh giá:</label> }
                    { <select
                      value={ratings[`${order.id}-${item.name}`] || ""}
                      onChange={(e) => handleRatingChange(order.id, item.name, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="">Chọn sao</option>
                      <option value="1">1 ⭐</option>
                      <option value="2">2 ⭐⭐</option>
                      <option value="3">3 ⭐⭐⭐</option>
                      <option value="4">4 ⭐⭐⭐⭐</option>
                      <option value="5">5 ⭐⭐⭐⭐⭐</option>
                    </select> }
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-2 text-right font-semibold">
              Tổng: {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}đ
            </div>
          </div>
        ))
      )}
    </div>
  );
}