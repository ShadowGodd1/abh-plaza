"use client";

import Link from "next/link";
import {
  Building2,
  Users,
  Bell,
  CreditCard,
  Shield,
  Settings as SettingsIcon,
  FileText,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsGroups = [
  {
    id: "organization",
    title: "Organization",
    description: "Company details, branding, and plan",
    icon: <Building2 size={20} />,
    href: "/settings?view=organization",
  },
  {
    id: "users",
    title: "Users & Roles",
    description: "Manage admin and caretaker accounts",
    icon: <Users size={20} />,
    href: "/settings?view=users",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "SMS templates and notification preferences",
    icon: <Bell size={20} />,
    href: "/settings?view=notifications",
  },
  {
    id: "billing",
    title: "Billing",
    description: "Invoice numbering, late fee rules, escalation",
    icon: <CreditCard size={20} />,
    href: "/settings?view=billing",
  },
  {
    id: "payments",
    title: "Payment Configuration",
    description: "M-Pesa settings and payment methods",
    icon: <CreditCard size={20} />,
    href: "/settings?view=payments",
  },
  {
    id: "templates",
    title: "Templates",
    description: "Message templates in English and Swahili",
    icon: <FileText size={20} />,
    href: "/settings?view=templates",
  },
  {
    id: "security",
    title: "Security",
    description: "MFA, sessions, and access policies",
    icon: <Shield size={20} />,
    href: "/settings?view=security",
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Theme, colors, and branding",
    icon: <Palette size={20} />,
    href: "/settings?view=appearance",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
          <span className="text-text-primary">Settings</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="text-sm text-text-3 mt-1">System configuration and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsGroups.map((group) => (
          <Link
            key={group.id}
            href={group.href}
            className="bg-surface rounded-[var(--radius-lg)] border border-border p-5 hover:shadow-[var(--shadow-card)] transition-shadow group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-surface-2 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/10 transition-colors text-text-3 group-hover:text-gold">
              {group.icon}
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary mb-1">{group.title}</h3>
              <p className="text-sm text-text-3">{group.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
