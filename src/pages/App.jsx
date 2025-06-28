import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import RecipeList from "./RecipeList";
import RecipeForm from "./RecipeForm";
import RecipeDetail from "./RecipeDetail";
import FavoriteRecipes from "./FavoriteRecipes";
import MealPlanner from "./MealPlanner";
import ThemeToggle from "./ThemeToggle";
import PrivateRoute from "./PrivateRoute";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex space-x-4">
              <Link to="/" className="hover:underline">Danh sách công thức</Link>
              <Link to="/favorites" className="hover:underline">Yêu thích</Link>
              <Link to="/meal-planner" className="hover:underline">Kế hoạch ăn uống</Link>
              <Link to="/profile" className="hover:underline">Hồ sơ</Link>
            </div>
            <ThemeToggle />
          </div>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/recipe/new" element={<RecipeForm />} />
            <Route path="/recipe/edit/:id" element={<RecipeForm />} />
            <Route path="/favorites" element={<FavoriteRecipes />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}