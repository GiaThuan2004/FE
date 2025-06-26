import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../Api";

export default function FavoriteRecipes() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/favorites");
        setFavorites(data);
      } catch {
        alert("Không lấy được danh sách công thức yêu thích");
      }
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Công thức yêu thích</h2>
      {favorites.length === 0 ? (
        <p>Bạn chưa có công thức yêu thích nào.</p>
      ) : (
        <div className="grid-cols-3">
          {favorites.map((recipe) => (
            <div key={recipe.id} className="card">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-[120px] h-[120px] object-cover mx-auto mb-2"
              />
              <h3 className="text-sm font-medium">{recipe.title}</h3>
              <Link
                to={`/recipe/${recipe.id}`}
                className="text-blue-600 hover:underline text-sm mt-1 inline-block"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}