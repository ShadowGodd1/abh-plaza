import { getMaintenanceRequests } from "@/lib/data";
import MaintenanceListClient from "./maintenance-list-client";

export default async function MaintenancePage() {
  const raw = await getMaintenanceRequests();

  const requests = raw.map((r: any) => ({
    id: String(r.id || ""),
    issue: r.issue || r.description || "",
    unit: typeof r.unit === "object" && r.unit !== null ? r.unit.label : r.unit,
    raisedBy: typeof r.raised_by_person === "object" && r.raised_by_person !== null
      ? r.raised_by_person.full_name
      : r.raisedBy,
    date: r.date || r.created_at || "",
    status: r.status || "open",
    cost: r.cost || 0,
  }));

  return <MaintenanceListClient initialRequests={requests} />;
}
