import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Api";
import "./profile.css";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", avatar: "", preferences: {} });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (Object.keys(storedUser).length > 0) {
          setUser(storedUser);
        } else {
          const { data } = await api.get("/profile");
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        toast.error("Không lấy được thông tin hồ sơ");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/profile", user);
      toast.success("Cập nhật hồ sơ thành công");
    } catch (err) {
      toast.error(err.message || "Cập nhật hồ sơ thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công");
    navigate("/login");
  };

  if (isLoading) return <div className="text-center p-4">Đang tải...</div>;

  return (
    <div className="profile-container">
      <div className="profile-form">
        <h2>Hồ sơ người dùng</h2>
        <p>Cập nhật thông tin cá nhân của bạn</p>
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="name">Họ tên</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Họ tên"
              value={user.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              aria-label="Họ tên"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              aria-label="Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="avatar">URL ảnh đại diện</label>
            <input
              id="avatar"
              type="text"
              name="avatar"
              placeholder="URL ảnh đại diện"
              value={user.avatar}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              aria-label="URL ảnh đại diện"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="profile-button"
              disabled={isLoading}
              aria-label="Cập nhật hồ sơ"
            >
              {isLoading ? "Đang xử lý..." : "Cập nhật"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
              aria-label="Đăng xuất"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}