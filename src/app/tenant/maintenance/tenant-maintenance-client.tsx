"use client";

import { useState } from "react";
import { Plus, Camera, X } from "lucide-react";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import StatusBadge from "@/components/ui/status-badge";

interface MaintenanceRequest {
  id: string;
  issue: string;
  date: string;
  dateFormatted: string;
  status: string;
}

interface TenantMaintenanceClientProps {
  initialRequests: MaintenanceRequest[];
}

export default function TenantMaintenanceClient({ initialRequests }: TenantMaintenanceClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState(initialRequests);

  const handleSubmit = () => {
    if (!description.trim()) return;
    setRequests((prev) => [
      { id: `new-${Date.now()}`, issue: description, date: new Date().toISOString(), dateFormatted: new Date().toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }), status: "open" },
      ...prev,
    ]);
    setSubmitted(true);
    setShowForm(false);
    setDescription("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Maintenance</h1>
          <p className="text-sm text-text-3">Report and track issues.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Report Issue
        </Button>
      </div>

      {submitted && (
        <div className="bg-success-bg border border-success/20 rounded-[var(--radius-lg)] p-4 mb-4">
          <p className="text-sm text-success font-medium">Maintenance request submitted</p>
          <p className="text-xs text-success/70 mt-1">Our team can now review the issue.</p>
        </div>
      )}

      {showForm && (
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-text-primary">Report an issue</h3>
            <button onClick={() => setShowForm(false)} className="text-text-3 hover:text-text-primary">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3">
            <Textarea
              label="Issue description"
              id="description"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Add photo</label>
              <button className="w-16 h-16 rounded-[var(--radius-md)] border-2 border-dashed border-border flex items-center justify-center text-text-3 hover:border-gold hover:text-gold transition-colors">
                <Camera size={20} />
              </button>
            </div>
            <div className="text-xs text-text-3">Unit: A-04</div>
            <Button className="w-full" onClick={handleSubmit}>
              Submit request
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="bg-surface rounded-[var(--radius-lg)] border border-border p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium text-text-primary">{req.issue}</p>
              <StatusBadge status={req.status} size="sm" />
            </div>
            <p className="text-xs text-text-3">{req.dateFormatted}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
