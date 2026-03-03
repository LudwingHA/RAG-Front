import api from "./axios";

export const sendMessage = async (query) => {
  const response = await api.get("/chat", {
    params: { query }
  });

  return response.data;
};