import React, { useEffect, useState } from "react";
import api from "../Api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", avatar: "", preferences: {} });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
    (async () => {
      try {
        const { data } = await api.get("/profile");
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch {
        alert("Không lấy được thông tin hồ sơ");
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/profile", user);
      localStorage.setItem("user", JSON.stringify(user));
      alert("Cập nhật hồ sơ thành công");
    } catch {
      alert("Cập nhật hồ sơ thất bại");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Hồ sơ người dùng</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={user.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="avatar"
          placeholder="URL ảnh đại diện"
          value={user.avatar}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Cập nhật
        </button>
      </form>
    </div>
  );
}