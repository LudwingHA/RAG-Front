import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layout } from '../../layout/Layout';
import {
  FaUserCircle,
  FaEnvelope,
  FaBriefcase,
  FaIdCard,
  FaShieldAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaKey,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaUserTie,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaDesktop
} from 'react-icons/fa';
import { updateProfile, changePassword } from '../../api/authApi';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);


  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    cargo: '',
    email: '',
    phone: '',
    extension: '',
    office: '',
    address: '',
    employee_id: '',
    department: '',
    area: '',
    supervisor: ''
  });


  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });


  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });


  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        cargo: user.cargo || '',
        email: user.email || '',
        phone: user.phone || '',
        extension: user.extension || '',
        office: user.office || '',
        address: user.address || '',
        employee_id: user.employee_id || '',
        department: user.department || '',
        area: user.area || '',
        supervisor: user.supervisor || ''
      });
    }
  }, [user]);


  useEffect(() => {
    setPasswordRequirements({
      minLength: passwordForm.new_password.length >= 8,
      hasUpperCase: /[A-Z]/.test(passwordForm.new_password),
      hasLowerCase: /[a-z]/.test(passwordForm.new_password),
      hasNumber: /[0-9]/.test(passwordForm.new_password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(passwordForm.new_password)
    });
  }, [passwordForm.new_password]);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await updateProfile(profileForm);
      if (response && response.data) {
        updateUser(response.data);
        setSuccess('Perfil actualizado exitosamente');
        setIsEditing(false);
      } else {
        setSuccess('Perfil actualizado exitosamente');
        setIsEditing(false);

        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);


    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (!Object.values(passwordRequirements).every(Boolean)) {
      setError('La contraseña no cumple con todos los requisitos de seguridad');
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password
      });
      setSuccess('Contraseña actualizada exitosamente');
      setIsChangingPassword(false);
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (err) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail[0].msg);
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Error al cambiar la contraseña");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setError(null);
    setSuccess(null);

    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        cargo: user.cargo || '',
        email: user.email || '',
        phone: user.phone || '',
        extension: user.extension || '',
        office: user.office || '',
        address: user.address || '',
        employee_id: user.employee_id || '',
        department: user.department || '',
        area: user.area || '',
        supervisor: user.supervisor || ''
      });
    }
    setPasswordForm({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="text-center">
            <FaExclamationCircle className="text-5xl text-[#C49A6C] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#212529]">No hay sesión activa</h2>
            <p className="text-[#6C757D] mt-2">Por favor, inicia sesión para ver tu perfil</p>
          </div>
        </div>
      </Layout>
    );
  }

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] py-8 px-4">
        <div className="max-w-6xl mx-auto">


          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#212529] flex items-center gap-2">
              <FaUserCircle className="text-[#C49A6C]" />
              Perfil de Usuario
            </h1>
            <p className="text-[#6C757D] text-sm">Gestión de información personal y seguridad</p>
          </div>


          {success && (
            <div className="mb-6 p-4 bg-[#28A745]/10 border border-[#28A745]/20 rounded-xl animate-fadeIn">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-[#28A745] text-lg" />
                <p className="text-sm text-[#28A745] font-medium">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-[#DC3545]/10 border border-[#DC3545]/20 rounded-xl animate-fadeIn">
              <div className="flex items-center gap-3">
                <FaExclamationCircle className="text-[#DC3545] text-lg" />
                <p className="text-sm text-[#DC3545] font-medium">{error}</p>
              </div>
            </div>
          )}


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E9ECEF] sticky top-4">
                <div className="h-28 bg-gradient-to-r from-[#175c4d] to-[#0d3630] relative">
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#175c4d] to-[#0d3630] flex items-center justify-center border-4 border-white shadow-lg">
                      <FaUserCircle className="text-5xl text-[#C49A6C]" />
                    </div>
                  </div>
                </div>

                <div className="pt-16 p-6 text-center">
                  <h2 className="text-xl font-bold text-[#212529]">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-[#C49A6C] font-medium mt-1">{user.cargo}</p>

                  <div className="mt-4 pt-4 border-t border-[#E9ECEF]">
                    <div className="flex items-center justify-center gap-2 text-sm text-[#6C757D] mb-2">
                      <FaShieldAlt className="text-[#C49A6C]" />
                      <span>Rol: <span className="font-medium text-[#212529]">{user.role}</span></span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-[#6C757D]">
                      <FaClock className="text-[#C49A6C]" />
                      <span>Miembro desde: {new Date(user.created_at).toLocaleDateString('es-MX')}</span>
                    </div>
                    {user.last_login && (
                      <div className="flex items-center justify-center gap-2 text-sm text-[#6C757D] mt-2">
                        <FaClock className="text-[#C49A6C]" />
                        <span>Último acceso: {new Date(user.last_login).toLocaleDateString('es-MX')}</span>
                      </div>
                    )}
                  </div>

                  {!isEditing && !isChangingPassword && (
                    <div className="mt-6 space-y-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full py-2.5 bg-gradient-to-r from-[#175c4d] to-[#0d3630] text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <FaEdit />
                        Editar Perfil
                      </button>
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="w-full py-2.5 border border-[#C49A6C] text-[#C49A6C] rounded-xl font-medium hover:bg-[#C49A6C] hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <FaKey />
                        Cambiar Contraseña
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>


            <div className="lg:col-span-2 space-y-6">


              {isEditing ? (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E9ECEF]">
                  <div className="p-6 border-b border-[#E9ECEF] bg-gradient-to-r from-[#F8F9FA] to-white">
                    <h3 className="text-lg font-semibold text-[#212529] flex items-center gap-2">
                      <FaEdit className="text-[#C49A6C]" />
                      Editar Información Personal
                    </h3>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={profileForm.first_name}
                          onChange={handleProfileChange}
                          required
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Apellidos *
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={profileForm.last_name}
                          onChange={handleProfileChange}
                          required
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Cargo *
                        </label>
                        <input
                          type="text"
                          name="cargo"
                          value={profileForm.cargo}
                          onChange={handleProfileChange}
                          required
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Departamento
                        </label>
                        <select
                          name="department"
                          value={profileForm.department}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                        >
                          <option value="">Seleccionar departamento</option>
                          <option value="Dirección General">Dirección General</option>
                          <option value="Infraestructura">Infraestructura</option>
                          <option value="Comunicaciones y Transportes">Comunicaciones y Transportes</option>
                          <option value="Tecnologías de la Información">Tecnologías de la Información</option>
                          <option value="Recursos Humanos">Recursos Humanos</option>
                          <option value="Finanzas">Finanzas</option>
                          <option value="Jurídico">Jurídico</option>
                          <option value="Planeación">Planeación</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Área
                        </label>
                        <input
                          type="text"
                          name="area"
                          value={profileForm.area}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                          placeholder="Ej: Sistemas, Desarrollo, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Número de Empleado
                        </label>
                        <input
                          type="text"
                          name="employee_id"
                          value={profileForm.employee_id}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                          placeholder="SICT-2024-XXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                          placeholder="55-1234-5678"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Extensión
                        </label>
                        <input
                          type="text"
                          name="extension"
                          value={profileForm.extension}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                          placeholder="12345"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          required
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Supervisor
                        </label>
                        <input
                          type="text"
                          name="supervisor"
                          value={profileForm.supervisor}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                          placeholder="Nombre del supervisor inmediato"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Oficina / Cubículo
                        </label>
                        <input
                          type="text"
                          name="office"
                          value={profileForm.office}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                          placeholder="Edificio, piso, número de oficina"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Dirección
                        </label>
                        <textarea
                          name="address"
                          value={profileForm.address}
                          onChange={handleProfileChange}
                          rows={2}
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all resize-none"
                          placeholder="Dirección completa"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t border-[#E9ECEF]">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#175c4d] to-[#0d3630] text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FaSave />
                        )}
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2.5 border border-[#DC3545] text-[#DC3545] rounded-xl font-medium hover:bg-[#DC3545] hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <FaTimes />
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              ) : isChangingPassword ? (

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E9ECEF]">
                  <div className="p-6 border-b border-[#E9ECEF] bg-gradient-to-r from-[#F8F9FA] to-white">
                    <h3 className="text-lg font-semibold text-[#212529] flex items-center gap-2">
                      <FaKey className="text-[#C49A6C]" />
                      Cambiar Contraseña
                    </h3>
                    <p className="text-sm text-[#6C757D] mt-1">
                      Por seguridad, elige una contraseña robusta
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Contraseña Actual
                        </label>
                        <input
                          type="password"
                          name="current_password"
                          value={passwordForm.current_password}
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          name="new_password"
                          value={passwordForm.new_password}
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-4 py-2.5 border border-[#E9ECEF] rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#495057] mb-2">
                          Confirmar Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          name="confirm_password"
                          value={passwordForm.confirm_password}
                          onChange={handlePasswordChange}
                          required
                          className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent transition-all ${passwordForm.confirm_password && passwordForm.new_password !== passwordForm.confirm_password
                              ? 'border-[#DC3545]'
                              : 'border-[#E9ECEF]'
                            }`}
                        />
                      </div>


                      {passwordForm.new_password && (
                        <div className="bg-[#F8F9FA] rounded-xl p-4">
                          <p className="text-sm font-medium text-[#495057] mb-3">Requisitos de seguridad:</p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <li className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-[#28A745]' : 'text-[#6C757D]'}`}>
                              {passwordRequirements.minLength ? '✓' : '○'} Mínimo 8 caracteres
                            </li>
                            <li className={`flex items-center gap-2 ${passwordRequirements.hasUpperCase ? 'text-[#28A745]' : 'text-[#6C757D]'}`}>
                              {passwordRequirements.hasUpperCase ? '✓' : '○'} Al menos una mayúscula
                            </li>
                            <li className={`flex items-center gap-2 ${passwordRequirements.hasLowerCase ? 'text-[#28A745]' : 'text-[#6C757D]'}`}>
                              {passwordRequirements.hasLowerCase ? '✓' : '○'} Al menos una minúscula
                            </li>
                            <li className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-[#28A745]' : 'text-[#6C757D]'}`}>
                              {passwordRequirements.hasNumber ? '✓' : '○'} Al menos un número
                            </li>
                            <li className={`flex items-center gap-2 md:col-span-2 ${passwordRequirements.hasSpecialChar ? 'text-[#28A745]' : 'text-[#6C757D]'}`}>
                              {passwordRequirements.hasSpecialChar ? '✓' : '○'} Al menos un carácter especial (!@#$%^&*)
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t border-[#E9ECEF]">
                      <button
                        type="submit"
                        disabled={loading || !isPasswordValid}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#175c4d] to-[#0d3630] text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FaKey />
                        )}
                        {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2.5 border border-[#DC3545] text-[#DC3545] rounded-xl font-medium hover:bg-[#DC3545] hover:text-white transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              ) : (

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E9ECEF]">
                  <div className="p-6 border-b border-[#E9ECEF] bg-gradient-to-r from-[#F8F9FA] to-white">
                    <h3 className="text-lg font-semibold text-[#212529] flex items-center gap-2">
                      <FaIdCard className="text-[#C49A6C]" />
                      Información Personal
                    </h3>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="space-y-4">
                        <div className="bg-[#F8F9FA] p-3 rounded-xl">
                          <p className="text-xs text-[#6C757D] uppercase tracking-wider flex items-center gap-1">
                            <FaUserCircle className="text-[#C49A6C]" />
                            Nombre Completo
                          </p>
                          <p className="text-[#212529] font-medium mt-1">{user.first_name} {user.last_name}</p>
                        </div>

                        <div className="bg-[#F8F9FA] p-3 rounded-xl">
                          <p className="text-xs text-[#6C757D] uppercase tracking-wider flex items-center gap-1">
                            <FaBriefcase className="text-[#C49A6C]" />
                            Cargo
                          </p>
                          <p className="text-[#212529] font-medium mt-1">{user.cargo || 'No especificado'}</p>
                        </div>

                        <div className="bg-[#F8F9FA] p-3 rounded-xl">
                          <p className="text-xs text-[#6C757D] uppercase tracking-wider flex items-center gap-1">
                            <FaBuilding className="text-[#C49A6C]" />
                            Departamento
                          </p>
                          <p className="text-[#212529] font-medium mt-1">{user.department || 'No especificado'}</p>
                        </div>

                        <div className="bg-[#F8F9FA] p-3 rounded-xl">
                          <p className="text-xs text-[#6C757D] uppercase tracking-wider flex items-center gap-1">
                            <FaDesktop className="text-[#C49A6C]" />
                            Área
                          </p>
                          <p className="text-[#212529] font-medium mt-1">{user.area || 'No especificado'}</p>
                        </div>

                        <div className="bg-[#F8F9FA] p-3 rounded-xl">
                          <p className="text-xs text-[#6C757D] uppercase tracking-wider flex items-center gap-1">
                            <FaIdCard className="text-[#C49A6C]" />
                            Número de Empleado
                          </p>
                          <p className="text-[#212529] font-medium mt-1">{user.employee_id || 'No especificado'}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-[#F8F9FA] p-3 rounded-xl">
                          <p className="text-xs text-[#6C757D] uppercase tracking-wider flex items-center gap-1">
                            <FaEnvelope className="text-[#C49A6C]" />
                            Correo Electrónico
                          </p>
                          <p className="text-[#212529] font-medium mt-1 break-all">{user.email}</p>
                        </div>

                        <div className="bg-[#F8F9FA] p-3 rounded-xl">
                          <p className="text-xs text-[#6C757D] uppercase tracking-wider flex items-center gap-1">
                            <FaPhone className="text-[#C49A6C]" />
                            Teléfono / Extensión
                          </p>
                          <p className="text-[#212529] font-medium mt-1">
                            {user.phone ? `${user.phone}` : 'No especificado'}
                            {user.extension && ` (Ext. ${user.extension})`}
                          </p>
                        </div>

                        <div className="bg-[#F8F9FA] p-3 rounded-xl">
                          <p className="text-xs text-[#6C757D] uppercase tracking-wider flex items-center gap-1">
                            <FaBuilding className="text-[#C49A6C]" />
                            Oficina
                          </p>
                          <p className="text-[#212529] font-medium mt-1">{user.office || 'No especificado'}</p>
                        </div>

                        <div className="bg-[#F8F9FA] p-3 rounded-xl">
                          <p className="text-xs text-[#6C757D] uppercase tracking-wider flex items-center gap-1">
                            <FaUserTie className="text-[#C49A6C]" />
                            Supervisor
                          </p>
                          <p className="text-[#212529] font-medium mt-1">{user.supervisor || 'No especificado'}</p>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div className="bg-[#F8F9FA] p-3 rounded-xl">
                          <p className="text-xs text-[#6C757D] uppercase tracking-wider flex items-center gap-1">
                            <FaMapMarkerAlt className="text-[#C49A6C]" />
                            Dirección
                          </p>
                          <p className="text-[#212529] font-medium mt-1">{user.address || 'No especificado'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};