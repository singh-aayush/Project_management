import axios from "axios";

// Main api base Url for better control of api
const api = axios.create({
  baseURL: "https://project-management-backend-s7w9.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
