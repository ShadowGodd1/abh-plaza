"use client";

import { useState, useMemo } from "react";
import { LayoutGrid, List, Search, Plus, AlertTriangle, FileText, Calendar, TrendingUp, CheckCircle2, Camera, X, Download, Upload, Image as ImageIcon } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import Drawer from "@/components/ui/drawer";
import StatusBadge from "@/components/ui/status-badge";
import MoneyDisplay from "@/components/ui/money-display";
import Button from "@/components/ui/button";
import ImageGallery, { type GalleryImage } from "@/components/ui/image-gallery";
import { cn, formatCurrency, getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import { DEMO_OCCUPANCIES, DEMO_INVOICES, DEMO_MAINTENANCE } from "@/lib/demo-data";
import { createUnit } from "@/lib/actions";

type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
  completedBy: string;
  completedAt: string;
  notes: string;
  showNotes: boolean;
};

function formatChecklistDate(): string {
  const now = new Date();
  return now.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) + ", " + now.toLocaleTimeString("en-KE", { hour: "numeric", minute: "2-digit", hour12: true });
}

const MOVE_IN_ITEMS: ChecklistItem[] = [
  { id: "mi-1", label: "Keys received", checked: false, completedBy: "", completedAt: "", notes: "", showNotes: false },
  { id: "mi-2", label: "Unit inspected", checked: false, completedBy: "", completedAt: "", notes: "", showNotes: false },
  { id: "mi-3", label: "Photos captured", checked: false, completedBy: "", completedAt: "", notes: "", showNotes: false },
  { id: "mi-4", label: "Deposit recorded", checked: false, completedBy: "", completedAt: "", notes: "", showNotes: false },
  { id: "mi-5", label: "Welcome message sent", checked: false, completedBy: "", completedAt: "", notes: "", showNotes: false },
];

const MOVE_OUT_ITEMS: ChecklistItem[] = [
  { id: "mo-1", label: "Keys returned", checked: false, completedBy: "", completedAt: "", notes: "", showNotes: false },
  { id: "mo-2", label: "Unit inspected", checked: false, completedBy: "", completedAt: "", notes: "", showNotes: false },
  { id: "mo-3", label: "Photos captured", checked: false, completedBy: "", completedAt: "", notes: "", showNotes: false },
  { id: "mo-4", label: "Outstanding balance checked", checked: false, completedBy: "", completedAt: "", notes: "", showNotes: false },
  { id: "mo-5", label: "Final notes recorded", checked: false, completedBy: "", completedAt: "", notes: "", showNotes: false },
];

function ChecklistSection({
  type,
  occupantName,
}: {
  type: "move-in" | "move-out";
  occupantName: string;
}) {
  const [items, setItems] = useState<ChecklistItem[]>(
    type === "move-in" ? [...MOVE_IN_ITEMS] : [...MOVE_OUT_ITEMS]
  );
  const completedCount = items.filter((i) => i.checked).length;

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const willBeChecked = !item.checked;
        return {
          ...item,
          checked: willBeChecked,
          completedBy: willBeChecked ? "Admin User" : "",
          completedAt: willBeChecked ? formatChecklistDate() : "",
          notes: willBeChecked ? item.notes : "",
          showNotes: false,
        };
      })
    );
  };

  const updateNotes = (id: string, notes: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const toggleNotes = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, showNotes: !item.showNotes } : item))
    );
  };

  return (
    <div className="mt-3 bg-surface rounded-[var(--radius-md)] p-3 border border-border/50">
      <div className="flex items-center justify-between mb-2.5">
        <h5 className="text-xs font-medium text-text-2">
          {type === "move-in" ? "Move-in Checklist" : "Move-out Checklist"}
        </h5>
        <span className="text-[10px] text-text-3 font-medium">
          {completedCount} of {items.length} completed
        </span>
      </div>
      <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden mb-3">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            completedCount === items.length ? "bg-success" : "bg-gold"
          )}
          style={{ width: `${(completedCount / items.length) * 100}%` }}
        />
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id}>
            <div className="flex items-center gap-2.5 group">
              <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                <div
                  onClick={() => toggle(item.id)}
                  className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                    item.checked
                      ? "bg-gold border-gold"
                      : "border-border group-hover:border-gold/50"
                  )}
                >
                  {item.checked && <CheckCircle2 size={12} className="text-ink" />}
                </div>
                <span
                  className={cn(
                    "text-xs",
                    item.checked ? "text-text-3 line-through" : "text-text-primary"
                  )}
                >
                  {item.label}
                </span>
              </label>
              {item.checked && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleNotes(item.id)}
                    className="text-text-3 hover:text-gold text-[10px] underline transition-colors"
                  >
                    Notes
                  </button>
                  <button
                    className="text-text-3 hover:text-gold transition-colors"
                    title="Attach photo"
                  >
                    <Camera size={12} />
                  </button>
                </div>
              )}
            </div>
            {item.checked && (
              <div className="ml-[26px] mt-1 space-y-1">
                <div className="flex items-center gap-2 text-[10px] text-text-3">
                  <span>By <span className="text-text-2 font-medium">{item.completedBy}</span></span>
                  <span>·</span>
                  <span>{item.completedAt}</span>
                </div>
                {item.showNotes && (
                  <div className="mt-1">
                    <textarea
                      value={item.notes}
                      onChange={(e) => updateNotes(item.id, e.target.value)}
                      placeholder="Add notes..."
                      className="w-full h-16 px-2.5 py-1.5 text-[11px] bg-surface-2/50 border border-border rounded-[var(--radius-sm)] focus:outline-none focus:ring-1 focus:ring-gold resize-none text-text-primary placeholder:text-text-3"
                    />
                  </div>
                )}
                {!item.showNotes && item.notes && (
                  <p className="text-[10px] text-text-3 italic">{item.notes}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type UnitTab = "overview" | "occupancy" | "billing" | "maintenance" | "documents" | "activity" | "photos";

interface Unit {
  id: string;
  label: string;
  type: string;
  floor: number;
  status: string;
  tenant: string | null;
  rent: number;
}

function formatFloor(floor: number): string {
  if (floor === 0) return "Ground";
  const suffix = floor === 1 ? "st" : floor === 2 ? "nd" : floor === 3 ? "rd" : "th";
  return `${floor}${suffix}`;
}

export default function UnitsListClient({ initialUnits }: { initialUnits: Unit[] }) {
  const [view, setView] = useState<"grid" | "table">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Unit | null>(null);
  const [unitTab, setUnitTab] = useState<UnitTab>("overview");
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [addUnitLoading, setAddUnitLoading] = useState(false);
  const [addUnitError, setAddUnitError] = useState("");
  const [addUnitSuccess, setAddUnitSuccess] = useState(false);

  const filteredUnits = useMemo(() => {
    return initialUnits.filter((unit) => {
      const matchesSearch =
        unit.label.toLowerCase().includes(search.toLowerCase()) ||
        (unit.tenant && unit.tenant.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === "all" || unit.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialUnits, search, statusFilter]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search units or tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Status</option>
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
          <option value="under_maintenance">Under Maintenance</option>
          <option value="reserved">Reserved</option>
        </select>
        <div className="flex items-center gap-1 bg-surface border border-border rounded-[var(--radius-md)] p-0.5">
          <button
            onClick={() => setView("table")}
            className={cn(
              "w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center transition-colors",
              view === "table" ? "bg-surface-2 text-text-primary" : "text-text-3 hover:text-text-primary"
            )}
            aria-label="Table view"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setView("grid")}
            className={cn(
              "w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center transition-colors",
              view === "grid" ? "bg-surface-2 text-text-primary" : "text-text-3 hover:text-text-primary"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
        <Button onClick={() => { setShowAddUnit(true); setAddUnitError(""); setAddUnitSuccess(false); }}>
          <Plus size={16} />
          Add Unit
        </Button>
      </div>

      {view === "table" && (
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-2/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Unit</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Floor</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Tenant</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Rent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUnits.map((unit) => (
                  <tr
                    key={unit.id}
                    className="hover:bg-surface-2/30 transition-colors cursor-pointer"
                    onClick={() => setSelected(unit)}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-text-primary">{unit.label}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-2">{unit.type}</td>
                    <td className="px-4 py-3 text-sm text-text-2">{formatFloor(unit.floor)}</td>
                    <td className="px-4 py-3"><StatusBadge status={unit.status} size="sm" /></td>
                    <td className="px-4 py-3 text-sm text-text-2">{unit.tenant || "\u2014"}</td>
                    <td className="px-4 py-3 text-sm text-text-primary text-right font-tabular">
                      {unit.rent > 0 ? formatCurrency(unit.rent) : "\u2014"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUnits.length === 0 && (
            <EmptyState
              title="No units found"
              description="No units match your search criteria."
              icon={<LayoutGrid size={24} />}
            />
          )}
        </div>
      )}

      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              onClick={() => setSelected(unit)}
              className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 hover:shadow-[var(--shadow-card)] transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-lg font-semibold text-text-primary">{unit.label}</span>
                <StatusBadge status={unit.status} size="sm" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-text-2">{unit.type}</p>
                <p className="text-sm text-text-3">{unit.floor === 0 ? "Ground Floor" : `${formatFloor(unit.floor)} Floor`}</p>
                {unit.tenant && (
                  <p className="text-sm text-text-2 mt-2 pt-2 border-t border-border">{unit.tenant}</p>
                )}
                {unit.rent > 0 && (
                  <p className="text-sm font-medium text-text-primary font-tabular mt-1">
                    {formatCurrency(unit.rent)} / month
                  </p>
                )}
              </div>
            </div>
          ))}
          {filteredUnits.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                title="No units found"
                description="No units match your search criteria."
                icon={<LayoutGrid size={24} />}
              />
            </div>
          )}
        </div>
      )}

      <Drawer
        open={!!selected}
        onClose={() => { setSelected(null); setUnitTab("overview"); }}
        title={`Unit ${selected?.label || ""}`}
        description={selected ? `${selected.type} · ${formatFloor(selected.floor)} Floor` : ""}
        size="lg"
      >
        {selected && (
          <UnitDetailTabs unit={selected} tab={unitTab} onTabChange={setUnitTab} />
        )}
      </Drawer>

      {/* Add Unit Modal */}
      {showAddUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setShowAddUnit(false)} />
          <div className="relative z-10 w-full max-w-md bg-surface rounded-[var(--radius-lg)] border border-border shadow-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-1">Add Unit</h2>
            <p className="text-sm text-text-3 mb-5">Create a new property unit.</p>

            {addUnitError && (
              <div className="mb-4 p-3 rounded-[var(--radius-md)] bg-danger-bg border border-danger/20">
                <p className="text-sm text-danger">{addUnitError}</p>
              </div>
            )}

            {addUnitSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-3">
                  <span className="text-success text-lg">✓</span>
                </div>
                <p className="text-sm text-text-primary font-medium">Unit created successfully</p>
                <Button className="mt-4" onClick={() => { setShowAddUnit(false); setAddUnitSuccess(false); window.location.reload(); }}>Done</Button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setAddUnitLoading(true);
                  setAddUnitError("");
                  const form = new FormData(e.currentTarget);
                  const result = await createUnit(form);
                  setAddUnitLoading(false);
                  if (result?.error) {
                    setAddUnitError(result.error);
                  } else {
                    setAddUnitSuccess(true);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Unit Number *</label>
                  <input
                    name="label"
                    required
                    placeholder="e.g. 01, 02, 03"
                    className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Unit Type *</label>
                  <select
                    name="unit_type_id"
                    required
                    className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Select unit type</option>
                    <option value="ut-1">Bedsitter</option>
                    <option value="ut-2">1 Bedroom</option>
                    <option value="ut-3">2 Bedroom</option>
                    <option value="ut-4">3 Bedroom</option>
                    <option value="ut-5">Shop</option>
                    <option value="ut-6">Madrasa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Floor</label>
                  <select
                    name="floor"
                    className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="0">Ground Floor</option>
                    <option value="1">1st Floor</option>
                    <option value="2">2nd Floor</option>
                    <option value="3">3rd Floor</option>
                    <option value="4">4th Floor</option>
                    <option value="5">5th Floor</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setShowAddUnit(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" loading={addUnitLoading} className="flex-1">
                    Create Unit
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const UNIT_TABS: { key: UnitTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "occupancy", label: "Occupancy" },
  { key: "billing", label: "Billing" },
  { key: "maintenance", label: "Maintenance" },
  { key: "documents", label: "Documents" },
  { key: "photos", label: "Photos" },
  { key: "activity", label: "Activity" },
];

function UnitDetailTabs({
  unit,
  tab,
  onTabChange,
}: {
  unit: Unit;
  tab: UnitTab;
  onTabChange: (t: UnitTab) => void;
}) {
  const occupancies = DEMO_OCCUPANCIES.filter((o) => o.unitId === unit.id);
  const invoices = DEMO_INVOICES.filter((i) => i.unit === unit.label);
  const maintenance = DEMO_MAINTENANCE.filter((m) => m.unit === unit.label);

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {UNIT_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={cn(
              "px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
              tab === t.key
                ? "border-gold text-gold"
                : "border-transparent text-text-3 hover:text-text-primary"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-4">
          <div>
            <StatusBadge status={unit.status} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-3">Unit Type</span>
              <span className="text-text-primary font-medium">{unit.type}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-3">Floor</span>
              <span className="text-text-primary font-medium">{formatFloor(unit.floor)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-3">Monthly Rent</span>
              <MoneyDisplay amount={unit.rent} size="lg" />
            </div>
          </div>
          {unit.tenant && (
            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-xs text-text-3 uppercase tracking-wider">Current Occupant</p>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Name</span>
                <span className="text-text-primary font-medium">{unit.tenant}</span>
              </div>
            </div>
          )}
          {!unit.tenant && (
            <div className="border-t border-border pt-4">
              <p className="text-sm text-text-3">No current occupant</p>
            </div>
          )}
        </div>
      )}

      {tab === "occupancy" && (
        <div className="space-y-4">
          {occupancies.length === 0 ? (
            <p className="text-sm text-text-3">No occupancy records for this unit.</p>
          ) : (
            <div className="space-y-3">
              {occupancies.map((occ) => {
                const endDate = (occ as any).endDate as string | null;
                const isExpired = endDate && new Date(endDate) < new Date();
                const leaseEnd = endDate ? new Date(endDate) : null;
                const today = new Date();
                const daysUntilExpiry = leaseEnd
                  ? Math.ceil((leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                  : null;
                const isExpiringSoon = daysUntilExpiry !== null && !isExpired && daysUntilExpiry <= 60;

                const leaseId = `LEASE-${occ.startDate.substring(0, 4)}-${occ.id.slice(-3).toUpperCase()}`;

                return (
                  <div
                    key={occ.id}
                    className={cn(
                      "rounded-[var(--radius-md)] p-4 border",
                      occ.status === "active" ? "bg-surface-2/50 border-border" : "bg-surface-2/30 border-border/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-text-primary">{occ.person}</span>
                      <StatusBadge status={occ.status} size="sm" />
                    </div>
                    <div className="flex justify-between text-xs text-text-3 mb-3">
                      <span className="capitalize">{occ.type}</span>
                      <span>{formatDate(occ.startDate)} — {occ.endDate ? formatDate(occ.endDate) : "Present"}</span>
                    </div>

                    {occ.status === "active" && (
                      <div className="border-t border-border pt-3 space-y-3">
                        {isExpired && (
                          <div className="flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-md)] bg-danger-bg border border-danger/20">
                            <AlertTriangle size={16} className="text-danger shrink-0" />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-danger">Lease Expired — Renewal Required</span>
                              <p className="text-xs text-danger/70 mt-0.5">Expired on {formatDate(endDate!)}. Please initiate lease renewal.</p>
                            </div>
                            <button className="px-3 py-1.5 text-xs font-medium bg-danger text-white rounded-[var(--radius-sm)] hover:bg-danger/90 transition-colors shrink-0">
                              Renew Lease
                            </button>
                          </div>
                        )}

                        {isExpiringSoon && !isExpired && (
                          <div className="flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-md)] bg-warning-bg border border-warning/20">
                            <AlertTriangle size={16} className="text-warning shrink-0" />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-warning">Lease Expiring Soon</span>
                              <p className="text-xs text-warning/70 mt-0.5">Expires in {daysUntilExpiry} days on {formatDate(endDate!)}</p>
                            </div>
                          </div>
                        )}

                        {!isExpired && !isExpiringSoon && (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-success-bg border border-success/20">
                            <CheckCircle2 size={14} className="text-success shrink-0" />
                            <span className="text-xs font-medium text-success">Active Lease</span>
                          </div>
                        )}

                        <div className="bg-surface rounded-[var(--radius-md)] p-4 border border-border/50">
                          <h4 className="text-xs font-medium text-text-3 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                            <FileText size={12} />
                            Lease Details
                          </h4>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-surface-2/50 rounded-[var(--radius-sm)] p-2.5">
                              <p className="text-[10px] text-text-3 uppercase">Lease ID</p>
                              <p className="text-xs font-medium text-text-primary font-tabular mt-0.5">
                                {leaseId}
                              </p>
                            </div>
                            <div className="bg-surface-2/50 rounded-[var(--radius-sm)] p-2.5">
                              <p className="text-[10px] text-text-3 uppercase">Monthly Rent</p>
                              <p className="text-sm font-medium text-text-primary font-tabular mt-0.5">
                                KES {unit.rent.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-surface-2/50 rounded-[var(--radius-sm)] p-2.5">
                              <p className="text-[10px] text-text-3 uppercase">Deposit Amount</p>
                              <p className="text-sm font-medium text-text-primary font-tabular mt-0.5">
                                KES {(unit.rent * 2).toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-surface-2/50 rounded-[var(--radius-sm)] p-2.5">
                              <p className="text-[10px] text-text-3 uppercase">Lease Term</p>
                              <p className="text-sm font-medium text-text-primary mt-0.5">
                                12 months
                              </p>
                            </div>
                            <div className="bg-surface-2/50 rounded-[var(--radius-sm)] p-2.5">
                              <p className="text-[10px] text-text-3 uppercase">Start Date</p>
                              <p className="text-sm font-medium text-text-primary mt-0.5">
                                {formatDate(occ.startDate)}
                              </p>
                            </div>
                            <div className="bg-surface-2/50 rounded-[var(--radius-sm)] p-2.5">
                              <p className="text-[10px] text-text-3 uppercase">End Date</p>
                              <p className="text-sm font-medium text-text-primary mt-0.5">
                                {endDate ? formatDate(endDate) : "Month-to-month"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                              <TrendingUp size={12} className="text-text-3" />
                              <span className="text-text-3">Escalation Clause:</span>
                              <span className="text-text-primary font-medium">10% annual escalation on anniversary</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <FileText size={12} className="text-text-3" />
                              <span className="text-text-3">Auto-renewal:</span>
                              <span className="text-text-primary font-medium">No</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Calendar size={12} className="text-text-3" />
                              <span className="text-text-3">Lease Status:</span>
                              <span className={cn(
                                "font-medium",
                                isExpired ? "text-danger" : isExpiringSoon ? "text-warning" : "text-success"
                              )}>
                                {isExpired ? "Expired" : isExpiringSoon ? "Expiring Soon" : "Active"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-surface rounded-[var(--radius-md)] p-3 border border-border/50">
                          <p className="text-[10px] text-text-3 uppercase mb-1">Special Terms</p>
                          <p className="text-xs text-text-2">Standard residential lease with maintenance obligations per building guidelines. Tenant responsible for utility payments beyond base rent.</p>
                        </div>
                      </div>
                    )}

                    {occ.status === "ended" && (
                      <div className="border-t border-border pt-3 mt-1">
                        <p className="text-xs text-text-3 mb-1">This occupancy has ended.</p>
                        <ChecklistSection type="move-out" occupantName={occ.person} />
                      </div>
                    )}

                    {occ.status === "active" && (
                      <ChecklistSection type="move-in" occupantName={occ.person} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "billing" && (
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <p className="text-sm text-text-3">No invoices for this unit.</p>
          ) : (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="bg-surface-2/50 rounded-[var(--radius-md)] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary font-tabular">{inv.number}</span>
                    <StatusBadge status={inv.status} size="sm" />
                  </div>
                  <div className="flex justify-between text-xs text-text-3">
                    <span>Due: {formatDate(inv.dueDate)}</span>
                    <span className="font-tabular">{formatCurrency(inv.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "maintenance" && (
        <div className="space-y-4">
          {maintenance.length === 0 ? (
            <p className="text-sm text-text-3">No maintenance requests for this unit.</p>
          ) : (
            <div className="space-y-3">
              {maintenance.map((req) => (
                <div key={req.id} className="bg-surface-2/50 rounded-[var(--radius-md)] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{req.issue}</span>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <div className="flex justify-between text-xs text-text-3">
                    <span>{formatDate(req.date)}</span>
                    {req.cost != null && <span className="font-tabular">{formatCurrency(req.cost)}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "documents" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-surface-2/50 rounded-[var(--radius-md)] p-3 group">
              <div className="w-8 h-8 rounded bg-gold/10 flex items-center justify-center flex-shrink-0">
                <FileText size={14} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">Lease Agreement {unit.label}.pdf</p>
                <p className="text-xs text-text-3">Uploaded Sep 1, 2025 · 1.2 MB</p>
              </div>
              <button className="text-text-3 hover:text-gold transition-colors opacity-0 group-hover:opacity-100" aria-label="Download document">
                <Download size={14} />
              </button>
            </div>
            <div className="flex items-center gap-3 bg-surface-2/50 rounded-[var(--radius-md)] p-3 group">
              <div className="w-8 h-8 rounded bg-gold/10 flex items-center justify-center flex-shrink-0">
                <ImageIcon size={14} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">Unit Photos.zip</p>
                <p className="text-xs text-text-3">Uploaded Aug 15, 2025 · 4.8 MB</p>
              </div>
              <button className="text-text-3 hover:text-gold transition-colors opacity-0 group-hover:opacity-100" aria-label="Download document">
                <Download size={14} />
              </button>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold-dark transition-colors">
            <Upload size={12} />
            Attach File
          </button>
        </div>
      )}

      {tab === "activity" && (
        <div className="space-y-3">
          <div className="bg-surface-2/50 rounded-[var(--radius-md)] p-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green mt-1.5 shrink-0" />
              <div>
                <p className="text-sm text-text-primary">Unit status changed to <span className="font-medium">{unit.status.replace("_", " ")}</span></p>
                <p className="text-xs text-text-3 mt-0.5">Sep 14, 2026 · 9:00 AM</p>
              </div>
            </div>
          </div>
          {unit.tenant && (
            <div className="bg-surface-2/50 rounded-[var(--radius-md)] p-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-text-primary">Occupant assigned: <span className="font-medium">{unit.tenant}</span></p>
                  <p className="text-xs text-text-3 mt-0.5">Sep 1, 2025 · 10:00 AM</p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-surface-2/50 rounded-[var(--radius-md)] p-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-text-3 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm text-text-primary">Monthly rent updated to <span className="font-medium font-tabular">{formatCurrency(unit.rent)}</span></p>
                <p className="text-xs text-text-3 mt-0.5">Aug 15, 2025 · 2:30 PM</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-2/50 rounded-[var(--radius-md)] p-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-text-3 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm text-text-primary">Unit created in system</p>
                <p className="text-xs text-text-3 mt-0.5">Jan 1, 2023 · 8:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "photos" && (
        <UnitPhotosTab unit={unit} />
      )}
    </div>
  );
}

function UnitPhotosTab({ unit }: { unit: Unit }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const unitImages: GalleryImage[] = [
    { src: "", alt: "Living Room", caption: "Living Room" },
    { src: "", alt: "Kitchen", caption: "Kitchen" },
    { src: "", alt: "Bedroom", caption: "Bedroom" },
    { src: "", alt: "Exterior", caption: "Exterior" },
  ];

  const gradients = [
    "from-amber-200 to-orange-300",
    "from-emerald-200 to-teal-300",
    "from-blue-200 to-indigo-300",
    "from-rose-200 to-pink-300",
  ];

  return (
    <div className="space-y-4">
      {/* Main image area */}
      <div className="relative">
        <div className="aspect-video rounded-[var(--radius-md)] overflow-hidden bg-surface-2 border border-border">
          <div className={`w-full h-full bg-gradient-to-br ${gradients[selectedImageIndex]} flex flex-col items-center justify-center`}>
            <Camera size={32} className="text-ink/30 mb-2" />
            <span className="text-sm font-medium text-ink/50">{unit.label}</span>
            <span className="text-xs text-ink/40 mt-1">{unitImages[selectedImageIndex].caption}</span>
          </div>
        </div>
        <button className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-surface/90 border border-border rounded-[var(--radius-sm)] text-xs font-medium text-text-primary hover:bg-surface transition-colors shadow-sm">
          <Upload size={12} />
          Upload Photo
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2">
        {unitImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImageIndex(i)}
            className={cn(
              "relative w-20 h-20 rounded-[var(--radius-sm)] overflow-hidden border-2 transition-colors property-photo-thumb shrink-0",
              i === selectedImageIndex
                ? "border-gold"
                : "border-transparent hover:border-border-strong"
            )}
          >
            <div className={`w-full h-full bg-gradient-to-br ${gradients[i]} flex items-center justify-center`}>
              <span className="text-[10px] font-medium text-ink/50">{img.caption}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Upload button (mobile) */}
      <button className="sm:hidden flex items-center justify-center gap-2 w-full py-3 border border-dashed border-border rounded-[var(--radius-md)] text-sm font-medium text-text-3 hover:text-gold hover:border-gold/50 transition-colors">
        <Upload size={16} />
        Upload Photo
      </button>
    </div>
  );
}
