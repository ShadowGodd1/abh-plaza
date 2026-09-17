import { redirect } from "next/navigation";
import { getMessageThreads, getCurrentOccupancy } from "@/lib/data";
import OwnerMessagesClient from "./owner-messages-client";

export default async function OwnerMessagesPage() {
  const occupancy = await getCurrentOccupancy("owner");
  if (!occupancy) redirect("/login");

  const threads = await getMessageThreads();

  return <OwnerMessagesClient threads={threads} ownerName={occupancy.personName} />;
}
