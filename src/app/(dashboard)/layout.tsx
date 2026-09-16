"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // In production, this would come from the session
  const userRole = "admin" as const;
  const user = { full_name: "Admin User", email: "admin@abhplaza.com", role: userRole };

  return (
    <div className="min-h-screen bg-paper">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar role={userRole} user={user} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-[248px] h-full">
            <Sidebar role={userRole} user={user} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:ml-[248px] min-h-screen flex flex-col">
        <TopBar
          user={user}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
