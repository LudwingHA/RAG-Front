import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sendMessage = (query) => {
  return API.post("/chat", null, {
    params: { query },
  });
};

export const getHistory = () => {
  return API.get("/chat/history");
};