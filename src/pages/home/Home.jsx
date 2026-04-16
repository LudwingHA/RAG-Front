import React, { useState, useEffect } from 'react'
import { Layout } from '../../layout/Layout'
import { 
  FaRobot, 
  FaChartLine, 
  FaUsers, 
  FaBuilding, 
  FaFileAlt, 
  FaCalendarAlt,
  FaArrowRight,
  FaShieldAlt,
  FaGlobeAmericas,
  FaClipboardList,
  FaHandshake
} from 'react-icons/fa'
import { Link } from 'react-router-dom';

export const Home = () => {
  const [stats, setStats] = useState({
    personal: 0,
    obras: 0,
    presupuesto: 0,
    documentos: 0
  });

  // Simular carga de estadísticas
  useEffect(() => {
    // Aquí puedes hacer una llamada a tu API real
    const loadStats = () => {
      setStats({
        personal: 2847,
        obras: 156,
        presupuesto: 1250000000,
        documentos: 3428
      });
    };
    loadStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-MX').format(num);
  };

  const features = [
    {
      icon: <FaUsers className="text-3xl" />,
      title: "Gestión de Personal",
      description: "Consulta información actualizada sobre el personal de la SICT, incluyendo perfiles, cargos y ubicaciones.",
      color: "from-blue-500 to-blue-600",
      link: "/personal"
    },
    {
      icon: <FaBuilding className="text-3xl" />,
      title: "Obras Públicas",
      description: "Seguimiento en tiempo real de obras públicas, avances físicos y financieros, y documentación asociada.",
      color: "from-green-500 to-green-600",
      link: "/obras"
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Presupuestos",
      description: "Análisis detallado de presupuestos, ejercicios fiscales y distribución de recursos por programa.",
      color: "from-purple-500 to-purple-600",
      link: "/presupuestos"
    },
    {
      icon: <FaFileAlt className="text-3xl" />,
      title: "Documentación",
      description: "Acceso a documentos oficiales, informes, normativas y trámites institucionales.",
      color: "from-orange-500 to-orange-600",
      link: "/documentos"
    }
  ];

  const quickStats = [
    {
      label: "Personal Activo",
      value: formatNumber(stats.personal),
      icon: <FaUsers className="text-[#C49A6C]" />,
      change: "+12%",
      positive: true
    },
    {
      label: "Obras en Proceso",
      value: formatNumber(stats.obras),
      icon: <FaBuilding className="text-[#C49A6C]" />,
      change: "+8%",
      positive: true
    },
    {
      label: "Presupuesto 2024",
      value: formatCurrency(stats.presupuesto),
      icon: <FaChartLine className="text-[#C49A6C]" />,
      change: "+15%",
      positive: true
    },
    {
      label: "Documentos Digitalizados",
      value: formatNumber(stats.documentos),
      icon: <FaFileAlt className="text-[#C49A6C]" />,
      change: "+23%",
      positive: true
    }
  ];

  const recentActivities = [
    { title: "Actualización de personal", date: "2024-01-15", type: "personal" },
    { title: "Nueva obra registrada", date: "2024-01-14", type: "obras" },
    { title: "Informe presupuestal Q4", date: "2024-01-13", type: "documentos" },
    { title: "Renovación de directores", date: "2024-01-12", type: "personal" }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white">
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
              <div className="lg:max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <FaRobot className="text-[#C49A6C]" />
                  <span className="text-sm font-medium">Chat Inteligente SICT</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                  SISTEMA DE IA DE LA SICT
                </h1>
                <p className="text-lg lg:text-xl mb-8 text-white/90 leading-relaxed">
                  Innovación y transparencia al servicio de la infraestructura nacional. 
                  Accede a información en tiempo real sobre personal, obras y presupuestos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to={"/chat"} className="bg-white text-[var(--color-primary-chat)] px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    Comenzar ahora
                    <FaArrowRight />
                  </Link>
                  <button className="border-2 border-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    Ver demostración
                  </button>
                </div>
              </div>
              

              <div className="hidden lg:block mt-12 lg:mt-0">
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-[#C49A6C] to-[#A57C52] rounded-full flex items-center justify-center shadow-2xl">
                    <h1 className='text-6xl text-[var(--color-primary)]'>SICT</h1>
                  </div>
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                    <FaShieldAlt className="text-3xl text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
                    <FaGlobeAmericas className="text-2xl text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <span className={`text-sm font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#212529] mb-1">{stat.value}</h3>
                <p className="text-sm text-[#6C757D]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#212529] mb-4">
              Funcionalidades Principales
            </h2>
            <p className="text-lg text-[#6C757D] max-w-2xl mx-auto">
              Accede a información clave de la SICT a través de nuestro asistente inteligente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`bg-gradient-to-r ${feature.color} p-6 text-white`}>
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-[#6C757D] mb-4 leading-relaxed">{feature.description}</p>
                  <Link to={"/chat"} className="text-[var(--color-primary-chat)] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Explorar
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-gradient-to-r from-[#F8F9FA] to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Recent Activity */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)] flex items-center justify-center">
                    <FaCalendarAlt className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#212529]">Actividad Reciente</h3>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[#212529]">{activity.title}</p>
                          <p className="text-sm text-[#6C757D]">{activity.date}</p>
                        </div>
                        <span className="px-3 py-1 bg-[#F8F9FA] rounded-full text-xs font-medium text-[#6C757D]">
                          {activity.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)] text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              ¿Listo para optimizar tu gestión?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Comienza a utilizar el sistema de IA de la SICT y accede a información en tiempo real
            </p>
            <Link to={"/chat"} className="bg-white text-[var(--color-primary-chat)] px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2">
              Iniciar ahora
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}