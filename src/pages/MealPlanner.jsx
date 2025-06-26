import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import api from "../Api";

export default function MealPlanner() {
  const [plan, setPlan] = useState({
    "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [],
    "Friday": [], "Saturday": [], "Sunday": []
  });
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/recipes");
        setRecipes(data);
      } catch {
        alert("Không lấy được danh sách công thức");
      }
    })();
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceDay = source.droppableId;
    const destDay = destination.droppableId;
    const [movedRecipe] = plan[sourceDay].splice(source.index, 1);
    plan[destDay].splice(destination.index, 0, movedRecipe);
    setPlan({ ...plan });
    localStorage.setItem("mealPlan", JSON.stringify(plan));
  };

  const addRecipeToDay = (day, recipeId) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      setPlan((prev) => ({
        ...prev,
        [day]: [...prev[day], recipe]
      }));
      localStorage.setItem("mealPlan", JSON.stringify(plan));
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Lập kế hoạch bữa ăn</h2>
      <div className="mb-4">
        <select
          onChange={(e) => addRecipeToDay("Monday", Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          <option value="">Chọn công thức</option>
          {recipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
          ))}
        </select>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="calendar-grid">
          {Object.keys(plan).map((day) => (
            <Droppable key={day} droppableId={day}>
              {(provided) => (
                <div
                  className="border p-4 rounded"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h3 className="font-semibold">{day}</h3>
                  {plan[day].map((recipe, index) => (
                    <Draggable key={recipe.id} draggableId={recipe.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          className="card mb-2"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {recipe.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}