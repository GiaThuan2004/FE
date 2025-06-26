import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../Api";
import mockRecipes from "../data/mockRecipes";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/recipes");
        setRecipes(data);
      } catch {
        setRecipes(mockRecipes); // Fallback to mock data
        alert("Không lấy được danh sách công thức, sử dụng dữ liệu mẫu");
      }
    })();
  }, []);

  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.ingredients.some((ing) => ing.toLowerCase().includes(search.toLowerCase()))
    )
    .filter((recipe) => (category ? recipe.category === category : true))
    .sort((a, b) => {
      if (sort === "date") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "rating") return b.rating - a.rating;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Danh sách công thức</h2>
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm công thức..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Tất cả danh mục</option>
          <option value="Món chính">Món chính</option>
          <option value="Món khai vị">Món khai vị</option>
          <option value="Tráng miệng">Tráng miệng</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="date">Mới nhất</option>
          <option value="rating">Đánh giá cao</option>
          <option value="title">Theo tên</option>
        </select>
      </div>
      <div className="grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="card">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-[120px] h-[120px] object-cover mx-auto mb-2"
            />
            <h3 className="text-sm font-medium h-10 overflow-hidden">{recipe.title}</h3>
            <p className="text-gray-600 text-sm">{recipe.category}</p>
            <p className="text-gray-600 text-sm">{recipe.cookingTime} phút</p>
            <Link
              to={`/recipe/${recipe.id}`}
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