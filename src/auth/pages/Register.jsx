import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "../../layout/Layout";
import {
  FaUserShield,
  FaUser,
  FaEnvelope,
  FaLock,
  FaBriefcase,
  FaArrowLeft,
  FaIdCard
} from "react-icons/fa";
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
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });


    if (name === "password") {
      setPasswordMatch(value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(form.password === value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const emailDomain = form.email.split('@')[1];
    if (emailDomain && !['sict.gob.mx', 'sct.gob.mx', 'gob.mx'].includes(emailDomain)) {
      setError("Debe utilizar un correo institucional (@sict.gob.mx, @sct.gob.mx o @gob.mx)");
      return;
    }

    try {
      setLoading(true);
      await registerUser(form);


      navigate("/login", {
        state: {
          success: "Registro exitoso. Por favor, inicia sesión con tus credenciales."
        }
      });

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Error al registrar usuario. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };


  const hasMinLength = form.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] px-4 py-8">

        <div className="w-full max-w-lg">


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
                  Registro Institucional
                </h2>
                <p className="text-sm text-[#6C757D] mt-1">
                  Complete sus datos para acceder al sistema SICT
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
                    Nombre(s)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-[#ADB5BD]" />
                    </div>
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-[#E9ECEF] rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent
                               bg-[#F8F9FA] text-[#212529] placeholder-[#ADB5BD]
                               transition-all"
                      placeholder="Juan Carlos"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-[#495057] mb-2">
                    Apellidos
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-[#ADB5BD]" />
                    </div>
                    <input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-[#E9ECEF] rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent
                               bg-[#F8F9FA] text-[#212529] placeholder-[#ADB5BD]
                               transition-all"
                      placeholder="Campos"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-[#495057] mb-2">
                    Cargo / Puesto
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBriefcase className="text-[#ADB5BD]" />
                    </div>
                    <input
                      type="text"
                      name="cargo"
                      value={form.cargo}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-[#E9ECEF] rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent
                               bg-[#F8F9FA] text-[#212529] placeholder-[#ADB5BD]
                               transition-all"
                      placeholder="Director de Área / Analista / etc."
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-[#495057] mb-2">
                    Correo Institucional
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
                      placeholder="carlos.campos@sict.gob.mx"
                    />
                  </div>
                  <p className="text-xs text-[#6C757D] mt-1">
                    Use su correo institucional (@sict.gob.mx, @sct.gob.mx)
                  </p>
                </div>


                <div>
                  <label className="block text-sm font-medium text-[#495057] mb-2">
                    Contraseña
                  </label>
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
                      minLength={8}
                      className="w-full pl-10 pr-4 py-3 border border-[#E9ECEF] rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent
                               bg-[#F8F9FA] text-[#212529] placeholder-[#ADB5BD]
                               transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-[#495057] mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-[#ADB5BD]" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent
                               bg-[#F8F9FA] text-[#212529] placeholder-[#ADB5BD]
                               transition-all ${!passwordMatch && confirmPassword
                          ? "border-[#DC3545]"
                          : "border-[#E9ECEF]"
                        }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {!passwordMatch && confirmPassword && (
                    <p className="text-xs text-[#DC3545] mt-1">
                      Las contraseñas no coinciden
                    </p>
                  )}
                </div>


                {form.password && (
                  <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E9ECEF]">
                    <p className="text-xs font-medium text-[#495057] mb-2">Requisitos de seguridad:</p>
                    <ul className="text-xs space-y-1">
                      <li className={hasMinLength ? "text-[#28A745]" : "text-[#6C757D]"}>
                        ✓ Mínimo 8 caracteres
                      </li>
                      <li className={hasUpperCase ? "text-[#28A745]" : "text-[#6C757D]"}>
                        ✓ Al menos una mayúscula
                      </li>
                      <li className={hasNumber ? "text-[#28A745]" : "text-[#6C757D]"}>
                        ✓ Al menos un número
                      </li>
                    </ul>
                  </div>
                )}


                <button
                  type="submit"
                  disabled={loading || !passwordMatch}
                  className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[#1E4F6E] 
                           hover:from-[#1E4F6E] hover:to-[#0B3B5C]
                           text-white py-3.5 rounded-xl font-medium 
                           transition-all duration-300 disabled:opacity-60
                           shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                           flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Procesando registro...</span>
                    </>
                  ) : (
                    <>
                      <FaIdCard />
                      <span>Crear Cuenta Institucional</span>
                    </>
                  )}
                </button>


                <div className="text-center mt-4">
                  <p className="text-sm text-[#6C757D]">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                      to="/login"
                      className="text-[#C49A6C] hover:text-[#0B3B5C] font-medium transition-colors"
                    >
                      Iniciar Sesión
                    </Link>
                  </p>
                </div>

              </form>
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