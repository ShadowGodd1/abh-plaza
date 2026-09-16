"use client";

import { useState } from "react";
import { Search, Bell, HelpCircle, Menu, X } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

interface TopBarProps {
  user?: { full_name?: string; email?: string; role?: string };
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export default function TopBar({ user, onMobileMenuToggle, mobileMenuOpen }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

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
      <div className="flex-1 max-w-md ml-4 lg:ml-0">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search units, tenants, invoices..."
            className={cn(
              "w-full h-10 pl-10 pr-4 text-sm bg-surface-2 border border-transparent",
              "rounded-[var(--radius-md)] text-text-primary placeholder:text-text-3",
              "focus:outline-none focus:border-gold focus:bg-surface focus:ring-1 focus:ring-gold",
              "transition-all duration-150"
            )}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-4">
        <button
          className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-text-3 hover:text-text-primary hover:bg-surface-2 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
        </button>

        <button
          className="hidden sm:flex w-10 h-10 rounded-[var(--radius-md)] items-center justify-center text-text-3 hover:text-text-primary hover:bg-surface-2 transition-colors"
          aria-label="Help"
        >
          <HelpCircle size={18} />
        </button>

        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
            <span className="text-gold text-xs font-medium">
              {user?.full_name ? getInitials(user.full_name) : "U"}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-text-primary">{user?.full_name || "User"}</p>
            <p className="text-xs text-text-3 capitalize">{user?.role || "admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
