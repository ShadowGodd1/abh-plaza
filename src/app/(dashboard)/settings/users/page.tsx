"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Shield, UserCog } from "lucide-react";
import Button from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";

const DEMO_USERS = [
  { id: "1", name: "Admin User", email: "admin@abhplaza.com", role: "admin", status: "active", lastLogin: "2026-09-19" },
  { id: "2", name: "John Caretaker", email: "caretaker@abhplaza.com", role: "caretaker", status: "active", lastLogin: "2026-09-18" },
];

export default function UsersRolesPage() {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
            <Link href="/settings" className="hover:text-gold transition-colors">Settings</Link>
            <span>/</span>
            <span className="text-text-primary">Users & Roles</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Users & Roles</h1>
          <p className="text-sm text-text-3 mt-1">Manage admin and caretaker accounts.</p>
        </div>
        <Button onClick={() => setShowInvite(!showInvite)}>
          <Plus size={16} />
          Invite User
        </Button>
      </div>

      {showInvite && (
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 space-y-4">
          <h3 className="text-sm font-medium text-text-primary">Invite New User</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
              <input className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold" placeholder="Full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
              <input className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold" placeholder="email@example.com" type="email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Role</label>
              <select className="w-full h-10 px-3 text-sm bg-surface-2 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold">
                <option value="admin">Admin</option>
                <option value="caretaker">Caretaker</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button onClick={() => setShowInvite(false)}>Send Invite</Button>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface-2/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Last Login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DEMO_USERS.map((user) => (
              <tr key={user.id} className="hover:bg-surface-2/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                      <span className="text-gold text-xs font-medium">{user.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{user.name}</p>
                      <p className="text-xs text-text-3">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-sm text-text-2">
                    {user.role === "admin" ? <Shield size={14} /> : <UserCog size={14} />}
                    <span className="capitalize">{user.role}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={user.status} size="sm" /></td>
                <td className="px-4 py-3 text-sm text-text-3">{user.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-5">
        <h3 className="text-sm font-medium text-text-primary mb-3">Role Permissions</h3>
        <div className="space-y-3">
          {[
            { role: "Admin", permissions: "Full access to all features, settings, billing, and user management" },
            { role: "Caretaker", permissions: "Units, maintenance, messages, invoices, payments (read/write)" },
            { role: "Tenant", permissions: "Own unit, invoices, payments, maintenance requests, messages" },
            { role: "Owner", permissions: "Own unit, invoices, payments, reports, messages" },
          ].map((r) => (
            <div key={r.role} className="flex justify-between text-sm">
              <span className="font-medium text-text-primary">{r.role}</span>
              <span className="text-text-3 max-w-xs text-right">{r.permissions}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
