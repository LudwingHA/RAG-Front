import React from "react";
import { Link } from "react-router-dom";
import { 
  FaRobot, 
  FaComments, 
  FaRoad, 
  FaQuestionCircle, 
  FaSignInAlt, 
  FaUserPlus,
  FaUserCircle,
  FaShieldAlt
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-[var(--color-primary)] to-[#1E4F6E] text-white shadow-lg border-b border-[#C49A6C]/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <FaRobot className="text-[#C49A6C] text-3xl group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-[#C49A6C]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">
                SICT - IA
              </span>
              <span className="text-xs text-[#C49A6C] font-medium tracking-wider">
                Secretaría de Infraestructura
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/chat" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-sm"
            >
              <FaComments className="text-[#C49A6C]" />
              Chat IA
            </Link>

            <Link 
              to="/baches" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-sm"
            >
              <FaRoad className="text-[#C49A6C]" />
              Analizador de Baches
            </Link>

            <Link 
              to="/ayuda" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-sm"
            >
              <FaQuestionCircle className="text-[#C49A6C]" />
              Ayuda
            </Link>
          </div>


          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to={"/profile"}>
                <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg border border-white/10 hover:text-[#C49A6C] hover:bg-white/10 transition-all duration-300  ">
                  <FaUserCircle className="text-[#C49A6C] text-xl" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user?.first_name} {user?.last_name}
                    </span>
                    <span className="text-xs text-white/60">Usuario SICT</span>
                  </div>
                </div></Link>

                <button 
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  <FaSignInAlt />
                  Iniciar Sesión
                </Link>

                <Link 
                  to="/register" 
                  className="flex items-center gap-2 bg-[#C49A6C] hover:bg-[#A57C52] text-[#0B3B5C] px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 shadow-lg shadow-[#C49A6C]/20"
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