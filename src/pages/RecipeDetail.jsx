import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Api";
import { FaHeart, FaShareAlt } from "react-icons/fa";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/recipes/${id}`);
        setRecipe(data);
        setComments(data.comments || []);
        setIsFavorite(data.isFavorite || false);
        setRating(data.rating || 0);
      } catch {
        alert("Không lấy được chi tiết công thức");
      }
    })();
  }, [id]);

  const handleFavorite = async () => {
    try {
      await api.post(`/recipes/${id}/favorite`, { favorite: !isFavorite });
      setIsFavorite(!isFavorite);
    } catch {
      alert("Không thể thêm vào yêu thích");
    }
  };

  const handleRating = async (value) => {
    try {
      await api.post(`/recipes/${id}/rate`, { stars: value });
      setRating(value);
    } catch {
      alert("Không thể đánh giá");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (comment.length > 500) return alert("Bình luận tối đa 500 ký tự");
    try {
      const { data } = await api.post(`/recipes/${id}/comment`, { content: comment });
      setComments([...comments, data]);
      setComment("");
    } catch {
      alert("Không thể gửi bình luận");
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    if (platform === "copy") {
      await navigator.clipboard.writeText(url);
      alert("Đã sao chép liên kết!");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=Chia sẻ công thức: ${recipe.title}`);
    } else if (platform === "facebook") {
      windowFacbook.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
    }
  };

  if (!recipe) return <div>Đang tải...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-[200px] h-[200px] object-cover mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
      <p className="text-gray-600 mb-2">{recipe.description}</p>
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
        <p>Calories: {recipe.nutrition.calories} kcal</p>
        <p>Protein: {recipe.nutrition.protein}g</p>
        <p>Fat: {recipe.nutrition.fat}g</p>
        <p>Carbs: {recipe.nutrition.carbs}g</p>
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
            <li key={idx}>{cmt.content} - {cmt.user} ({cmt.date})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}