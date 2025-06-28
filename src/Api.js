// src/Api.js
import axios from "axios";
import mockApi from "./data/mockBackend.js";

const isMock = process.env.NODE_ENV === "development" || process.env.REACT_APP_USE_MOCK === "true";
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

const api = {
  get: async (url) => {
    try {
      if (isMock) return await mockApi.get(url);
      return await axiosInstance.get(url);
    } catch (error) {
      console.error("Lỗi API GET:", error.message);
      throw error.response?.data || { message: error.message };
    }
  },
  post: async (url, data) => {
    try {
      if (isMock) return await mockApi.post(url, data);
      return await axiosInstance.post(url, data);
    } catch (error) {
      console.error("Lỗi API POST:", error.message);
      throw error.response?.data || { message: error.message };
    }
  },
  delete: async (url, data) => {
    try {
      if (isMock) return await mockApi.delete(url, data);
      return await axiosInstance.delete(url, { data });
    } catch (error) {
      console.error("Lỗi API DELETE:", error.message);
      throw error.response?.data || { message: error.message };
    }
  }
};

export default api;