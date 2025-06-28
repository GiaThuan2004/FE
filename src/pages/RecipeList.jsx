import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Api";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const recipesPerPage = 9;

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/recipes");
        setRecipes(data);
      } catch {
        toast.error("Không lấy được danh sách công thức");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes
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
  }, [recipes, search, category, sort]);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  if (isLoading) return <div className="text-center p-4">Đang tải...</div>;

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
          aria-label="Tìm kiếm công thức"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
          aria-label="Chọn danh mục"
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
          aria-label="Sắp xếp công thức"
        >
          <option value="date">Mới nhất</option>
          <option value="rating">Đánh giá cao</option>
          <option value="title">Theo tên</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentRecipes.map((recipe) => (
          <div key={recipe.id} className="card bg-white p-4 rounded shadow">
            <img
              src={recipe.image || "https://via.placeholder.com/120"}
              alt={recipe.title}
              className="w-[120px] h-[120px] object-cover mx-auto mb-2"
            />
            <h3 className="text-sm font-medium h-10 overflow-hidden">{recipe.title}</h3>
            <p className="text-gray-600 text-sm">{recipe.category}</p>
            <p className="text-gray-600 text-sm">{recipe.cookingTime} phút</p>
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
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"}`}
            aria-label={`Trang ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}