import { useState, useEffect } from "react";
import {
  getConversations,
  deleteConversation
} from "../../../api/chatApi";
import {
  FaPlus,
  FaTrash,
  FaHistory,
  FaChevronLeft,
  FaComments,
  FaChevronRight,
  FaArchive,
  FaCalendarAlt
} from "react-icons/fa";

export const ChatLayout = ({ children, conversationId, setConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await getConversations();
      setConversations(res.data.conversations);
    } catch (err) {
      setError("Error al cargar conversaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar esta conversación?"
    );

    if (!confirmDelete) return;

    try {
      await deleteConversation(id);

      if (conversationId === id) {
        setConversationId(null);
      }

      loadConversations();
    } catch (err) {
      alert("No se pudo eliminar la conversación");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  // Agrupar conversaciones por fecha
  const groupedConversations = conversations.reduce((groups, conv) => {
    const date = formatDate(conv.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(conv);
    return groups;
  }, {});

  return (
    <div className="flex h-[90vh] relative bg-[#F8F9FA]">
      {/* Botón para colapsar/expandir sidebar en móvil */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="lg:hidden absolute left-2 top-2 z-20 bg-white p-2 rounded-lg shadow-md border border-[#E9ECEF] text-[#495057] hover:bg-[#F8F9FA] transition-all"
      >
        {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* SIDEBAR - Diseño institucional */}
      <aside 
        className={`
          ${sidebarCollapsed ? 'w-0' : 'w-80'} 
          bg-white border-r border-[#E9ECEF]
          flex flex-col h-full transition-all duration-300
          ${sidebarCollapsed ? 'opacity-0 overflow-hidden' : 'opacity-100'}
          lg:w-80 lg:opacity-100 lg:relative absolute z-10
          shadow-sm
        `}
      >
        {/* Header Sidebar */}
        <div className="p-5 border-b border-[#E9ECEF] bg-gradient-to-r from-[#F8F9FA] to-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)] flex items-center justify-center shadow-md">
              <FaArchive className="text-white text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-[#212529]">Historial de Chat</h3>
              <p className="text-xs text-[#6C757D] flex items-center gap-1">
                <FaCalendarAlt className="text-[#C49A6C]" />
                {conversations.length} conversaciones
              </p>
            </div>
          </div>

          <button
            onClick={() => setConversationId(null)}
            className="w-full flex items-center justify-center gap-2 
                       bg-[var(--color-primary-chat)] hover:bg-[var(--color-secondary-chat)] 
                       text-white py-3 rounded-xl 
                       transition-all duration-300 font-medium
                       shadow-md hover:shadow-lg"
          >
            <FaPlus className="text-sm" />
            Nueva conversación
          </button>
        </div>

        {/* Lista de conversaciones */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 w-20 bg-[#E9ECEF] rounded mb-2"></div>
                  <div className="h-16 bg-[#E9ECEF] rounded-lg"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-[#DC3545]/10 border border-[#DC3545]/20 rounded-lg p-4">
              <p className="text-sm text-[#DC3545] text-center">
                {error}
              </p>
            </div>
          )}

          {!loading && conversations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#E9ECEF] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaComments className="text-3xl text-[#ADB5BD]" />
              </div>
              <p className="text-sm font-medium text-[#495057]">
                No hay conversaciones aún
              </p>
              <p className="text-xs text-[#6C757D] mt-1">
                Comienza una nueva conversación
              </p>
            </div>
          )}

          {Object.entries(groupedConversations).map(([date, convs]) => (
            <div key={date} className="space-y-2">
              <p className="text-xs font-semibold text-[#6C757D] uppercase tracking-wider px-2">
                {date}
              </p>
              {convs.map((conv) => {
                const isActive = conversationId === conv.id;
                
                return (
                  <div
                    key={conv.id}
                    className={`group relative overflow-hidden
                                rounded-xl cursor-pointer 
                                transition-all duration-200
                                ${isActive 
                                  ? "bg-gradient-to-r from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)] shadow-md text-white" 
                                  : "bg-[#F8F9FA] hover:bg-white border border-[#E9ECEF] hover:shadow-md"}`}
                  >
                    <div
                      onClick={() => setConversationId(conv.id)}
                      className="p-4 pr-12"
                    >
                      <div className="flex items-start gap-3">
                        <FaComments className={`text-sm mt-1 flex-shrink-0
                          ${isActive ? "text-[#C49A6C]" : "text-[#6C757D]"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate
                            ${isActive ? "text-white" : "text-[#212529]"}`}>
                            {conv.title || "Conversación sin título"}
                          </p>
                          <p className={`text-xs mt-1
                            ${isActive ? "text-white/70" : "text-[#6C757D]"}`}>
                            {new Date(conv.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(conv.id)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2
                               opacity-0 group-hover:opacity-100 
                               p-2 rounded-lg transition-all
                               ${isActive 
                                 ? "bg-white/20 hover:bg-white/30 text-white" 
                                 : "bg-white hover:bg-[#DC3545]/10 text-[#6C757D] hover:text-[#DC3545] border border-[#E9ECEF]"}`}
                      title="Eliminar conversación"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-[#E9ECEF] bg-[#F8F9FA]">
          <p className="text-xs text-[#6C757D] text-center">
            SICT Assistant · Versión 2.0
          </p>
        </div>
      </aside>

      {/* Overlay para móvil */}
      {!sidebarCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-0"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* CHAT AREA */}
      <main className="flex-1 bg-[#F8F9FA] relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};