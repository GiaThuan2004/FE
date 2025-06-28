import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../Api";
import "./mealplanner.css";

export default function MealPlanner() {
  const [mealPlan, setMealPlan] = useState({
    "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [],
    "Friday": [], "Saturday": [], "Sunday": []
  });
  const [recipes, setRecipes] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data: planData } = await api.get("/mealPlan");
        setMealPlan(planData);
        const { data: recipeData } = await api.get("/recipes");
        setRecipes(recipeData);
      } catch (err) {
        toast.error("Không thể tải dữ liệu kế hoạch hoặc công thức.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const calculateNutrition = (recipes) => {
    return recipes.reduce(
      (acc, recipe) => ({
        calories: acc.calories + (recipe.nutrition?.calories || 0),
        protein: acc.protein + (recipe.nutrition?.protein || 0),
        fat: acc.fat + (recipe.nutrition?.fat || 0),
        carbs: acc.carbs + (recipe.nutrition?.carbs || 0),
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    if (!selectedRecipeId) {
      toast.error("Vui lòng chọn một công thức.");
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await api.post("/mealPlan", { day: selectedDay, recipeId: parseInt(selectedRecipeId) });
      setMealPlan((prevPlan) => ({
        ...prevPlan,
        [selectedDay]: data.plan
      }));
      toast.success("Thêm công thức vào kế hoạch thành công!");
    } catch (err) {
      toast.error(err.message || "Thêm công thức thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = async (day, recipeId) => {
    setIsLoading(true);
    try {
      await api.delete("/mealPlan", { day, recipeId });
      setMealPlan((prevPlan) => {
        const updatedDayPlan = prevPlan[day].filter((r) => r.id !== recipeId);
        return { ...prevPlan, [day]: updatedDayPlan };
      });
      toast.success("Xóa công thức khỏi kế hoạch thành công!");
    } catch (err) {
      toast.error(err.message || "Xóa công thức thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center p-4">Đang tải...</div>;

  return (
    <div className="mealplanner-container">
      <div className="mealplanner-wrapper">
        <h2>Lập Kế Hoạch Ăn Uống</h2>
        <div className="mealplanner-form">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            aria-label="Chọn ngày"
          >
            {Object.keys(mealPlan).map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <select
            value={selectedRecipeId}
            onChange={(e) => setSelectedRecipeId(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            aria-label="Chọn công thức"
          >
            <option value="">Chọn công thức</option>
            {recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
            ))}
          </select>
          <button
            onClick={handleAddRecipe}
            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={isLoading}
            aria-label="Thêm công thức vào kế hoạch"
          >
            {isLoading ? "Đang xử lý..." : "Thêm Công Thức"}
          </button>
        </div>
        <div className="day-grid">
          {Object.keys(mealPlan).map((day) => (
            <div key={day} className="day-card">
              <h3>{day}</h3>
              {mealPlan[day].length === 0 ? (
                <p>Chưa có công thức.</p>
              ) : (
                <>
                  <ul className="list-disc pl-5">
                    {mealPlan[day].map((recipe) => (
                      <li key={recipe.id} className="mb-2">
                        {recipe.title}
                        <button
                          onClick={() => handleDeleteRecipe(day, recipe.id)}
                          className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                          aria-label={`Xóa công thức ${recipe.title} khỏi kế hoạch ngày ${day}`}
                        >
                          Xóa
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <h4 className="font-semibold">Tổng dinh dưỡng:</h4>
                    <p>Calories: {calculateNutrition(mealPlan[day]).calories} kcal</p>
                    <p>Protein: {calculateNutrition(mealPlan[day]).protein}g</p>
                    <p>Fat: {calculateNutrition(mealPlan[day]).fat}g</p>
                    <p>Carbs: {calculateNutrition(mealPlan[day]).carbs}g</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}