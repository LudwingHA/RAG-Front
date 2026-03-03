import { useState, useEffect, useRef } from "react";
import { getHistory, sendMessage } from "../../api/chatApi";
import { Layout } from "../../layout/Layout";


export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadHistory = async () => {
    const res = await getHistory();
    setMessages(res.data.messages);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(input);

      const aiMessage = {
        role: "assistant",
        content: res.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
   <Layout>
     <div className="flex flex-col h-[90vh] max-w-4xl mx-auto p-6">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xl px-4 py-3 rounded-xl ${
              msg.role === "user"
                ? "bg-[var(--color-secondary)] ml-auto text-black"
                : "bg-[var(--color-primary-light)]"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-200 px-4 py-2 rounded-xl w-fit">
            Pensando...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="mt-4 flex gap-3">
        <input
          type="text"
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button
          onClick={handleSend}
          className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-light)] px-6 rounded-lg"
        >
          Enviar
        </button>
      </div>
    </div>
   </Layout>
  );
};