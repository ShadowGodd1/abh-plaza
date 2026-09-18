"use client";

import Link from "next/link";
import Button from "@/components/ui/button";

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
          <Link href="/settings" className="hover:text-gold transition-colors">Settings</Link>
          <span>/</span>
          <span className="text-text-primary">Billing</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Billing Settings</h1>
        <p className="text-sm text-text-3 mt-1">Configure invoice numbering, late fees, and escalation rules.</p>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 space-y-5">
        <h3 className="text-sm font-medium text-text-primary">Invoice Numbering</h3>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Number Format</label>
          <select className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold">
            <option>Sequential (INV-0001, INV-0002, ...)</option>
            <option>Year-based (INV-2026-0001)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Next Invoice Number</label>
          <input
            type="number"
            defaultValue={13}
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 space-y-5">
        <h3 className="text-sm font-medium text-text-primary">Late Fees</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Enable late fees</p>
            <p className="text-xs text-text-3">Automatically apply fees to overdue invoices</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-9 h-5 bg-border peer-focus:ring-2 peer-focus:ring-gold rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Grace Period (days)</label>
          <input
            type="number"
            defaultValue={7}
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Late Fee Amount (KES cents)</label>
          <input
            type="number"
            defaultValue={50000}
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <p className="text-xs text-text-3 mt-1">50000 cents = KES 500</p>
        </div>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 space-y-5">
        <h3 className="text-sm font-medium text-text-primary">Escalation Rules</h3>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Overdue Reminder (days after due)</label>
          <input
            type="number"
            defaultValue={3}
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Escalation Threshold (days)</label>
          <input
            type="number"
            defaultValue={30}
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
