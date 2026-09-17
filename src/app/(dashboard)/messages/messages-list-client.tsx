"use client";

import { useState } from "react";
import { Search, Send, Lock, MessageSquare, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  sender: string;
  body: string;
  time: string;
  isInternal?: boolean;
  channel?: "in_app" | "sms";
};

type MessageThread = {
  id: string;
  person: string;
  unit: string;
  subject: string;
  lastMessage: string;
  timestamp: string;
  timestampFormatted: string;
  unread: boolean;
  messages: Message[];
};

interface MessagesListClientProps {
  initialMessages: MessageThread[];
}

export default function MessagesListClient({ initialMessages }: MessagesListClientProps) {
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden flex" style={{ height: "calc(100vh - 280px)", minHeight: "400px" }}>
      {/* Thread list */}
      <div className={cn(
        "w-full md:w-80 border-r border-border flex flex-col",
        selectedThread ? "hidden md:flex" : "flex"
      )}>
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full h-9 pl-9 pr-3 text-sm bg-surface-2 border-none rounded-[var(--radius-md)] focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {initialMessages.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-border hover:bg-surface-2/50 transition-colors",
                selectedThread?.id === thread.id && "bg-surface-2/50"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-text-primary">{thread.person}</span>
                <span className="text-xs text-text-3">{thread.unit}</span>
              </div>
              <p className="text-xs text-text-3 truncate">{thread.lastMessage}</p>
              {thread.unread && (
                <span className="inline-block mt-1 w-5 h-5 rounded-full bg-gold text-ink text-[10px] font-medium flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message area */}
      <div className={cn(
        "flex-1 flex flex-col",
        !selectedThread && "hidden md:flex"
      )}>
        {selectedThread ? (
          <>
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">{selectedThread.person}</p>
                <p className="text-xs text-text-3">Unit {selectedThread.unit}</p>
              </div>
              <button
                onClick={() => setSelectedThread(null)}
                className="md:hidden text-text-3 hover:text-text-primary"
              >
                Back
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedThread.messages.map((msg) => {
                if (msg.isInternal) {
                  return (
                    <div
                      key={msg.id}
                      className="max-w-[85%] rounded-[var(--radius-lg)] px-4 py-2.5 ml-auto border border-dashed border-gold/40 bg-gold/5 relative"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Lock size={11} className="text-gold" />
                        <span className="text-[10px] font-medium text-gold uppercase tracking-wide">Internal</span>
                      </div>
                      <p className="text-sm text-text-2">{msg.body}</p>
                      <p className="text-[10px] mt-1 text-text-3">{msg.time}</p>
                    </div>
                  );
                }
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[80%] rounded-[var(--radius-lg)] px-4 py-2.5",
                      msg.sender === "admin"
                        ? "bg-ink text-white ml-auto rounded-br-sm"
                        : "bg-surface-2 text-text-primary rounded-bl-sm"
                    )}
                  >
                    <p className="text-sm">{msg.body}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className={cn(
                        "text-[10px]",
                        msg.sender === "admin" ? "text-white/50" : "text-text-3"
                      )}>
                        {msg.time}
                      </p>
                      {msg.channel && (
                        <span className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-medium",
                          msg.sender === "admin"
                            ? "bg-white/10 text-white/70"
                            : "bg-surface border border-border text-text-3"
                        )}>
                          {msg.channel === "in_app" ? <MessageSquare size={10} /> : <Phone size={10} />}
                          {msg.channel === "in_app" ? "In-app" : "SMS"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <button className="w-10 h-10 bg-gold rounded-[var(--radius-md)] flex items-center justify-center text-ink hover:bg-gold-light transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-3 text-sm">
            Select a conversation to view messages
          </div>
        )}
      </div>
    </div>
  );
}
