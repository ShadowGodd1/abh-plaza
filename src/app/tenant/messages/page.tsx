import { getMessageThreads } from "@/lib/data";
import TenantMessagesClient from "./tenant-messages-client";

export default async function TenantMessagesPage() {
  const threads = await getMessageThreads();

  const tenantThread = threads.find(
    (t: any) => t.unit === "A-04" || t.person === "Ahmed Noor"
  );

  const messages = tenantThread
    ? tenantThread.messages.map((m: any) => ({
        id: m.id,
        sender: m.sender,
        body: m.body,
        time: m.time || m.sent_at,
      }))
    : [];

  return (
    <TenantMessagesClient initialMessages={messages} />
  );
}
