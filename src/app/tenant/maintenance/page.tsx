import { getMaintenanceRequests } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import TenantMaintenanceClient from "./tenant-maintenance-client";

export default async function TenantMaintenancePage() {
  const requests = await getMaintenanceRequests();

  const tenantRequests = requests
    .filter((r: any) => r.unit === "A-04" || r.unit?.label === "A-04")
    .map((r: any) => ({
      id: r.id,
      issue: r.issue || r.description,
      date: r.created_at || r.date,
      dateFormatted: formatDate(r.created_at || r.date),
      status: r.status,
    }));

  return <TenantMaintenanceClient initialRequests={tenantRequests} />;
}
