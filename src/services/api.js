import axios from "axios";

const API = axios.create({
  baseURL: "https://sharedbalance-backend-1.onrender.com/api/v1",
});

// 🔥 ADD THIS (AUTOMATIC TOKEN ATTACH)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("Sending token:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;