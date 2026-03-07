"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const message = input.trim();
    if (!message || loading) return;

    const history = messages.map(({ role, content }) => ({ role, content }));
    const userMessage: Message = { role: "user", content: message };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Add an empty assistant message that we'll stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });

      if (!response.ok || !response.body) throw new Error("Request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Read stream chunks and append to the last message
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const token = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + token,
          };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: 720,
        margin: "0 auto",
        padding: "0 16px",
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px 0 12px", borderBottom: "1px solid #e5e7eb" }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#111827" }}>eMed Assistant</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
          Ask anything about the weight management programme
        </p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
        {messages.length === 0 && (
          <div style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", marginTop: 60 }}>
            Ask a question to get started
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "10px 14px",
                borderRadius: 12,
                fontSize: 14,
                lineHeight: 1.6,
                background: msg.role === "user" ? "#2563eb" : "#ffffff",
                color: msg.role === "user" ? "#ffffff" : "#111827",
                border: msg.role === "assistant" ? "1px solid #e5e7eb" : "none",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content || (loading && i === messages.length - 1 ? "▋" : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 0 24px", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask about eligibility, medications, side effects..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 14,
              outline: "none",
              background: loading ? "#f9fafb" : "#ffffff",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: loading || !input.trim() ? "#d1d5db" : "#2563eb",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 500,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
