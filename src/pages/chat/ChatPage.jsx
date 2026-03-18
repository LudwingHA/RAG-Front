import { useState, useEffect, useRef } from "react";
import { FaComments, FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import { getConversation, sendMessage } from "../../api/chatApi";
import { ChatLayout } from "./components/ChatLayout";
import { Layout } from "../../layout/Layout";

export const ChatPage = () => {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);


  // Scroll automático mejorado con smooth behavior
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
    } else {
      loadConversation();
    }
  }, [conversationId]);

  const loadConversation = async () => {
    try {
      const res = await getConversation(conversationId);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(input, conversationId);

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: res.data.answer }
      ]);

      if (!conversationId) {
        setConversationId(res.data.conversation_id);
      }

    } catch (err) {
      alert("Error al enviar mensaje");
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear mensajes largos
  const formatMessage = (content) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <Layout>
      <ChatLayout
        conversationId={conversationId}
        setConversationId={setConversationId}
      >
        <div className="flex flex-col h-full bg-white">

          {/* Header mejorado */}
          <div className="p-4 border-b  backdrop-blur-sm shadow-sm sticky top-0 z-10 bg-[var(--color-secondary)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                <FaRobot className="text-white text-lg" />
              </div>
              <div>
                <h2 className="font-semibold text-white">
                  Asistente SICT
                </h2>
                <p className="text-xs text-gray-500">
                  {conversationId ? 'Conversación activa' : 'Nueva conversación'}
                </p>
              </div>
            </div>
          </div>

          {/* Mensajes con diseño mejorado */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-[var(--color-secondary)] flex items-center justify-center mb-4">
                  <FaComments className="text-4xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  ¡Bienvenido al Asistente!
                </h3>
                <p className="text-gray-500 max-w-md">
                  Puedes preguntar sobre personal, obras, presupuestos en base a documentos
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-2xl ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${msg.role === "user" 
                      ? "bg-[var(--color-secondary)]" 
                      : "bg-[var(--color-primary)]"}`}
                  >
                    {msg.role === "user" 
                      ? <FaUser className="text-white text-sm" />
                      : <FaRobot className="text-white text-sm" />
                    }
                  </div>

                  {/* Mensaje */}
                  <div
                    className={`px-5 py-3 rounded-2xl text-sm shadow-sm
                      ${msg.role === "user"
                        ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-br-none"
                        : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] border-gray-200 text-white rounded-bl-none"
                      }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {formatMessage(msg.content)}
                    </div>
                    
                    {/* Timestamp opcional */}
                    <div className={`text-xs mt-1 ${msg.role === "user" ? "text-white/70" : "text-gray-400"}`}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-2xl">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                    <FaRobot className="text-white text-sm" />
                  </div>
                  <div className="px-5 py-3 rounded-2xl bg-white border border-gray-200 rounded-bl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input mejorado */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] border-t shadow-lg"
          >
            <div className="flex gap-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Escribe tu consulta sobre el personal..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-[var(--color-secondary)] border border-gray-300 rounded-xl pl-4 pr-12 py-3 
                           focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] 
                           focus:border-transparent transition-all text-white"
                />
                {input.trim() && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2
                             bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-light)] 
                             text-black p-2 rounded-lg transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane className={loading ? "opacity-50" : ""} />
                  </button>
                )}
              </div>
            </div>

            {/* Sugerencias rápidas */}
            {messages.length === 0 && (
              <div className="flex gap-2 mt-3 justify-center flex-wrap">
                {[
                  "¿Qué personal tengo?",
                  "¿Quién tiene nacionalidad española?",
                  "¿Quiénes son los residentes?",
                  "¿Quién es director?"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 
                             text-gray-700 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </ChatLayout>
    </Layout>
  );
};