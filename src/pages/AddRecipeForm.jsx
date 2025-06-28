import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddRecipeForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    cookingTime: "",
    servings: "",
    ingredients: [""],
    instructions: "",
    nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0 },
    image: "",
    rating: 0,
    comments: [],
    isFavorite: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("nutrition.")) {
      const nutritionKey = name.split(".")[1];
      setFormData({
        ...formData,
        nutrition: { ...formData.nutrition, [nutritionKey]: parseFloat(value) || 0 }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredientField = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const newId = storedRecipes.length > 0 ? Math.max(...storedRecipes.map((r) => r.id)) + 1 : 1;
    const newRecipe = { ...formData, id: newId };
    const updatedRecipes = [...storedRecipes, newRecipe];
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    alert("Công thức đã được thêm!");
    navigate(`/recipe/${newId}`);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Thêm công thức mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Tên công thức</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Danh mục</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Thời gian nấu (phút)</label>
          <input
            type="number"
            name="cookingTime"
            value={formData.cookingTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Khẩu phần</label>
          <input
            type="number"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Nguyên liệu</label>
          {formData.ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder={`Nguyên liệu ${index + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={addIngredientField}
            className="text-blue-500"
          >
            + Thêm nguyên liệu
          </button>
        </div>
        <div>
          <label className="block font-semibold">Hướng dẫn</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Thông tin dinh dưỡng</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="nutrition.calories"
              value={formData.nutrition.calories}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Calories (kcal)"
            />
            <input
              type="number"
              name="nutrition.protein"
              value={formData.nutrition.protein}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Protein (g)"
            />
            <input
              type="number"
              name="nutrition.fat"
              value={formData.nutrition.fat}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Fat (g)"
            />
            <input
              type="number"
              name="nutrition.carbs"
              value={formData.nutrition.carbs}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Carbs (g)"
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold">Hình ảnh (URL)</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Thêm công thức
        </button>
      </form>
    </div>
  );
}