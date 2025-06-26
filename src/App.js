import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeForm from "./pages/RecipeForm";
import MealPlanner from "./pages/MealPlanner";
import Profile from "./pages/Profile.jsx";
import PrivateRoute from "./pages/PrivateRoute.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="logo font-bold text-xl">🍳 Công thức Nấu ăn</div>
        <div className="space-x-4">
          <Link to="/" className="font-bold">Công thức</Link>
          <Link to="/create-recipe" className="font-bold">Tạo công thức</Link>
          <Link to="/meal-planner" className="font-bold">Lập kế hoạch</Link>
          <Link to="/profile" className="font-bold">Hồ sơ</Link>
          <Link to="/login" className="font-bold">Đăng nhập</Link>
          <Link to="/register" className="font-bold">Đăng ký</Link>
        </div>
      </nav>
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/create-recipe" element={<RecipeForm />} />
            <Route path="/edit-recipe/:id" element={<RecipeForm />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;