"use client";

import { LogOut, ChevronRight, Shield, Bell, HelpCircle } from "lucide-react";

interface Unit {
  id: string;
  label: string;
  floor: number;
  status: string;
  type: string;
  rent: number;
  tenant: string | null;
  tenantPhone: string | null;
  tenantEmail: string | null;
  tenantRole: string | null;
}

interface OwnerAccountClientProps {
  units: Unit[];
}

export default function OwnerAccountClient({ units }: OwnerAccountClientProps) {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-text-primary mb-6">Account</h1>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
            <span className="text-gold text-lg font-semibold">IM</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">Ibrahim Mohamed</p>
            <p className="text-sm text-text-3">Owner · Unit A-01</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border divide-y divide-border">
        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-2/50 transition-colors">
          <Shield size={18} className="text-text-3" />
          <span className="flex-1 text-sm text-text-primary">Security</span>
          <ChevronRight size={16} className="text-text-3" />
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-2/50 transition-colors">
          <Bell size={18} className="text-text-3" />
          <span className="flex-1 text-sm text-text-primary">Notifications</span>
          <ChevronRight size={16} className="text-text-3" />
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-2/50 transition-colors">
          <HelpCircle size={18} className="text-text-3" />
          <span className="flex-1 text-sm text-text-primary">Help & Support</span>
          <ChevronRight size={16} className="text-text-3" />
        </button>
      </div>

      <button className="w-full flex items-center justify-center gap-2 mt-6 py-3 text-sm text-danger hover:bg-danger-bg rounded-[var(--radius-lg)] transition-colors">
        <LogOut size={16} />
        Sign out
      </button>

      <p className="text-xs text-text-3 text-center mt-4">ABH Plaza PMS v1.0</p>
    </div>
  );
}
