"use client";

import Link from "next/link";
import Button from "@/components/ui/button";

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
          <Link href="/settings" className="hover:text-gold transition-colors">Settings</Link>
          <span>/</span>
          <span className="text-text-primary">Notifications</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Notification Settings</h1>
        <p className="text-sm text-text-3 mt-1">Configure SMS and notification preferences.</p>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 space-y-5">
        <h3 className="text-sm font-medium text-text-primary">SMS Provider</h3>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Provider</label>
          <select className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold">
            <option>Africa&apos;s Talking</option>
            <option>Twilio</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">API Key</label>
          <input
            type="password"
            defaultValue="••••••••"
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Sender ID</label>
          <input
            defaultValue="ABHPLAZA"
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 space-y-4">
        <h3 className="text-sm font-medium text-text-primary">Notification Preferences</h3>
        {[
          { label: "Payment received", description: "Notify admin when a payment is recorded" },
          { label: "Invoice overdue", description: "Send reminder to tenant when invoice is overdue" },
          { label: "Maintenance update", description: "Notify tenant when maintenance status changes" },
          { label: "New applicant", description: "Notify admin when a new applicant is added" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-text-primary">{item.label}</p>
              <p className="text-xs text-text-3">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-border peer-focus:ring-2 peer-focus:ring-gold rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
