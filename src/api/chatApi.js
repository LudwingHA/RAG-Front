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

export const sendMessage = (query, conversationId = null) => {
  return API.post("/chat", { query, conversation_id: conversationId });
};

export const getHistory = () => {
  return API.get("/chat/history");
};
export const getConversations = () => API.get("/conversations");
export const getConversation = (id) => API.get(`/conversations/${id}`);
export const deleteConversation = (id) => API.delete(`/conversations/${id}`);
