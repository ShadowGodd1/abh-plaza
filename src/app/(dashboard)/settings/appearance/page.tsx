"use client";

import Link from "next/link";
import Button from "@/components/ui/button";

export default function AppearanceSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
          <Link href="/settings" className="hover:text-gold transition-colors">Settings</Link>
          <span>/</span>
          <span className="text-text-primary">Appearance</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Appearance</h1>
        <p className="text-sm text-text-3 mt-1">Customize theme, colors, and branding.</p>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 space-y-5">
        <h3 className="text-sm font-medium text-text-primary">Brand Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Primary Color</label>
            <div className="flex gap-2">
              <input type="color" defaultValue="#C89B4A" className="w-10 h-10 rounded cursor-pointer border-0" />
              <input defaultValue="#C89B4A" className="flex-1 h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Background Color</label>
            <div className="flex gap-2">
              <input type="color" defaultValue="#F7F4ED" className="w-10 h-10 rounded cursor-pointer border-0" />
              <input defaultValue="#F7F4ED" className="flex-1 h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] font-mono" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 space-y-5">
        <h3 className="text-sm font-medium text-text-primary">Sidebar</h3>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[var(--radius-md)] bg-ink flex items-center justify-center">
              <img src="/logo.jpeg" alt="Logo" className="w-8 h-8 rounded object-cover" />
            </div>
            <div>
              <p className="text-sm text-text-primary">Current logo</p>
              <p className="text-xs text-text-3">logo.jpeg (84 KB)</p>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Sidebar Style</label>
          <select className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold">
            <option>Dark (default)</option>
            <option>Light</option>
          </select>
        </div>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 space-y-5">
        <h3 className="text-sm font-medium text-text-primary">Language</h3>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Default Language</label>
          <select className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold">
            <option>English</option>
            <option>Swahili</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
