import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Api";
import "./register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", { email, password, name });
      toast.success(data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <div className="text-center">
          <h2>Đăng Ký</h2>
          <p>Tạo tài khoản mới để bắt đầu</p>
        </div>
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="name">Họ tên</label>
            <input
              id="name"
              type="text"
              placeholder="Nhập họ tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
              aria-label="Email đăng ký"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
              aria-label="Mật khẩu"
            />
          </div>
          <button
            onClick={handleRegister}
            className="register-button"
            aria-label="Đăng ký"
          >
            Đăng ký
          </button>
        </div>
        <div className="link-group">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}