import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../layout/Layout";
import { FaSignInAlt } from "react-icons/fa";
import { loginUser } from "../../api/authApi";
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

    try {
      setLoading(true);

      const data = await loginUser(form);

      // Guardamos JWT en contexto
      login(data.access_token, data.user);

      navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[--color-background] px-4">

        <div className="w-full max-w-md bg-[--color-card] shadow-xl rounded-xl p-8 border border-[--color-border]">

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <FaSignInAlt className="text-4xl text-[--color-secondary] mb-2" />
            <h2 className="text-2xl font-bold text-[--color-primary]">
              Acceso Institucional
            </h2>
            <p className="text-sm text-gray-500 text-center mt-1">
              Sistema Inteligente SICT
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>

            {error && (
              <div className="bg-red-100 text-red-600 text-sm p-2 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[--color-primary] mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-secondary]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[--color-primary] mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-secondary]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] hover:bg-[--color-primary-light] text-white py-2 rounded-md font-medium transition duration-300 disabled:opacity-60"
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </button>

          </form>

        </div>
      </div>
    </Layout>
  );
};