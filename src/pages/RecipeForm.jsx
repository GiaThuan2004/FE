import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Api";

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: "",
    category: "",
    cookingTime: "",
    servings: "",
    ingredients: [""],
    instructions: "",
    nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0 },
    image: "",
  });

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const { data } = await api.get(`/recipes/${id}`);
          setRecipe(data);
        } catch {
          alert("Không lấy được công thức");
        }
      })();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("nutrition")) {
      const key = name.split(".")[1];
      setRecipe((prev) => ({
        ...prev,
        nutrition: { ...prev.nutrition, [key]: Number(value) }
      }));
    } else {
      setRecipe((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setRecipe((prev) => ({ ...prev, ingredients: [...prev.ingredients, ""] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/recipes/${id}`, recipe);
      } else {
        await api.post("/recipes", recipe);
      }
      navigate("/");
    } catch {
      alert("Lưu công thức thất bại");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">{id ? "Sửa công thức" : "Tạo công thức"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Tiêu đề"
          value={recipe.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          name="category"
          value={recipe.category}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Chọn danh mục</option>
          <option value="Món chính">Món chính</option>
          <option value="Món khai vị">Món khai vị</option>
          <option value="Tráng miệng">Tráng miệng</option>
        </select>
        <input
          type="number"
          name="cookingTime"
          placeholder="Thời gian nấu (phút)"
          value={recipe.cookingTime}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          name="servings"
          placeholder="Khẩu phần"
          value={recipe.servings}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <div>
          <h3 className="font-semibold">Nguyên liệu</h3>
          {recipe.ingredients.map((ing, idx) => (
            <input
              key={idx}
              type="text"
              value={ing}
              onChange={(e) => handleIngredientChange(idx, e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder={`Nguyên liệu ${idx + 1}`}
            />
          ))}
          <button type="button" onClick={addIngredient} className="bg-blue-500 text-white px-4 py-2 rounded">
            Thêm nguyên liệu
          </button>
        </div>
        <textarea
          name="instructions"
          placeholder="Hướng dẫn"
          value={recipe.instructions}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <div>
          <h3 className="font-semibold">Dinh dưỡng</h3>
          <input
            type="number"
            name="nutrition.calories"
            placeholder="Calories (kcal)"
            value={recipe.nutrition.calories}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-2"
          />
          <input
            type="number"
            name="nutrition.protein"
            placeholder="Protein (g)"
            value={recipe.nutrition.protein}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-2"
          />
          <input
            type="number"
            name="nutrition.fat"
            placeholder="Fat (g)"
            value={recipe.nutrition.fat}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-2"
          />
          <input
            type="number"
            name="nutrition.carbs"
            placeholder="Carbs (g)"
            value={recipe.nutrition.carbs}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-2"
          />
        </div>
        <input
          type="text"
          name="image"
          placeholder="URL hình ảnh"
          value={recipe.image}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {id ? "Cập nhật" : "Tạo"}
        </button>
      </form>
    </div>
  );
}