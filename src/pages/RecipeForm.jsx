import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Api";

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState({
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

  useEffect(() => {
    if (id) {
      (async () => {
        setIsLoading(true);
        try {
          const { data } = await api.get(`/recipes/${id}`);
          setRecipe(data);
        } catch {
          toast.error("Không lấy được công thức");
        } finally {
          setIsLoading(false);
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
        nutrition: { ...prev.nutrition, [key]: Number(value) || 0 }
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
    setIsLoading(true);
    try {
      if (id) {
        await api.post(`/recipes/:${id}`, recipe); // Use POST for mockApi compatibility
        toast.success("Cập nhật công thức thành công!");
      } else {
        await api.post("/recipes", recipe);
        toast.success("Thêm công thức thành công!");
      }
      navigate("/");
    } catch {
      toast.error("Lưu công thức thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center p-4">Đang tải...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">{id ? "Sửa công thức" : "Tạo công thức"}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Tiêu đề</label>
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề"
            value={recipe.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            aria-label="Tiêu đề công thức"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Mô tả</label>
          <textarea
            name="description"
            placeholder="Mô tả"
            value={recipe.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            aria-label="Mô tả công thức"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium">Danh mục</label>
          <select
            name="category"
            value={recipe.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            aria-label="Danh mục công thức"
          >
            <option value="">Chọn danh mục</option>
            <option value="Món chính">Món chính</option>
            <option value="Món khai vị">Món khai vị</option>
            <option value="Tráng miệng">Tráng miệng</option>
          </select>
        </div>
        <div>
          <label htmlFor="cookingTime" className="block text-sm font-medium">Thời gian nấu (phút)</label>
          <input
            type="number"
            name="cookingTime"
            placeholder="Thời gian nấu (phút)"
            value={recipe.cookingTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            aria-label="Thời gian nấu"
          />
        </div>
        <div>
          <label htmlFor="servings" className="block text-sm font-medium">Khẩu phần</label>
          <input
            type="number"
            name="servings"
            placeholder="Khẩu phần"
            value={recipe.servings}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            aria-label="Khẩu phần"
          />
        </div>
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
              aria-label={`Nguyên liệu ${idx + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            aria-label="Thêm nguyên liệu"
          >
            Thêm nguyên liệu
          </button>
        </div>
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium">Hướng dẫn</label>
          <textarea
            name="instructions"
            placeholder="Hướng dẫn"
            value={recipe.instructions}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            aria-label="Hướng dẫn nấu ăn"
          />
        </div>
        <div>
          <h3 className="font-semibold">Dinh dưỡng</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="nutrition.calories"
              placeholder="Calories (kcal)"
              value={recipe.nutrition.calories}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              aria-label="Calories"
            />
            <input
              type="number"
              name="nutrition.protein"
              placeholder="Protein (g)"
              value={recipe.nutrition.protein}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              aria-label="Protein"
            />
            <input
              type="number"
              name="nutrition.fat"
              placeholder="Fat (g)"
              value={recipe.nutrition.fat}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              aria-label="Chất béo"
            />
            <input
              type="number"
              name="nutrition.carbs"
              placeholder="Carbs (g)"
              value={recipe.nutrition.carbs}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              aria-label="Carbohydrate"
            />
          </div>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium">URL hình ảnh</label>
          <input
            type="text"
            name="image"
            placeholder="URL hình ảnh"
            value={recipe.image}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            aria-label="URL hình ảnh"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
          aria-label={id ? "Cập nhật công thức" : "Tạo công thức"}
        >
          {isLoading ? "Đang xử lý..." : (id ? "Cập nhật" : "Tạo")}
        </button>
      </div>
    </div>
    
  );
}