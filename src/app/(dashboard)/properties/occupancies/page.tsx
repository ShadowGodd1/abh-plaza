import Link from "next/link";
import { getOccupancies, getUnits } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import OccupanciesListClient from "./occupancies-list-client";

export default async function OccupanciesPage() {
  const [occupancies, units] = await Promise.all([getOccupancies(), getUnits()]);

  const unitMap = new Map<string, string>();
  (units as any[]).forEach((u: any) => {
    const id = u.id;
    const label = u.label || u.units?.label || "";
    if (id && label) unitMap.set(id, label);
  });

  const mapped = (occupancies as any[]).map((occ: any) => ({
    ...occ,
    unit: occ.unit || unitMap.get(occ.unitId || occ.unit_id) || "—",
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
            <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
            <span>/</span>
            <span>Properties</span>
            <span>/</span>
            <span className="text-text-primary">Occupancies</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Occupancies</h1>
          <p className="text-sm text-text-3 mt-1">Track who occupies what, and when.</p>
        </div>
      </div>

      <OccupanciesListClient initialOccupancies={mapped} />
    </div>
  );
}
