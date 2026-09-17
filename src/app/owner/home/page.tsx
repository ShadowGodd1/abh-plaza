import { redirect } from "next/navigation";
import { getDashboardMetrics, getCurrentOccupancy } from "@/lib/data";
import OwnerHomeClient from "./owner-home-client";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function OwnerHomePage() {
  const occupancy = await getCurrentOccupancy("owner");
  if (!occupancy) redirect("/login");

  const metrics = await getDashboardMetrics();
  const greeting = getGreeting();

  return <OwnerHomeClient metrics={metrics} greeting={greeting} ownerName={occupancy.personName.split(" ")[0]} unitLabel={occupancy.unitLabel} />;
}
