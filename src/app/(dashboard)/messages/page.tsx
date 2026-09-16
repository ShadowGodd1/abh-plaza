import { getMessageThreads } from "@/lib/data";
import MessagesListClient from "./messages-list-client";

function formatMessageTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
}

export default async function MessagesPage() {
  const rawMessages = await getMessageThreads();

  const messages = rawMessages.map((m: any) => ({
    id: m.id,
    person: m.sender_name || m.tenant || "Unknown",
    unit: m.unit || "",
    subject: m.subject || "",
    lastMessage: m.body || m.preview || "",
    timestamp: m.sent_at || m.date || "",
    timestampFormatted: formatMessageTime(m.sent_at || m.date),
    unread: m.unread || false,
    messages: m.messages || [],
  }));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
          <span className="text-text-primary">Messages</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Messages</h1>
        <p className="text-sm text-text-3 mt-1">Communication threads with tenants and owners.</p>
      </div>

      <MessagesListClient initialMessages={messages} />
    </div>
  );
}
