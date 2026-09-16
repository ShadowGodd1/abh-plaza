"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  body: string;
  time: string;
}

interface TenantMessagesClientProps {
  initialMessages: Message[];
}

export default function TenantMessagesClient({ initialMessages }: TenantMessagesClientProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, sender: "tenant", body: newMessage, time: new Date().toISOString() },
    ]);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      <h1 className="text-xl font-semibold text-text-primary mb-4">Messages</h1>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[85%] rounded-[var(--radius-lg)] px-4 py-2.5",
              msg.sender === "admin"
                ? "bg-surface-2 text-text-primary rounded-bl-sm mr-auto"
                : "bg-ink text-white rounded-br-sm ml-auto"
            )}
          >
            <p className="text-sm">{msg.body}</p>
            <p className={cn(
              "text-[10px] mt-1",
              msg.sender === "admin" ? "text-text-3" : "text-white/50"
            )}>
              {new Date(msg.time).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <button
          onClick={handleSend}
          className="w-10 h-10 bg-gold rounded-[var(--radius-md)] flex items-center justify-center text-ink hover:bg-gold-light transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
