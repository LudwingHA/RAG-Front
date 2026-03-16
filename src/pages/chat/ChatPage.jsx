import { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { getConversation, getHistory, sendMessage } from "../../api/chatApi";
import { ChatLayout } from "./components/ChatLayout";
import { Layout } from "../../layout/Layout";

export const ChatPage = () => {

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // Scroll automático
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
  if (!conversationId) {
    setMessages([]);   // 🔥 limpia chat al crear nueva
  } else {
    loadConversation();
  }
}, [conversationId]);

  const loadConversation = async () => {
    const res = await getConversation(conversationId);
    console.log(res)
    setMessages(res.data.messages || []);

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

  return (
   <Layout>
     <ChatLayout
      conversationId={conversationId}
      setConversationId={setConversationId}
    >
      <div className="flex flex-col h-full">

        {/* Header */}
        <div className="p-4 border-b bg-white shadow-sm">
          <h2 className="font-semibold text-gray-700">
            Sistema de Asistencia Inteligente SICT
          </h2>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">

          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              Inicia una conversación con la IA
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-lg px-4 py-2 rounded-xl text-sm shadow 
                  ${
                    msg.role === "user"
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-white text-gray-800"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-400 text-sm">
              La IA está escribiendo...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white border-t flex gap-3"
        >
          <input
            type="text"
            placeholder="Escribe tu consulta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--color-secondary)] 
                       hover:bg-[var(--color-secondary-light)] 
                       text-black px-4 rounded-lg 
                       transition flex items-center justify-center"
          >
            <FaPaperPlane />
          </button>
        </form>

      </div>
    </ChatLayout>
   </Layout>
  );
};