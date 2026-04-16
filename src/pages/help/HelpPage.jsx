import React, { useState } from 'react'
import { Layout } from '../../layout/Layout'
import { 
  FaQuestionCircle, 
  FaSearch, 
  FaEnvelope, 
  FaPhone, 
  FaWhatsapp,
  FaRobot,
  FaChevronDown,
  FaChevronUp,
  FaFileAlt,
  FaHeadset,
  FaComments
} from 'react-icons/fa'

export const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqs, setOpenFaqs] = useState([]);

  const toggleFaq = (index) => {
    if (openFaqs.includes(index)) {
      setOpenFaqs(openFaqs.filter(i => i !== index));
    } else {
      setOpenFaqs([...openFaqs, index]);
    }
  };

  const faqs = [
    {
      question: "¿Cómo puedo consultar información sobre el personal de la SICT?",
      answer: "Puedes consultar información del personal utilizando el chat asistente. Solo escribe 'personal' o selecciona la opción de Gestión de Personal."
    },
    {
      question: "¿Qué tipo de obras públicas puedo consultar?",
      answer: "El sistema proporciona información sobre obras públicas en todas las etapas: planeación, ejecución y conclusión, incluyendo avances físicos y financieros."
    },
    {
      question: "¿Cómo accedo a los presupuestos y ejercicios fiscales?",
      answer: "En la sección de Presupuestos puedes consultar la distribución de recursos por programa, ejercicio fiscal y reportes detallados de gastos."
    },
    {
      question: "¿El sistema guarda el historial de mis consultas?",
      answer: "Sí, el sistema guarda automáticamente el historial de tus conversaciones. Puedes acceder a ellas desde el panel lateral izquierdo."
    },
    {
      question: "¿Cómo puedo obtener documentos oficiales?",
      answer: "En la sección de Documentación puedes buscar y descargar documentos oficiales como normativas, informes y formatos de trámites."
    }
  ];

  const supportChannels = [
    {
      icon: <FaHeadset className="text-2xl" />,
      title: "Mesa de Ayuda",
      contact: "55 1234 5678",
    },
    {
      icon: <FaWhatsapp className="text-2xl" />,
      title: "WhatsApp",
      contact: "55 8765 4321",
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Correo electrónico",
      contact: "soporte@sict.gob.mx",
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <FaQuestionCircle />
                <span className="text-sm font-medium">Centro de Ayuda</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                ¿Cómo podemos ayudarte?
              </h1>
              <p className="text-lg lg:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Encuentra respuestas rápidas y contacta con nuestro equipo de soporte
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <input
                  type="text"
                  placeholder="Buscar en preguntas frecuentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white text-[#212529] rounded-xl pl-12 pr-4 py-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaComments className="text-2xl text-[#C49A6C]" />
              <h2 className="text-3xl lg:text-4xl font-bold text-[#212529]">
                Preguntas Frecuentes
              </h2>
            </div>
            <p className="text-lg text-[#6C757D]">
              Las respuestas a las dudas más comunes sobre el sistema
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-[#E9ECEF] overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#F8F9FA] transition-colors"
                >
                  <span className="font-semibold text-[#212529]">{faq.question}</span>
                  {openFaqs.includes(index) ? (
                    <FaChevronUp className="text-[#6C757D]" />
                  ) : (
                    <FaChevronDown className="text-[#6C757D]" />
                  )}
                </button>
                {openFaqs.includes(index) && (
                  <div className="px-6 pb-4 text-[#6C757D] leading-relaxed border-t border-[#E9ECEF] pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-gradient-to-r from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)] rounded-2xl text-white overflow-hidden">
            <div className="p-8 lg:p-12 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FaFileAlt className="text-2xl" />
                <h3 className="text-2xl font-bold">Documentación Oficial</h3>
              </div>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Descarga manuales y guías completas para usar el sistema
              </p>
              <button className="bg-white text-[var(--color-primary-chat)] px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Descargar manual de usuario
              </button>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#212529] mb-4">
              ¿Necesitas ayuda adicional?
            </h2>
            <p className="text-lg text-[#6C757D]">
              Nuestro equipo de soporte está disponible para ayudarte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-[#C49A6C]">{channel.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-[#212529] mb-2">{channel.title}</h3>
                <p className="font-semibold text-[var(--color-primary-chat)] mb-4">{channel.contact}</p>
                <button className="px-6 py-2 bg-[var(--color-primary-chat)] text-white rounded-lg hover:bg-[var(--color-secondary-chat)] transition-all">
                  Contactar
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}