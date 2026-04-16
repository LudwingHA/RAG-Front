import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "../../layout/Layout";
import { FaSignInAlt, FaEnvelope, FaLock, FaUserShield, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {

      const result = await login(form.email, form.password);
      
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Error al iniciar sesión. Verifica tus credenciales."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] px-4 py-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#6C757D] hover:text-[#0B3B5C] mb-4 transition-colors group"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E9ECEF]">
            <div className="h-2 bg-gradient-to-r from-[var(--color-primary)] to-[#C49A6C]"></div>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[#1E4F6E] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FaUserShield className="text-4xl text-[#C49A6C]" />
                </div>
                <h2 className="text-2xl font-bold text-[#212529]">
                  Acceso Institucional
                </h2>
                <p className="text-sm text-[#6C757D] mt-1">
                  Secretaría de Infraestructura, Comunicaciones y Transportes
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-[#DC3545]/10 border border-[#DC3545]/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#DC3545]/20 rounded-lg flex items-center justify-center">
                      <span className="text-[#DC3545] text-lg">!</span>
                    </div>
                    <p className="text-sm text-[#DC3545] font-medium">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#495057] mb-2">
                    Correo Electrónico Institucional
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-[#ADB5BD]" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-[#E9ECEF] rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent
                               bg-[#F8F9FA] text-[#212529] placeholder-[#ADB5BD]
                               transition-all"
                      placeholder="usuario@sict.gob.mx"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-[#495057]">
                      Contraseña
                    </label>
                    <Link
                      to="/recuperar-contrasena"
                      className="text-xs text-[#C49A6C] hover:text-[#0B3B5C] transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-[#ADB5BD]" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-[#E9ECEF] rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent
                               bg-[#F8F9FA] text-[#212529] placeholder-[#ADB5BD]
                               transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[#1E4F6E] 
                           hover:from-[#C49A6C] hover:to-[#7f5d38]
                           text-white py-3.5 rounded-xl font-medium 
                           transition-all duration-300 disabled:opacity-60
                           shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                           flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Verificando credenciales...</span>
                    </>
                  ) : (
                    <>
                      <FaSignInAlt />
                      <span>Iniciar Sesión</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#E9ECEF]">
                <div className="flex items-center justify-center gap-2 text-sm text-[#6C757D]">
                  <FaUserShield className="text-[#C49A6C]" />
                  <span>Sistema exclusivo para personal autorizado</span>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-[#ADB5BD]">
                    ¿Necesitas ayuda? Contacta al
                    <button className="text-[#C49A6C] hover:text-[#0B3B5C] ml-1 font-medium transition-colors">
                      departamento de sistemas
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#6C757D]">
              © 2026 Secretaría de Infraestructura, Comunicaciones y Transportes
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};