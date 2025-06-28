import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Api";

export default function FavoriteRecipes() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/favorites");
        setFavorites(data);
      } catch {
        toast.error("Không lấy được danh sách công thức yêu thích");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <div className="text-center p-4">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Công thức yêu thích</h2>
      {favorites.length === 0 ? (
        <p>Bạn chưa có công thức yêu thích nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.map((recipe) => (
            <div key={recipe.id} className="card bg-white p-4 rounded shadow">
              <img
                src={recipe.image || "https://via.placeholder.com/120"}
                alt={recipe.title}
                className="w-[120px] h-[120px] object-cover mx-auto mb-2"
              />
              <h3 className="text-sm font-medium">{recipe.title}</h3>
              <Link
                to={`/recipe/${recipe.id}`}
                className="text-blue-600 hover:underline text-sm mt-1 inline-block"
                aria-label={`Xem chi tiết công thức ${recipe.title}`}
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