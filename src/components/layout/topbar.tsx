"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  X,
  Building2,
  Users,
  Receipt,
  Loader2,
  CreditCard,
  Wrench,
  FileWarning,
  Settings,
  LogOut,
  ChevronDown,
  Info,
  Layers,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import {
  DEMO_UNITS,
  DEMO_INVOICES,
  DEMO_APPLICANTS,
  DEMO_OCCUPANCIES,
} from "@/lib/demo-data";
import LanguageToggle from "@/components/ui/language-toggle";

interface SearchResult {
  id: string;
  type: "unit" | "person" | "invoice";
  name: string;
  detail: string;
  href: string;
}

function searchAll(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  DEMO_UNITS.forEach((u) => {
    const matchLabel = u.label.toLowerCase().includes(q);
    const matchTenant = u.tenant?.toLowerCase().includes(q);
    const matchType = u.type.toLowerCase().includes(q);
    if (matchLabel || matchTenant || matchType) {
      results.push({
        id: u.id,
        type: "unit",
        name: `Unit ${u.label}`,
        detail: `${u.type} — ${u.tenant || "Vacant"} — KES ${u.rent.toLocaleString()}`,
        href: "/properties/units",
      });
    }
  });

  const seenPeople = new Set<string>();
  DEMO_OCCUPANCIES.forEach((occ) => {
    if (occ.person.toLowerCase().includes(q) && !seenPeople.has(occ.person)) {
      seenPeople.add(occ.person);
      const unit = DEMO_UNITS.find((u) => u.id === occ.unitId);
      results.push({
        id: occ.id,
        type: "person",
        name: occ.person,
        detail: `${occ.type === "ownership" ? "Owner" : "Tenant"} — Unit ${unit?.label || "?"}`,
        href: "/tenants",
      });
    }
  });

  DEMO_UNITS.forEach((u) => {
    if (u.tenant && u.tenant.toLowerCase().includes(q) && !seenPeople.has(u.tenant)) {
      seenPeople.add(u.tenant);
      results.push({
        id: u.id + "-tenant",
        type: "person",
        name: u.tenant,
        detail: `${u.tenantRole === "owner" ? "Owner" : "Tenant"} — Unit ${u.label}`,
        href: "/tenants",
      });
    }
  });

  DEMO_INVOICES.forEach((inv) => {
    if (
      inv.number.toLowerCase().includes(q) ||
      inv.tenant.toLowerCase().includes(q) ||
      inv.unit.toLowerCase().includes(q)
    ) {
      const amountKes = (inv.amount / 100).toLocaleString();
      results.push({
        id: inv.id,
        type: "invoice",
        name: inv.number,
        detail: `${inv.tenant} — Unit ${inv.unit} — KES ${amountKes} (${inv.status})`,
        href: "/billing/invoices",
      });
    }
  });

  DEMO_APPLICANTS.forEach((a) => {
    if (a.name.toLowerCase().includes(q) || a.unit.toLowerCase().includes(q)) {
      results.push({
        id: a.id,
        type: "person",
        name: a.name,
        detail: `Applicant — Unit ${a.unit} — ${a.status}`,
        href: "/properties/applicants",
      });
    }
  });

  return results.slice(0, 12);
}

const TYPE_LABELS: Record<string, string> = {
  unit: "Units",
  person: "People",
  invoice: "Invoices",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  unit: <Building2 size={14} />,
  person: <Users size={14} />,
  invoice: <Receipt size={14} />,
};

type NotificationType = "payment" | "maintenance" | "system" | "admin";

interface Notification {
  id: string;
  message: string;
  icon: React.ReactNode;
  href: string;
  timestamp: string;
  group: "Today" | "Yesterday" | "Earlier";
  read: boolean;
  type: NotificationType;
  throttled?: boolean;
  batchCount?: number;
  batchPerson?: string;
}

const NOTIFICATION_TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  payment: <CreditCard size={14} className="text-success" />,
  maintenance: <Wrench size={14} className="text-warning" />,
  system: <Info size={14} className="text-info" />,
  admin: <Bell size={14} className="text-text-3" />,
};

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    message: "Payment received from Ahmed Noor",
    icon: <CreditCard size={16} className="text-success" />,
    href: "/billing/payments",
    timestamp: "2 min ago",
    group: "Today",
    read: false,
    type: "payment",
  },
  {
    id: "n2",
    message: "Maintenance request from Sara Ali",
    icon: <Wrench size={16} className="text-warning" />,
    href: "/maintenance",
    timestamp: "1 hour ago",
    group: "Today",
    read: false,
    type: "maintenance",
  },
  {
    id: "n3",
    message: "3 overdue reminders sent to Ahmed Noor (batched daily)",
    icon: <FileWarning size={16} className="text-danger" />,
    href: "/billing/invoices",
    timestamp: "3 hours ago",
    group: "Today",
    read: false,
    type: "system",
    throttled: true,
    batchCount: 3,
    batchPerson: "Ahmed Noor",
  },
  {
    id: "n4",
    message: "Payment received from Fatima Hassan",
    icon: <CreditCard size={16} className="text-success" />,
    href: "/billing/payments",
    timestamp: "Yesterday",
    group: "Yesterday",
    read: true,
    type: "payment",
  },
  {
    id: "n5",
    message: "New applicant for Unit B-02",
    icon: <Users size={16} className="text-info" />,
    href: "/properties/applicants",
    timestamp: "2 days ago",
    group: "Earlier",
    read: true,
    type: "admin",
  },
];

interface TopBarProps {
  user?: { full_name?: string; email?: string; role?: string };
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export default function TopBar({ user, onMobileMenuToggle, mobileMenuOpen }: TopBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchResultRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const notifRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [focusedSearchIdx, setFocusedSearchIdx] = useState(-1);
  const [focusedNotifIdx, setFocusedNotifIdx] = useState(-1);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const results = useMemo(() => searchAll(query), [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    results.forEach((r) => {
      if (!map.has(r.type)) map.set(r.type, []);
      map.get(r.type)!.push(r);
    });
    return map;
  }, [results]);

  const notifGrouped = useMemo(() => {
    const groups: { label: string; items: Notification[] }[] = [];
    const order = ["Today", "Yesterday", "Earlier"];
    for (const g of order) {
      const items = notifications.filter((n) => n.group === g);
      if (items.length > 0) groups.push({ label: g, items });
    }
    return groups;
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setNotifOpen(false);
      setUserMenuOpen(false);
      setFocusedSearchIdx(-1);
      setFocusedNotifIdx(-1);
      inputRef.current?.blur();
      return;
    }

    if (isOpen && query && results.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedSearchIdx((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedSearchIdx((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === "Enter" && focusedSearchIdx >= 0) {
        e.preventDefault();
        handleSelect(results[focusedSearchIdx].href);
      }
    }

    if (notifOpen) {
      const flatNotifs = notifications;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedNotifIdx((prev) => (prev < flatNotifs.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedNotifIdx((prev) => (prev > 0 ? prev - 1 : flatNotifs.length - 1));
      } else if (e.key === "Enter" && focusedNotifIdx >= 0) {
        e.preventDefault();
        handleNotifClick(flatNotifs[focusedNotifIdx].href);
      }
    }
  };

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleNotifClick = useCallback(
    (href: string) => {
      setNotifOpen(false);
      router.push(href);
    },
    [router]
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Mobile menu toggle */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden flex-shrink-0 w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-text-2 hover:bg-surface-2 transition-colors"
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md ml-4 lg:ml-0" ref={containerRef}>
        <div className="relative">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                setFocusedSearchIdx(-1);
                if (e.target.value.trim()) {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 300);
                }
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search units, tenants, invoices..."
              className={cn(
                "w-full h-10 pl-10 pr-4 text-sm bg-surface-2 border border-transparent",
                "rounded-[var(--radius-md)] text-text-primary placeholder:text-text-3",
                "focus:outline-none focus:border-gold focus:bg-surface focus:ring-1 focus:ring-gold",
                "transition-all duration-150"
              )}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setIsOpen(false); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-primary"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-[var(--radius-md)] shadow-lg max-h-80 overflow-y-auto z-50 dropdown-animate">
              {loading && query && (
                <div className="flex items-center justify-center gap-2 py-6 text-text-3 text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Searching...
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="py-6 text-center text-text-3 text-sm">
                  No matching records found
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="py-1">
                  {(() => {
                    let flatIdx = -1;
                    return Array.from(grouped.entries()).map(([type, items]) => (
                      <div key={type}>
                        <div className="px-3 py-1.5 text-[11px] font-medium text-text-3 uppercase tracking-wider flex items-center gap-1.5">
                          {TYPE_ICONS[type]}
                          {TYPE_LABELS[type]}
                        </div>
                        {items.map((item) => {
                          flatIdx++;
                          const thisIdx = flatIdx;
                          return (
                            <button
                              key={item.id}
                              ref={(el) => { searchResultRefs.current[thisIdx] = el; }}
                              onClick={() => handleSelect(item.href)}
                              onMouseEnter={() => setFocusedSearchIdx(thisIdx)}
                              className={cn(
                                "w-full px-3 py-2 flex items-start gap-3 transition-colors text-left",
                                focusedSearchIdx === thisIdx ? "bg-surface-2" : "hover:bg-surface-2"
                              )}
                            >
                              <span className="mt-0.5 text-text-3">{TYPE_ICONS[item.type]}</span>
                              <span className="min-w-0">
                                <span className="block text-sm font-medium text-text-primary truncate">
                                  {item.name}
                                </span>
                                <span className="block text-xs text-text-3 truncate">
                                  {item.detail}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              )}

              {!query && (
                <div className="py-6 text-center text-text-3 text-sm">
                  Start typing to search...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-4">
        {/* Language toggle */}
        <LanguageToggle />

        {/* Notifications bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-text-3 hover:text-text-primary hover:bg-surface-2 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute top-full right-0 mt-1 w-80 sm:w-96 bg-surface border border-border rounded-[var(--radius-md)] shadow-[var(--shadow-dropdown)] z-50 overflow-hidden dropdown-animate">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-medium text-text-primary">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-gold hover:text-gold-dark transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifGrouped.map((group) => (
                  <div key={group.label}>
                    <div className="px-4 py-2 text-[11px] font-medium text-text-3 uppercase tracking-wider bg-surface-2/50">
                      {group.label}
                    </div>
                    {group.items.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleNotifClick(n.href)}
                        className={cn(
                          "w-full px-4 py-3 flex items-start gap-3 hover:bg-surface-2/50 transition-colors text-left border-b border-border last:border-0",
                          !n.read && "bg-gold/[0.03]"
                        )}
                      >
                        <span className="mt-0.5 shrink-0">{n.icon}</span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block text-sm leading-snug",
                              !n.read ? "text-text-primary font-medium" : "text-text-2"
                            )}
                          >
                            {n.message}
                          </span>
                          {n.throttled && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-warning bg-warning/10 px-1.5 py-0.5 rounded-full">
                              <Layers size={10} />
                              Batched ({n.batchCount}x)
                            </span>
                          )}
                          <span className="block text-xs text-text-3 mt-0.5">{n.timestamp}</span>
                        </span>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          className="hidden sm:flex w-10 h-10 rounded-[var(--radius-md)] items-center justify-center text-text-3 hover:text-text-primary hover:bg-surface-2 transition-colors"
          aria-label="Help"
        >
          <HelpCircle size={18} />
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-[var(--radius-md)] hover:bg-surface-2 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
              <span className="text-gold text-xs font-medium">
                {user?.full_name ? getInitials(user.full_name) : "U"}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-text-primary">{user?.full_name || "User"}</p>
              <p className="text-xs text-text-3 capitalize">{user?.role || "admin"}</p>
            </div>
            <ChevronDown size={14} className={cn("text-text-3 transition-transform duration-150", userMenuOpen && "rotate-180")} />
          </button>

          {userMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-56 bg-surface border border-border rounded-[var(--radius-md)] shadow-[var(--shadow-dropdown)] z-50 overflow-hidden dropdown-animate">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-text-primary">{user?.full_name || "User"}</p>
                <p className="text-xs text-text-3 capitalize">{user?.role || "admin"}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-2 hover:bg-surface-2 hover:text-text-primary transition-colors"
                >
                  <Settings size={16} className="icon-16" />
                  Settings
                </Link>
                <button
                  onClick={async () => {
                    const { createClient } = await import("@/lib/supabase/client");
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-2 hover:bg-surface-2 hover:text-text-primary transition-colors"
                >
                  <LogOut size={16} className="icon-16" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
