import React, { useState } from "react";
import { Link } from "react-router-dom";
import products from "../data/products";

export default function ProductList() {
  const [productList] = useState(products);

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Danh sách sản phẩm</h2>
      <div className="grid grid-cols-3 gap-6">
        {productList.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow rounded overflow-hidden text-center p-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-[120px] h-[120px] object-cover mx-auto mb-2"
            />
            <h3 className="text-sm font-medium h-10 overflow-hidden leading-tight">{product.name}</h3>
            <p className="text-red-600 font-bold text-sm">
              {product.price.toLocaleString()}đ
            </p>
            {product.oldPrice && (
              <p className="text-gray-400 line-through text-sm">
                {product.oldPrice.toLocaleString()}đ
              </p>
            )}
            <Link
              to={`/product/${product.id}`}
              className="text-blue-600 hover:underline text-sm mt-1 inline-block"
            >
              Xem chi tiết
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}