import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../layout/Layout";
import { FaUserShield } from "react-icons/fa";
import { registerUser } from "../../api/authApi";

export const Register = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    cargo: "",
    email: "",
    password: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (form.password !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      setLoading(true);

      await registerUser(form);

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");

    } catch (err) {
      setError(
        err.response?.data?.detail || 
        "Error al registrar usuario"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[--color-background] px-4">

        <div className="w-full max-w-lg bg-[--color-card] shadow-xl rounded-xl p-8 border border-[--color-border]">

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <FaUserShield className="text-4xl text-[--color-secondary] mb-2" />
            <h2 className="text-2xl font-bold text-[--color-primary]">
              Registro Institucional
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
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                required
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-secondary]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[--color-primary] mb-1">
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                required
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-secondary]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[--color-primary] mb-1">
                Cargo
              </label>
              <input
                type="text"
                name="cargo"
                required
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-secondary]"
              />
            </div>

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
                minLength={8}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-secondary]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[--color-primary] mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-secondary]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] hover:bg-[--color-primary-light] text-white py-2 rounded-md font-medium transition duration-300 disabled:opacity-60"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>

          </form>

        </div>
      </div>
    </Layout>
  );
};