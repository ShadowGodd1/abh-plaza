"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Wallet,
  Wrench,
  UserCog,
  MessageSquare,
  Megaphone,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText,
  Home,
  Receipt,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

function CollapsedTooltip({
  label,
  children,
  side = "right",
}: {
  label: string;
  children: React.ReactNode;
  side?: "right" | "top";
}) {
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    timerRef.current = setTimeout(() => setShow(true), 400);
  }, []);

  const close = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShow(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative group/tip" onMouseEnter={open} onMouseLeave={close} onFocus={open} onBlur={close}>
      {children}
      {show && (
        <span
          className={cn(
            "absolute z-50 whitespace-nowrap px-2 py-1 text-xs font-medium text-white bg-ink-3 rounded-md shadow-lg pointer-events-none",
            side === "right" ? "left-full ml-3 top-1/2 -translate-y-1/2" : "bottom-full mb-2 left-1/2 -translate-x-1/2"
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  {
    label: "Properties",
    href: "/properties",
    icon: <Building2 size={20} />,
    children: [
      { label: "Units", href: "/properties/units" },
      { label: "Occupancies", href: "/properties/occupancies" },
      { label: "Applicants", href: "/properties/applicants" },
    ],
  },
  { label: "Tenants & Owners", href: "/tenants", icon: <Users size={20} /> },
  {
    label: "Billing",
    href: "/billing",
    icon: <CreditCard size={20} />,
    children: [
      { label: "Invoices", href: "/billing/invoices" },
      { label: "Payments", href: "/billing/payments" },
    ],
  },
  { label: "Ledger", href: "/ledger", icon: <Wallet size={20} /> },
  { label: "Maintenance", href: "/maintenance", icon: <Wrench size={20} /> },
  { label: "Staff & Payroll", href: "/staff", icon: <UserCog size={20} /> },
  { label: "Messages", href: "/messages", icon: <MessageSquare size={20} /> },
  { label: "Announcements", href: "/announcements", icon: <Megaphone size={20} /> },
  { label: "Reports", href: "/reports", icon: <BarChart3 size={20} /> },
  { label: "Settings", href: "/settings", icon: <Settings size={20} /> },
];

const caretakerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { label: "Units", href: "/properties/units", icon: <Building2 size={20} /> },
  { label: "Maintenance", href: "/maintenance", icon: <Wrench size={20} /> },
  { label: "Applicants", href: "/properties/applicants", icon: <Users size={20} /> },
  { label: "Move Checklists", href: "/properties/occupancies", icon: <FileText size={20} /> },
  { label: "Messages", href: "/messages", icon: <MessageSquare size={20} /> },
  { label: "Invoices", href: "/billing/invoices", icon: <Receipt size={20} /> },
  { label: "Payments", href: "/billing/payments", icon: <CreditCard size={20} /> },
];

interface SidebarProps {
  role: "admin" | "caretaker";
  user?: { full_name?: string; email?: string };
}

export default function Sidebar({ role, user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Properties", "Billing"]);
  const pathname = usePathname();
  const navItems = role === "admin" ? adminNavItems : caretakerNavItems;

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-ink text-white z-40 flex flex-col sidebar-transition",
        collapsed ? "w-[72px]" : "w-[248px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 flex-shrink-0">
        <img src="/logo.jpeg" alt="ABH Plaza" className="w-8 h-8 rounded-[var(--radius-md)] object-cover flex-shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">ABH PLAZA</p>
            <p className="text-[10px] text-gold/60 truncate">PROPERTY MANAGEMENT SYSTEM</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedGroups.includes(item.label);

          const buttonContent = (children: React.ReactNode) => (
            <button
              onClick={() => toggleGroup(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm",
                "transition-colors duration-150",
                isActive
                  ? "bg-gold/10 text-gold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {children}
            </button>
          );

          if (hasChildren) {
            return (
              <div key={item.label}>
                {collapsed ? (
                  <CollapsedTooltip label={item.label}>
                    {buttonContent(<span className="flex-shrink-0">{item.icon}</span>)}
                  </CollapsedTooltip>
                ) : (
                  buttonContent(
                    <>
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform duration-150",
                          isExpanded ? "rotate-0" : "-rotate-90"
                        )}
                      />
                    </>
                  )
                )}
                {!collapsed && isExpanded && (
                  <div className="ml-6 mt-1 space-y-0.5">
                    {item.children!.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-3 py-1.5 rounded-[var(--radius-sm)] text-sm transition-colors duration-150",
                            childActive
                              ? "bg-gold/10 text-gold"
                              : "text-white/50 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm",
                "transition-colors duration-150",
                isActive
                  ? "bg-gold/10 text-gold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );

          return collapsed ? (
            <CollapsedTooltip key={item.href} label={item.label}>
              {linkContent}
            </CollapsedTooltip>
          ) : (
            linkContent
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-3 flex-shrink-0">
        {collapsed ? (
          <CollapsedTooltip label={user?.full_name || "User"} side="right">
            <div className="flex items-center justify-center py-2">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="text-gold text-xs font-medium">
                  {user?.full_name ? getInitials(user.full_name) : "U"}
                </span>
              </div>
            </div>
          </CollapsedTooltip>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
              <span className="text-gold text-xs font-medium">
                {user?.full_name ? getInitials(user.full_name) : "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.full_name || "User"}</p>
              <p className="text-xs text-white/40 capitalize">{role}</p>
            </div>
            <button className="text-white/40 hover:text-white transition-colors" aria-label="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <CollapsedTooltip label={collapsed ? "Expand sidebar" : "Collapse sidebar"} side="right">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-ink-3 border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </CollapsedTooltip>
    </aside>
  );
}
