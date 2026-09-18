"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { ToastProvider } from "@/components/ui/toast";
import ConnectionStatus from "@/components/ui/connection-status";
import DemoBanner from "@/components/ui/demo-banner";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ full_name: string; email: string; role: "admin" | "caretaker" }>({
    full_name: "Admin User",
    email: "admin@abhplaza.com",
    role: "admin",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        const role = (authUser.user_metadata?.role || authUser.app_metadata?.role || "admin") as "admin" | "caretaker";
        setUser({
          full_name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Admin User",
          email: authUser.email || "admin@abhplaza.com",
          role,
        });
      }
    });
  }, []);

  return (
    <ToastProvider>
      <ConnectionStatus />
      <div className="min-h-screen bg-paper">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar role={user.role} user={user} />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-ink/40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-[248px] h-full">
              <Sidebar role={user.role} user={user} />
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
          <DemoBanner />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
