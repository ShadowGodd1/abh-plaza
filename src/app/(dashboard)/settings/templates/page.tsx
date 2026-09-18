"use client";

import Link from "next/link";
import Button from "@/components/ui/button";

const templates = [
  { id: "invoice", label: "Invoice Created", body: "Dear {tenant}, your invoice {number} for {amount} is due on {date}. - ABH Plaza" },
  { id: "reminder", label: "Payment Reminder", body: "Dear {tenant}, your invoice {number} of {amount} is overdue. Please pay to avoid late fees. - ABH Plaza" },
  { id: "payment", label: "Payment Confirmation", body: "Dear {tenant}, we received your payment of {amount} for invoice {number}. Receipt: {receipt}. - ABH Plaza" },
  { id: "maintenance", label: "Maintenance Update", body: "Dear {tenant}, your maintenance request for unit {unit} has been updated. Status: {status}. - ABH Plaza" },
];

export default function TemplatesSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
          <Link href="/settings" className="hover:text-gold transition-colors">Settings</Link>
          <span>/</span>
          <span className="text-text-primary">Templates</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Message Templates</h1>
        <p className="text-sm text-text-3 mt-1">Configure message templates in English and Swahili.</p>
      </div>

      <div className="space-y-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-surface rounded-[var(--radius-lg)] border border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-text-primary">{tpl.label}</h3>
              <span className="text-xs text-text-3">Variables: {"{tenant}"}, {"{amount}"}, etc.</span>
            </div>
            <textarea
              defaultValue={tpl.body}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold resize-none font-mono"
            />
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button>Save Templates</Button>
      </div>
    </div>
  );
}
