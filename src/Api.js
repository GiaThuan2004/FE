import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,          // bỏ nếu BE không dùng cookie-session
  headers: { "Content-Type": "application/json" },
});

// Tự gắn token cho mọi request nếu đã login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
