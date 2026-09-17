import { redirect } from "next/navigation";
import { getCurrentOccupancy } from "@/lib/data";
import TenantAccountClient from "./tenant-account-client";

export default async function TenantAccountPage() {
  const occupancy = await getCurrentOccupancy("tenant");
  if (!occupancy) redirect("/login");

  const tenantName = occupancy.personName;
  const initials = tenantName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <TenantAccountClient
      name={tenantName}
      initials={initials}
      unitLabel={occupancy.unitLabel}
    />
  );
}
