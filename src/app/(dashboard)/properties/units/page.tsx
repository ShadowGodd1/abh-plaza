import { Plus } from "lucide-react";
import Link from "next/link";
import { getUnits } from "@/lib/data";
import Button from "@/components/ui/button";
import UnitsListClient from "./units-list-client";

export default async function UnitsPage() {
  const units = await getUnits();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
            <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
            <span>/</span>
            <span>Properties</span>
            <span>/</span>
            <span className="text-text-primary">Units</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Units</h1>
          <p className="text-sm text-text-3 mt-1">Manage and overview all property units.</p>
        </div>
        <Button>
          <Plus size={16} />
          Add Unit
        </Button>
      </div>

      <UnitsListClient initialUnits={units} />
    </div>
  );
}
