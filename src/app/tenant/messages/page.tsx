import { redirect } from "next/navigation";
import { getMessageThreads, getCurrentOccupancy } from "@/lib/data";
import TenantMessagesClient from "./tenant-messages-client";

export default async function TenantMessagesPage() {
  const occupancy = await getCurrentOccupancy("tenant");
  if (!occupancy) redirect("/login");

  const threads = await getMessageThreads();

  const tenantThread = threads.find(
    (t: any) => t.unit === occupancy.unitLabel || t.person === occupancy.personName
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
