import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Api";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify({ email: data.email, name: data.name, avatar: data.avatar }));
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="text-center">
          <h2>Đăng Nhập</h2>
          <p>Vui lòng nhập thông tin để truy cập tài khoản của bạn</p>
        </div>
        <div className="space-y-4">
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
              aria-label="Email đăng nhập"
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
            onClick={handleLogin}
            className="login-button"
            aria-label="Đăng nhập"
          >
            Đăng nhập
          </button>
        </div>
        <div className="link-group">
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </div>
    </div>
  );
}