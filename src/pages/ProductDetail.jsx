import React from "react";
import { useParams } from "react-router-dom";
import products from "../data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) return <div className="p-4">Sản phẩm không tồn tại.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 text-center">
      <img
        src={product.image}
        alt={product.name}
        className="w-[150px] h-[150px] object-cover mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-lg font-semibold mb-4">Giá: {product.price.toLocaleString()}đ</p>
      <button
        onClick={() => {
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const existing = cart.find((item) => item.id === product.id);
          if (existing) {
            existing.quantity++;
          } else {
            cart.push({ ...product, quantity: 1 });
          }
          localStorage.setItem("cart", JSON.stringify(cart));
          alert("Đã thêm vào giỏ hàng!");
        }}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}
