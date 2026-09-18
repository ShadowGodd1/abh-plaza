"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";

export default function OrganizationSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
          <Link href="/settings" className="hover:text-gold transition-colors">Settings</Link>
          <span>/</span>
          <span className="text-text-primary">Organization</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Organization Settings</h1>
        <p className="text-sm text-text-3 mt-1">Manage company details, branding, and plan.</p>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Organization Name</label>
          <input
            defaultValue="ABH Plaza"
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Phone</label>
          <input
            defaultValue="+254 700 000000"
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
          <input
            defaultValue="info@abhplaza.com"
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Address</label>
          <textarea
            defaultValue="ABH Plaza, Nairobi, Kenya"
            rows={3}
            className="w-full px-3 py-2 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Timezone</label>
          <select className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold">
            <option>Africa/Nairobi (EAT, UTC+3)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Currency</label>
          <select className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold">
            <option>KES — Kenyan Shilling</option>
          </select>
        </div>
        <div className="pt-2">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
