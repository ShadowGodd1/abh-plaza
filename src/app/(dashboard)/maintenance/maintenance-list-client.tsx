"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Camera, Loader2, X } from "lucide-react";
import Button from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import Drawer from "@/components/ui/drawer";
import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import EmptyState from "@/components/ui/empty-state";
import MoneyDisplay from "@/components/ui/money-display";
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import { DEMO_UNITS, DEMO_STAFF } from "@/lib/demo-data";

function getStatusLabel(status: string) {
  if (status === "in_progress") return "In Progress";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

interface MaintenanceRequest {
  id: string;
  issue: string;
  unit: string;
  raisedBy: string;
  date: string;
  status: string;
  cost: number | null;
}

interface CostEntry {
  id: string;
  date: string;
  description: string;
  type: "parts" | "labor";
  amount: number;
}

const DEMO_COST_HISTORY: Record<string, CostEntry[]> = {
  "mr-2": [
    { id: "c-1", date: "2026-09-13", description: "Window latch replacement", type: "parts", amount: 150000 },
    { id: "c-2", date: "2026-09-13", description: "Installation labor", type: "labor", amount: 200000 },
  ],
  "mr-4": [
    { id: "c-3", date: "2026-09-10", description: "Tile replacement", type: "parts", amount: 120000 },
    { id: "c-4", date: "2026-09-10", description: "Installation labor", type: "labor", amount: 80000 },
  ],
  "mr-5": [
    { id: "c-5", date: "2026-09-08", description: "Lock mechanism", type: "parts", amount: 80000 },
    { id: "c-6", date: "2026-09-08", description: "Installation labor", type: "labor", amount: 70000 },
  ],
  "mr-6": [
    { id: "c-7", date: "2026-09-06", description: "Pipe repair materials", type: "parts", amount: 350000 },
    { id: "c-8", date: "2026-09-07", description: "Plumbing labor (2 days)", type: "labor", amount: 450000 },
  ],
};

export default function MaintenanceListClient({ initialRequests }: { initialRequests: MaintenanceRequest[] }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<MaintenanceRequest | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [creating, setCreating] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState("medium");
  const [formCategory, setFormCategory] = useState("plumbing");
  const [formUnit, setFormUnit] = useState("");
  const [formAssignedTo, setFormAssignedTo] = useState("");

  const filtered = initialRequests.filter((r) =>
    statusFilter === "all" || r.status === statusFilter
  );

  const handleCreate = async () => {
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1000));
    setCreating(false);
    setShowCreate(false);
    setFormTitle("");
    setFormDescription("");
    setFormPriority("medium");
    setFormCategory("plumbing");
    setFormUnit("");
    setFormAssignedTo("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
            <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-text-primary">Maintenance</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Maintenance</h1>
          <p className="text-sm text-text-3 mt-1">Track and manage maintenance requests.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          Log Request
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "open", "in_progress", "resolved"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-[var(--radius-full)] whitespace-nowrap transition-colors ${
              statusFilter === status
                ? "bg-gold text-ink"
                : "bg-surface-2 text-text-3 hover:text-text-primary"
            }`}
          >
            {status === "all" ? "All" : getStatusLabel(status)}
            <span className="ml-1.5 text-[10px]">
              {status === "all" ? initialRequests.length : initialRequests.filter((r) => r.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Status progression stepper */}
      {statusFilter !== "all" && (
        <StatusProgression activeStatus={statusFilter} />
      )}

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-2/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Issue</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Raised By</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-surface-2/30 transition-colors cursor-pointer"
                  onClick={() => setSelected(req)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-text-primary">{req.issue}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{req.unit}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{req.raisedBy}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{formatDate(req.date)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {req.cost ? (
                      <MoneyDisplay amount={req.cost} />
                    ) : (
                      <span className="text-text-3">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-border">
          {filtered.map((req) => (
            <button
              key={req.id}
              onClick={() => setSelected(req)}
              className="w-full text-left p-4 space-y-1.5 hover:bg-surface-2/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary truncate pr-2">{req.issue}</span>
                <StatusBadge status={req.status} size="sm" />
              </div>
              <p className="text-sm text-text-2">{req.unit} · {req.raisedBy}</p>
              <p className="text-sm text-text-2">
                {formatDate(req.date)}
                {req.cost ? ` · ${formatCurrency(req.cost)}` : ""}
              </p>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <EmptyState
            title="No maintenance requests"
            description="All caught up! No requests to display."
            icon={<Plus size={24} />}
          />
        )}
      </div>

      {/* Detail drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Maintenance Request"
        size="md"
      >
        {selected && (
          <div className="space-y-6">
            <div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Issue</p>
                <p className="text-sm text-text-primary">{selected.issue}</p>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Unit</p>
                <p className="text-sm text-text-primary">{selected.unit}</p>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Raised By</p>
                <p className="text-sm text-text-primary">{selected.raisedBy}</p>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm text-text-primary">{formatDate(selected.date)}</p>
              </div>
            </div>

            {/* Photos section */}
            <div className="border-t border-border pt-4">
              <p className="text-xs text-text-3 uppercase tracking-wider mb-3">Photos</p>
              <div className="flex gap-2">
                <div className="w-20 h-20 rounded-[var(--radius-md)] bg-surface-2 border border-border flex items-center justify-center">
                  <Camera size={20} className="text-text-3" />
                </div>
                <div className="w-20 h-20 rounded-[var(--radius-md)] bg-surface-2 border border-border flex items-center justify-center">
                  <Camera size={20} className="text-text-3" />
                </div>
                <div className="w-20 h-20 rounded-[var(--radius-md)] bg-surface-2 border border-dashed border-border flex items-center justify-center">
                  <Plus size={16} className="text-text-3" />
                </div>
              </div>
            </div>

            {/* Resolution Notes */}
            <div className="border-t border-border pt-4">
              <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Resolution Notes</p>
              <Textarea
                placeholder={selected.status === "resolved" ? "Describe how the issue was resolved..." : "Add notes about this request..."}
                id="resolution-notes"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Cost */}
            {selected.cost && (
              <div className="border-t border-border pt-4">
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Total Cost</p>
                <MoneyDisplay amount={selected.cost} size="lg" />
                <p className="text-xs text-text-3 mt-1">Ledger entry will be created</p>
              </div>
            )}

            {/* Cost History */}
            {DEMO_COST_HISTORY[selected.id] && DEMO_COST_HISTORY[selected.id].length > 0 && (
              <div className="border-t border-border pt-4">
                <p className="text-xs text-text-3 uppercase tracking-wider mb-3">Cost History</p>
                <div className="space-y-2">
                  {DEMO_COST_HISTORY[selected.id].map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-surface-2 rounded-[var(--radius-md)]">
                      <div>
                        <p className="text-sm text-text-primary">{entry.description}</p>
                        <p className="text-xs text-text-3 mt-0.5">{formatDate(entry.date)} · {entry.type === "parts" ? "Parts" : "Labor"}</p>
                      </div>
                      <MoneyDisplay amount={entry.amount} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Create request modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Log Maintenance Request"
        description="Report a new maintenance issue"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Brief description of the issue"
            id="req-title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Provide details about the issue..."
            id="req-description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Priority</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="structural">Structural</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Unit</label>
              <select
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="">Select unit</option>
                {DEMO_UNITS.map((u) => (
                  <option key={u.id} value={u.label}>{u.label} — {u.type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Assigned To</label>
              <select
                value={formAssignedTo}
                onChange={(e) => setFormAssignedTo(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="">Select staff</option>
                {DEMO_STAFF.map((s) => (
                  <option key={s.id} value={s.name}>{s.name} — {s.role}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-surface pb-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button className="flex-1" loading={creating} onClick={handleCreate}>
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const PROGRESS_STEPS = [
  { key: "open", label: "OPEN" },
  { key: "in_progress", label: "IN PROGRESS" },
  { key: "resolved", label: "RESOLVED" },
];

function StatusProgression({ activeStatus }: { activeStatus: string }) {
  const activeIndex = PROGRESS_STEPS.findIndex((s) => s.key === activeStatus);

  return (
    <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4">
      <div className="flex items-center justify-between">
        {PROGRESS_STEPS.map((step, i) => {
          const isCompleted = activeIndex > i;
          const isActive = step.key === activeStatus;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 transition-colors shrink-0",
                    isActive && "bg-gold border-gold",
                    isCompleted && "bg-green border-green",
                    !isActive && !isCompleted && "bg-surface-2 border-border"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium whitespace-nowrap",
                    isActive && "text-gold",
                    isCompleted && "text-green",
                    !isActive && !isCompleted && "text-text-3"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < PROGRESS_STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 mt-[-18px] rounded-full",
                    activeIndex > i ? "bg-green" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
