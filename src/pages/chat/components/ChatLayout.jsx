import { useState, useEffect } from "react";
import {
  getConversations,
  deleteConversation
} from "../../../api/chatApi";
import {
  FaPlus,
  FaTrash,
  FaComments
} from "react-icons/fa";

export const ChatLayout = ({ children, conversationId, setConversationId }) => {

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="flex h-[90vh]">

      {/* SIDEBAR */}
      <aside className="w-80 bg-[var(--color-primary)] text-white flex flex-col h-full">

        {/* Header Sidebar */}
        <div className="p-4 border-b border-white/20">
          <button
            onClick={() => setConversationId(null)}
            className="w-full flex items-center justify-center gap-2 
                       bg-[var(--color-secondary)] 
                       hover:bg-[var(--color-secondary-light)] 
                       text-black py-2 rounded-lg 
                       transition duration-300 font-medium"
          >
            <FaPlus />
            Nueva conversación
          </button>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-white/20">

          {loading && (
            <p className="text-sm text-white/60 text-center">
              Cargando conversaciones...
            </p>
          )}

          {error && (
            <p className="text-sm text-red-400 text-center">
              {error}
            </p>
          )}

          {!loading && conversations.length === 0 && (
            <p className="text-sm text-white/50 text-center">
              No hay conversaciones aún
            </p>
          )}

          {conversations.map((conv) => {

            const isActive = conversationId === conv.id;
            console.log(conv)

            return (
              <div
                key={conv.id}
                className={`group flex items-center justify-between 
                            p-3 rounded-lg cursor-pointer 
                            transition duration-200
                            ${isActive 
                              ? "bg-white/20" 
                              : "bg-white/10 hover:bg-white/20"}`}
              >
                <div
                  onClick={() => setConversationId(conv.id)}
                  className="flex items-center gap-2 flex-1 truncate"
                >
                  <FaComments className="text-xs opacity-70" />
                  <span className="text-sm truncate">
                    {conv.title}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(conv.id)}
                  className="opacity-0 group-hover:opacity-100 
                             text-red-400 hover:text-red-500 
                             transition text-xs"
                >
                  <FaTrash />
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      {/* CHAT AREA */}
      <main className="flex-1 bg-gray-50 relative">
        {children}
      </main>
    </div>
  );
};