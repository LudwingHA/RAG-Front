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
    <div className="flex h-[90vh] relative">
      {/* Botón para colapsar/expandir sidebar en móvil */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="lg:hidden absolute left-2 top-2 z-20 bg-white p-2 rounded-lg shadow-lg"
      >
        {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* SIDEBAR mejorado 
      */}
      <aside 
        className={`
          ${sidebarCollapsed ? 'w-0' : 'w-80'} 
          bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] 
          text-white flex flex-col h-full transition-all duration-300
          ${sidebarCollapsed ? 'opacity-0 overflow-hidden' : 'opacity-100'}
          lg:w-80 lg:opacity-100 lg:relative absolute z-10
        `}
      >
        {/* Header Sidebar mejorado */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <FaHistory className="text-white/80" />
            </div>
            <div>
              <h3 className="font-semibold">Historial</h3>
              <p className="text-xs text-white/60">
                {conversations.length} conversaciones
              </p>
            </div>
          </div>

          <button
            onClick={() => setConversationId(null)}
            className="w-full flex items-center justify-center gap-2 
                       bg-white/10 hover:bg-white/20 
                       text-white py-2.5 rounded-xl 
                       transition-all duration-300 font-medium
                       border border-white/10 hover:border-white/20
                       backdrop-blur-sm"
          >
            <FaPlus className="text-sm" />
            Nueva conversación
          </button>
        </div>

        {/* Lista mejorada con agrupación por fecha */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20">
          {loading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 w-20 bg-white/10 rounded mb-2"></div>
                  <div className="h-12 bg-white/10 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm text-red-400 text-center">
                {error}
              </p>
            </div>
          )}

          {!loading && conversations.length === 0 && (
            <div className="text-center py-8">
              <FaComments className="text-4xl text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/50">
                No hay conversaciones aún
              </p>
              <p className="text-xs text-white/30 mt-1">
                Comienza una nueva conversación
              </p>
            </div>
          )}

          {Object.entries(groupedConversations).map(([date, convs]) => (
            <div key={date} className="space-y-2">
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider px-2">
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
                                  ? "bg-white/20 shadow-lg" 
                                  : "bg-white/5 hover:bg-white/10"}`}
                  >
                    <div
                      onClick={() => setConversationId(conv.id)}
                      className="p-3 pr-10"
                    >
                      <div className="flex items-start gap-3">
                        <FaComments className={`text-sm mt-1 flex-shrink-0
                          ${isActive ? "text-white" : "text-white/40"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate font-medium
                            ${isActive ? "text-white" : "text-white/80"}`}>
                            {conv.title || "Sin título"}
                          </p>
                          <p className="text-xs text-white/40 mt-1">
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
                      className="absolute right-2 top-1/2 -translate-y-1/2
                               opacity-0 group-hover:opacity-100 
                               bg-red-500/20 hover:bg-red-500/30
                               text-red-400 hover:text-red-500
                               p-2 rounded-lg transition-all
                               backdrop-blur-sm"
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
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/30 text-center">
            SICT Assistant v1.0
          </p>
        </div>
      </aside>

      {/* Overlay para móvil cuando el sidebar está abierto */}
      {!sidebarCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-0"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* CHAT AREA */}
      <main className="flex-1 bg-gray-50 relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};