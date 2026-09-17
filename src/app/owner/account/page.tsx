import { redirect } from "next/navigation";
import { getCurrentOccupancy } from "@/lib/data";
import OwnerAccountClient from "./owner-account-client";

export default async function OwnerAccountPage() {
  const occupancy = await getCurrentOccupancy("owner");
  if (!occupancy) redirect("/login");

  const initials = occupancy.personName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return <OwnerAccountClient name={occupancy.personName} initials={initials} unitLabel={occupancy.unitLabel} />;
}
