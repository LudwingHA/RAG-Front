import { useState, useEffect, useRef } from "react";
import { FaComments, FaPaperPlane, FaRobot, FaUser, FaRegClock } from "react-icons/fa";
import { getConversation, sendMessage } from "../../api/chatApi";
import { ChatLayout } from "./components/ChatLayout";
import { Layout } from "../../layout/Layout";

export const ChatPage = () => {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);


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
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(input, conversationId);

      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: res.data.answer,
          timestamp: new Date().toISOString()
        }
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

  const formatMessage = (content) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Layout>
      <ChatLayout
        conversationId={conversationId}
        setConversationId={setConversationId}
      >
        <div className="flex flex-col h-full bg-white">

          {/* Header institucional */}
          <div className="px-6 py-4 border-b border-[#E9ECEF] bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)] flex items-center justify-center shadow-md">
                <FaRobot className="text-white text-xl" />
              </div>
              <div>
                <h2 className="font-semibold text-[#212529] text-lg">
                  Asistente Virtual SICT
                </h2>
                <p className="text-sm text-[#6C757D] flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#28A745] rounded-full"></span>
                  {conversationId ? 'Conversación activa' : 'Nueva consulta'}
                </p>
              </div>
            </div>
          </div>


          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8F9FA]">
            {messages.length === 0 && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)] flex items-center justify-center mb-6 shadow-lg">
                  <FaComments className="text-4xl text-[#C49A6C]" />
                </div>
                <h3 className="text-xl font-semibold text-[#212529] mb-3">
                  ¡Bienvenido al Asistente SICT!
                </h3>
                <p className="text-[#6C757D] max-w-md mb-8">
                  Consulte información sobre personal, obras públicas, presupuestos y documentación institucional
                </p>
                

                <div className="grid grid-cols-2 gap-3 max-w-lg">
                  {[
                    { text: "Personal activo", icon: "👥" },
                    { text: "Obras en curso", icon: "🏗️" },
                    { text: "Presupuesto 2024", icon: "💰" },
                    { text: "Documentación", icon: "📄" }
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(item.text)}
                      className="p-4 bg-white border border-[#E9ECEF] rounded-xl hover:border-[#C49A6C] hover:shadow-md transition-all group"
                    >
                      <span className="text-2xl mb-2 block">{item.icon}</span>
                      <span className="text-sm font-medium text-[#495057] group-hover:text-[#0B3B5C]">
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-3xl ${msg.role === "user" ? "flex-row-reverse" : ""}`}>

                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm
                    ${msg.role === "user" 
                      ? "bg-gradient-to-br from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)]" 
                      : "bg-gradient-to-br from-[#C49A6C] to-[#A57C52]"}`}
                  >
                    {msg.role === "user" 
                      ? <FaUser className="text-white text-sm" />
                      : <FaRobot className="text-white text-sm" />
                    }
                  </div>


                  <div
                    className={`px-5 py-4 rounded-2xl shadow-sm
                      ${msg.role === "user"
                        ? "bg-gradient-to-r from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)] text-white rounded-tr-none"
                        : "bg-white border border-[#E9ECEF] text-[#212529] rounded-tl-none"
                      }`}
                  >
                    <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                      {formatMessage(msg.content)}
                    </div>
                    

                    <div className={`flex items-center gap-1 text-xs mt-2 
                      ${msg.role === "user" ? "text-white/70" : "text-[#6C757D]"}`}>
                      <FaRegClock />
                      {formatTime(msg.timestamp || new Date())}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-3xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C49A6C] to-[#A57C52] flex items-center justify-center shadow-sm">
                    <FaRobot className="text-white text-sm" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-white border border-[#E9ECEF] rounded-tl-none">
                    <div className="flex gap-2">
                      <span className="w-2.5 h-2.5 bg-[#C49A6C] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2.5 h-2.5 bg-[#C49A6C] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2.5 h-2.5 bg-[#C49A6C] rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>


          <form
            onSubmit={handleSubmit}
            className="p-6 bg-white border-t border-[#E9ECEF] shadow-lg"
          >
            <div className="flex gap-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Escribe tu consulta sobre personal, obras o presupuestos..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl pl-5 pr-14 py-4 
                           focus:outline-none focus:ring-2 focus:ring-[#C49A6C] focus:border-transparent 
                           transition-all text-[#212529] placeholder-[#6C757D]"
                />
                {input.trim() && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2
                             bg-gradient-to-r from-[var(--color-primary-chat)] to-[var(--color-secondary-chat)]
                             hover:from-[#1E4F6E] hover:to-[#0B3B5C]
                             text-white p-3 rounded-xl transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed
                             shadow-md hover:shadow-lg"
                  >
                    <FaPaperPlane className={loading ? "opacity-50" : ""} />
                  </button>
                )}
              </div>
            </div>


            {messages.length === 0 && (
              <div className="flex gap-2 mt-4 justify-center flex-wrap">
                {[
                  "Lista de personal",
                  "Nacionalidad española",
                  "Personal residente",
                  "Directores por área",
                  "Obras prioritarias",
                  "Presupuesto asignado"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 text-sm bg-[#F8F9FA] hover:bg-[#E9ECEF] 
                             text-[#495057] rounded-lg transition-colors
                             border border-[#E9ECEF] hover:border-[#C49A6C]"
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