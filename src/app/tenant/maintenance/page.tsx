import { redirect } from "next/navigation";
import { getMaintenanceRequests, getCurrentOccupancy } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import TenantMaintenanceClient from "./tenant-maintenance-client";

export default async function TenantMaintenancePage() {
  const occupancy = await getCurrentOccupancy("tenant");
  if (!occupancy) redirect("/login");

  const requests = await getMaintenanceRequests();

  const tenantRequests = requests
    .filter((r: any) => r.unit === occupancy.unitLabel || r.unit?.label === occupancy.unitLabel)
    .map((r: any) => ({
      id: r.id,
      issue: r.issue || r.description,
      date: r.created_at || r.date,
      dateFormatted: formatDate(r.created_at || r.date),
      status: r.status,
    }));

  return <TenantMaintenanceClient initialRequests={tenantRequests} unitLabel={occupancy.unitLabel} />;
}
