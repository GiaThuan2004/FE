import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaShareAlt } from "react-icons/fa";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  // Dữ liệu mẫu ban đầu
  const sampleRecipes = [
    {
      id: 1,
      title: "Canh chua cá lóc",
      description: "Một món canh chua đặc trưng của miền Tây Nam Bộ, thơm ngon và bổ dưỡng.",
      category: "Món soup",
      cookingTime: 40,
      servings: 3,
      ingredients: ["Cá lóc 500g", "Cà chua 2 quả", "Dứa 1/4 quả", "Me chua 1 muỗng", "Rau om"],
      instructions: "1. Làm sạch cá, cắt khúc. 2. Nấu nước dùng với me, thêm cà chua và dứa. 3. Thả cá vào, nêm nếm gia vị, thêm rau om trước khi tắt bếp.",
      nutrition: { calories: 300, protein: 25, fat: 10, carbs: 15 },
      image: "https://example.com/canh-chua.jpg",
      rating: 4.2,
      comments: [],
      isFavorite: false
    },
    {
      id: 2,
      title: "Bánh xèo giòn rụm",
      description: "Bánh xèo vàng giòn, ăn kèm rau sống và nước mắm chua ngọt.",
      category: "Món chính",
      cookingTime: 30,
      servings: 4,
      ingredients: ["Bột gạo 200g", "Nước cốt dừa 100ml", "Tôm 200g", "Đậu xanh", "Hành lá"],
      instructions: "1. Trộn bột với nước cốt dừa, để nghỉ 30 phút. 2. Nhồi đậu xanh, thêm tôm, chiên vàng trên chảo. 3. Rắc hành lá, gấp đôi bánh.",
      nutrition: { calories: 450, protein: 15, fat: 20, carbs: 55 },
      image: "https://example.com/banh-xeo.jpg",
      rating: 4.7,
      comments: [],
      isFavorite: false
    }
  ];

  useEffect(() => {
    // Lấy danh sách công thức từ localStorage hoặc sử dụng sampleRecipes
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || sampleRecipes;
    const selectedRecipe = storedRecipes.find((r) => r.id === parseInt(id));
    if (selectedRecipe) {
      setRecipe(selectedRecipe);
      setComments(selectedRecipe.comments || []);
      setIsFavorite(selectedRecipe.isFavorite || false);
      setRating(selectedRecipe.rating || 0);
    } else {
      setRecipe(null);
      alert(`Không tìm thấy công thức với ID ${id}`);
    }
  }, [id]);

  const saveToLocalStorage = (updatedRecipe) => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || sampleRecipes;
    const updatedRecipes = storedRecipes.map((r) =>
      r.id === updatedRecipe.id ? updatedRecipe : r
    );
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
  };

  const handleFavorite = () => {
    if (recipe) {
      const updatedRecipe = { ...recipe, isFavorite: !isFavorite };
      setIsFavorite(!isFavorite);
      saveToLocalStorage(updatedRecipe);
      console.log(`Đã ${isFavorite ? "bỏ" : ""} yêu thích công thức ${recipe.title}`);
    }
  };

  const handleRating = (value) => {
    if (recipe) {
      const updatedRecipe = { ...recipe, rating: value };
      setRating(value); // Cập nhật trạng thái cục bộ
      saveToLocalStorage(updatedRecipe); // Lưu vào localStorage
      console.log(`Đánh giá công thức ${recipe.title} với ${value} sao`);
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.length > 500) return alert("Bình luận tối đa 500 ký tự");
    if (recipe) {
      const newComment = { content: comment, user: "Anonymous", date: new Date().toISOString() };
      const updatedComments = [...comments, newComment];
      const updatedRecipe = { ...recipe, comments: updatedComments };
      setComments(updatedComments);
      setComment("");
      saveToLocalStorage(updatedRecipe);
      console.log(`Đã thêm bình luận cho công thức ${recipe.title}`);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Đã sao chép liên kết!");
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Chia sẻ công thức: ${encodeURIComponent(recipe.title)}`
      );
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    }
  };

  if (!recipe) return <div>Đang tải hoặc không tìm thấy công thức...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-[200px] h-[200px] object-cover mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
      <p className="text-gray-600 mb-2">{recipe.description || "Không có mô tả"}</p>
      <p className="text-gray-600 mb-2">Danh mục: {recipe.category}</p>
      <p className="text-gray-600 mb-2">Thời gian nấu: {recipe.cookingTime} phút</p>
      <p className="text-gray-600 mb-2">Khẩu phần: {recipe.servings}</p>
      <div className="mb-4">
        <h3 className="font-semibold">Nguyên liệu:</h3>
        <ul className="list-disc pl-5">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Hướng dẫn:</h3>
        <p>{recipe.instructions}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Dinh dưỡng:</h3>
        <p>Calories: {recipe.nutrition?.calories || 0} kcal</p>
        <p>Protein: {recipe.nutrition?.protein || 0}g</p>
        <p>Fat: {recipe.nutrition?.fat || 0}g</p>
        <p>Carbs: {recipe.nutrition?.carbs || 0}g</p>
      </div>
      <div className="flex space-x-4 mb-4">
        <button onClick={handleFavorite} className="flex items-center space-x-2">
          <FaHeart className={isFavorite ? "text-red-500" : "text-gray-500"} />
          <span>{isFavorite ? "Bỏ yêu thích" : "Yêu thích"}</span>
        </button>
        <div>
          <label>Đánh giá:</label>
          <select
            value={rating}
            onChange={(e) => handleRating(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            <option value="0">Chọn sao</option>
            <option value="1">1 ⭐</option>
            <option value="2">2 ⭐⭐</option>
            <option value="3">3 ⭐⭐⭐</option>
            <option value="4">4 ⭐⭐⭐⭐</option>
            <option value="5">5 ⭐⭐⭐⭐⭐</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Chia sẻ:</h3>
        <button onClick={() => handleShare("twitter")} className="mr-2">Twitter</button>
        <button onClick={() => handleShare("facebook")} className="mr-2">Facebook</button>
        <button onClick={() => handleShare("copy")}>Sao chép liên kết</button>
      </div>
      <div>
        <h3 className="font-semibold">Bình luận:</h3>
        <form onSubmit={handleComment} className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Viết bình luận (tối đa 500 ký tự)"
            className="w-full border px-3 py-2 rounded"
            maxLength={500}
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Gửi
          </button>
        </form>
        <ul className="list-disc pl-5">
          {comments.map((cmt, idx) => (
            <li key={idx}>
              {cmt.content} - {cmt.user} ({new Date(cmt.date).toLocaleDateString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}