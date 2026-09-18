"use client";

import Link from "next/link";
import Button from "@/components/ui/button";

export default function PaymentsSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
          <Link href="/settings" className="hover:text-gold transition-colors">Settings</Link>
          <span>/</span>
          <span className="text-text-primary">Payment Configuration</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Payment Configuration</h1>
        <p className="text-sm text-text-3 mt-1">Configure M-Pesa settings and payment methods.</p>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 space-y-5">
        <h3 className="text-sm font-medium text-text-primary">M-Pesa Configuration</h3>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Environment</label>
          <select className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold">
            <option>Sandbox</option>
            <option>Production</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Consumer Key</label>
          <input
            type="password"
            defaultValue="••••••••"
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Consumer Secret</label>
          <input
            type="password"
            defaultValue="••••••••"
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Shortcode</label>
          <input
            defaultValue="174379"
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Passkey</label>
          <input
            type="password"
            defaultValue="••••••••"
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Callback URL</label>
          <input
            defaultValue="https://abh-plaza.vercel.app/api/mpesa/callback"
            className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 space-y-4">
        <h3 className="text-sm font-medium text-text-primary">Accepted Payment Methods</h3>
        {[
          { label: "M-Pesa (STK Push)", enabled: true },
          { label: "M-Pesa (Paybill/C2B)", enabled: true },
          { label: "Cash", enabled: true },
          { label: "Bank Transfer", enabled: true },
          { label: "Cheque", enabled: false },
        ].map((method) => (
          <div key={method.label} className="flex items-center justify-between py-2">
            <span className="text-sm text-text-primary">{method.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={method.enabled} className="sr-only peer" />
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
