import { getMessageThreads } from "@/lib/data";
import OwnerMessagesClient from "./owner-messages-client";

export default async function OwnerMessagesPage() {
  const threads = await getMessageThreads();

  return <OwnerMessagesClient threads={threads} />;
}
