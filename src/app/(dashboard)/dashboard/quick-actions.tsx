"use client";

import { useRouter } from "next/navigation";
import {
  Plus,
  CreditCard,
  Users,
  Wrench,
  Megaphone,
} from "lucide-react";

const quickActionItems = [
  { label: "Create Invoice", href: "/billing/invoices", icon: Plus },
  { label: "Record Payment", href: "/billing/payments", icon: CreditCard },
  { label: "Add Tenant", href: "/tenants", icon: Users },
  { label: "Log Maintenance", href: "/maintenance", icon: Wrench },
  { label: "Send Announcement", href: "/announcements", icon: Megaphone },
];

export default function QuickActions() {
  const router = useRouter();
  return (
    <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4">
      <p className="text-sm font-medium text-text-2 mb-3">Quick Actions</p>
      <div className="flex flex-wrap gap-2">
        {quickActionItems.map((action) => (
          <button
            key={action.label}
            onClick={() => router.push(action.href)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-text-2 bg-surface-2 hover:bg-border rounded-[var(--radius-md)] transition-colors"
          >
            <action.icon size={16} />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
