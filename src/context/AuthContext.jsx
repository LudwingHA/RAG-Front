import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, getProfile, getCurrentUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadUser = async () => {

      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const profile = await getProfile();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } catch (error) {
        console.error('Error al cargar perfil:', error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        } else {

          const storedUser = getCurrentUser();
          if (storedUser) {
            setUser(storedUser);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      

      const response = await loginUser({ email, password });
      const { access_token, user: userData } = response;
      

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setError(null);
  };
  
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ 
        token, 
        user, 
        login, 
        logout, 
        isAuthenticated, 
        updateUser,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};