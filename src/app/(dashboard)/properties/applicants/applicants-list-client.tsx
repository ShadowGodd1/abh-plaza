"use client";

import { useState } from "react";
import { Plus, Search, CheckCircle, XCircle, FileText, Clock } from "lucide-react";
import Button from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import Drawer from "@/components/ui/drawer";
import EmptyState from "@/components/ui/empty-state";
import Modal from "@/components/ui/modal";
import { formatDate, cn } from "@/lib/utils";

const PIPELINE_STAGES = [
  { key: "inquired", label: "Applied" },
  { key: "viewing", label: "Screening" },
  { key: "approved", label: "Approved" },
  { key: "converted", label: "Lease Signed" },
  { key: "moved_in", label: "Move-in" },
];

function getName(a: any): string {
  if (typeof a.name === "string") return a.name;
  if (typeof a.person === "string") return a.person;
  return a.person?.full_name ?? a.name ?? "—";
}

function getPhone(a: any): string {
  if (a.phone) return a.phone;
  return a.person?.phone ?? "—";
}

function getUnit(a: any): string {
  if (typeof a.unit === "string") return a.unit;
  return a.unit?.label ?? "—";
}

function getStatusCounts(applicants: any[]) {
  const counts: Record<string, number> = {};
  for (const a of applicants) {
    const s = a.status;
    counts[s] = (counts[s] || 0) + 1;
  }
  return counts;
}

export default function ApplicantsListClient({ initialApplicants }: { initialApplicants: any[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const counts = getStatusCounts(initialApplicants);

  const filtered = initialApplicants.filter((a) => {
    const name = getName(a).toLowerCase();
    const unit = getUnit(a).toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase()) || unit.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async () => {
    setApproveLoading(true);
    setShowApproveConfirm(false);
    try {
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setApproveLoading(false);
      setSelected(null);
    }
  };

  const handleReject = async () => {
    setRejectLoading(true);
    setShowRejectConfirm(false);
    try {
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setRejectLoading(false);
      setSelected(null);
    }
  };

  return (
    <>
      {/* Pipeline status */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["inquired", "viewing", "approved", "rejected", "converted"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-[var(--radius-full)] whitespace-nowrap transition-colors ${
              statusFilter === status
                ? "bg-gold text-ink"
                : "bg-surface-2 text-text-3 hover:text-text-primary"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1.5 text-[10px]">
              {counts[status] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
        <input
          type="text"
          placeholder="Search by name or unit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
        />
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-2/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="hover:bg-surface-2/30 transition-colors cursor-pointer"
                  onClick={() => setSelected(applicant)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-text-primary">{getName(applicant)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{getPhone(applicant)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{getUnit(applicant)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{formatDate(applicant.date ?? applicant.created_at)}</td>
                  <td className="px-4 py-3"><StatusBadge status={applicant.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-border">
          {filtered.map((applicant) => (
            <button
              key={applicant.id}
              className="w-full p-4 text-left space-y-2 hover:bg-surface-2/30 transition-colors"
              onClick={() => setSelected(applicant)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">{getName(applicant)}</p>
                  <p className="text-xs text-text-3">{getPhone(applicant)}</p>
                </div>
                <StatusBadge status={applicant.status} size="sm" />
              </div>
              <div className="flex items-center justify-between text-xs text-text-3">
                <span>Unit {getUnit(applicant)}</span>
                <span>{formatDate(applicant.date ?? applicant.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <EmptyState
            title="No applicants found"
            description="No applicants match your criteria."
          />
        )}
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Applicant Details"
        size="md"
      >
        {selected && (
          <div className="space-y-6">
            <div>
              <StatusBadge status={selected.status} />
            </div>

            {/* Pipeline Visualization */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-text-3 uppercase tracking-wider">Pipeline Stage</p>
              <div className="flex items-center gap-1">
                {PIPELINE_STAGES.map((stage, i) => {
                  const statusOrder = ["inquired", "viewing", "approved", "rejected", "converted"];
                  const currentIdx = statusOrder.indexOf(selected.status);
                  const stageIdx = statusOrder.indexOf(stage.key);
                  const isActive = stage.key === selected.status;
                  const isCompleted = currentIdx >= 0 && stageIdx >= 0 && stageIdx < currentIdx;
                  const isRejected = selected.status === "rejected";

                  return (
                    <div key={stage.key} className="flex items-center">
                      <div className={cn(
                        "flex flex-col items-center gap-1",
                        i < PIPELINE_STAGES.length - 1 && "flex-1"
                      )}>
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium border-2 transition-colors shrink-0",
                          isActive
                            ? "bg-gold border-gold text-ink"
                            : isCompleted
                              ? "bg-success border-success text-white"
                              : isRejected
                                ? "bg-danger/10 border-danger/30 text-danger"
                                : "bg-surface-2 border-border text-text-3"
                        )}>
                          {isCompleted ? <CheckCircle size={12} /> : i + 1}
                        </div>
                        <span className={cn(
                          "text-[10px] font-medium whitespace-nowrap",
                          isActive ? "text-gold" : isCompleted ? "text-success" : "text-text-3"
                        )}>
                          {stage.label}
                        </span>
                      </div>
                      {i < PIPELINE_STAGES.length - 1 && (
                        <div className={cn(
                          "h-0.5 flex-1 mx-1 mt-[-14px] rounded-full",
                          isCompleted ? "bg-success" : "bg-border"
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Name</p>
                <p className="text-sm font-medium text-text-primary">{getName(selected)}</p>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-sm text-text-primary">{getPhone(selected)}</p>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Interested Unit</p>
                <p className="text-sm text-text-primary">{getUnit(selected)}</p>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm text-text-primary">{formatDate(selected.date ?? selected.created_at)}</p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="border-t border-border pt-4 space-y-3">
              <h4 className="text-xs font-medium text-text-3 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={12} />
                Notes
              </h4>
              <div className="bg-surface-2/50 rounded-[var(--radius-md)] p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-text-primary">Initial inquiry received. Interested in the unit for immediate occupancy.</p>
                    <p className="text-[10px] text-text-3 mt-0.5">{formatDate(selected.date ?? selected.created_at)} · Admin</p>
                  </div>
                </div>
                {selected.status === "viewing" && (
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-info mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm text-text-primary">Scheduled for unit viewing. Awaiting confirmation from applicant.</p>
                      <p className="text-[10px] text-text-3 mt-0.5">Sep 14, 2026 · Admin</p>
                    </div>
                  </div>
                )}
                {selected.status === "approved" && (
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm text-text-primary">Application approved. Ready for lease signing.</p>
                      <p className="text-[10px] text-text-3 mt-0.5">Sep 15, 2026 · Admin</p>
                    </div>
                  </div>
                )}
              </div>
              <button className="text-xs font-medium text-gold hover:text-gold-dark transition-colors">
                + Add Note
              </button>
            </div>

            {/* Activity Log */}
            <div className="border-t border-border pt-4 space-y-3">
              <h4 className="text-xs font-medium text-text-3 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={12} />
                Activity Log
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-text-3 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-text-primary">Application created</p>
                    <p className="text-xs text-text-3 mt-0.5">{formatDate(selected.date ?? selected.created_at)} · 10:00 AM</p>
                  </div>
                </div>
                {selected.status !== "inquired" && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm text-text-primary">Status changed to <span className="font-medium">Screening</span></p>
                      <p className="text-xs text-text-3 mt-0.5">Sep 13, 2026 · 2:30 PM</p>
                    </div>
                  </div>
                )}
                {(selected.status === "approved" || selected.status === "converted") && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm text-text-primary">Status changed to <span className="font-medium">Approved</span></p>
                      <p className="text-xs text-text-3 mt-0.5">Sep 15, 2026 · 11:00 AM</p>
                    </div>
                  </div>
                )}
                {selected.status === "rejected" && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-danger mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm text-text-primary">Status changed to <span className="font-medium">Rejected</span></p>
                      <p className="text-xs text-text-3 mt-0.5">Sep 14, 2026 · 4:00 PM</p>
                    </div>
                  </div>
                )}
                {selected.status === "converted" && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-info mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm text-text-primary">Lease signed. Applicant converted to tenant.</p>
                      <p className="text-xs text-text-3 mt-0.5">Sep 16, 2026 · 9:00 AM</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-4 sticky bottom-0 bg-surface pb-6">
              <p className="text-xs text-text-3 uppercase tracking-wider mb-3">Actions</p>
              <div className="flex gap-2">
                {selected.status !== "approved" && selected.status !== "rejected" && selected.status !== "converted" && (
                  <>
                    <Button
                      size="sm"
                      className="flex-1"
                      loading={approveLoading}
                      onClick={() => setShowApproveConfirm(true)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      loading={rejectLoading}
                      onClick={() => setShowRejectConfirm(true)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Approve Confirmation */}
      <Modal
        open={showApproveConfirm}
        onClose={() => setShowApproveConfirm(false)}
        title="Approve Applicant"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-success-bg flex items-center justify-center flex-shrink-0">
              <CheckCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="text-sm text-text-primary">
                You are about to approve{" "}
                <span className="font-medium">{selected && getName(selected)}</span>.
              </p>
              <p className="text-sm text-text-3 mt-1">
                This will move the applicant to the approved stage and they can proceed with the rental agreement.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowApproveConfirm(false)}>
              Cancel
            </Button>
            <Button loading={approveLoading} onClick={handleApprove}>
              Approve
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Confirmation */}
      <Modal
        open={showRejectConfirm}
        onClose={() => setShowRejectConfirm(false)}
        title="Reject Applicant"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-danger-bg flex items-center justify-center flex-shrink-0">
              <XCircle size={20} className="text-danger" />
            </div>
            <div>
              <p className="text-sm text-text-primary">
                You are about to reject{" "}
                <span className="font-medium">{selected && getName(selected)}</span>.
              </p>
              <p className="text-sm text-text-3 mt-1">
                This action can be reversed later if needed.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowRejectConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={rejectLoading} onClick={handleReject}>
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
