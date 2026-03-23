import api from "./axios";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};


export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    // Actualizar usuario en localStorage
    if (response.data) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  console.log(passwordData)
  try {
    const response = await api.post('/profile/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};


export const getToken = () => {
  return localStorage.getItem('token');
};


export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};
