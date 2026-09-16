"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/owner/home", icon: <Home size={20} /> },
  { label: "Payments", href: "/owner/payments", icon: <CreditCard size={20} /> },
  { label: "Messages", href: "/owner/messages", icon: <MessageSquare size={20} /> },
  { label: "Account", href: "/owner/account", icon: <User size={20} /> },
];

export default function OwnerNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40 lg:hidden" aria-label="Owner navigation">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "nav-touch-target flex-col gap-1 text-[10px] font-medium transition-colors",
                isActive ? "text-gold" : "text-text-3"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
