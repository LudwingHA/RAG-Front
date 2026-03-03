import React from "react";
import { Link } from "react-router-dom";
import { 
  FaRobot, 
  FaComments, 
  FaRoad, 
  FaQuestionCircle, 
  FaSignInAlt, 
  FaUserPlus,
  FaUserCircle
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {

  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-[var(--color-primary)] bg-[var(--bg-gradiant-sict)] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-xl font-semibold tracking-wide hover:opacity-90 transition"
          >
            <FaRobot className="text-[var(--color-secondary)] text-2xl" />
            <span>SICT - Inteligencia Artificial</span>
          </Link>

          {/* Menú */}
          <div className="hidden md:flex gap-8 text-sm font-medium">

            <Link 
              to="/" 
              className="flex items-center gap-2 hover:text-[var(--color-secondary)] transition duration-300"
            >
              <FaComments />
              Chat
            </Link>

            <Link 
              to="/baches" 
              className="flex items-center gap-2 hover:text-[var(--color-secondary)] transition duration-300"
            >
              <FaRoad />
              Analizador de Baches
            </Link>

            <Link 
              to="/ayuda" 
              className="flex items-center gap-2 hover:text-[var(--color-secondary)] transition duration-300"
            >
              <FaQuestionCircle />
              Ayuda
            </Link>

          </div>

          {/* Auth */}
          <div className="hidden md:flex gap-6 text-sm items-center">

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <FaUserCircle className="text-[var(--color-secondary)] text-lg" />
                  <span className="font-medium">
                    {user?.first_name} {user?.last_name}
                  </span>
                </div>

                <button 
                  onClick={logout}
                  className="hover:text-[var(--color-secondary)] transition"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 hover:text-[var(--color-secondary)] transition duration-300"
                >
                  <FaSignInAlt />
                  Iniciar Sesión
                </Link>

                <Link 
                  to="/register" 
                  className="flex items-center gap-2 
                            bg-[var(--color-secondary)] 
                            hover:bg-[var(--color-secondary-light)] 
                            text-black px-4 py-1.5 rounded-md 
                            transition duration-300"
                >
                  <FaUserPlus />
                  Registrarse
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};