import Link from "next/link";
import { getStaffVendors } from "@/lib/data";
import StaffListClient from "./staff-list-client";

export default async function StaffPage() {
  const rawStaff = await getStaffVendors();

  const staff = rawStaff.map((s: any) => ({
    id: s.id,
    name: s.name || "Unknown",
    initials: (s.name || "Unknown").split(" ").map((n: string) => n[0]).join(""),
    role: s.role || "",
    phone: s.phone || "",
    paymentSchedule: s.payment_schedule || s.schedule || "",
    amount: s.amount || 0,
    amountFormatted: new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", minimumFractionDigits: 0 }).format((s.amount || 0) / 100),
    schedule: s.payment_schedule || s.schedule || "",
    lastPayment: s.last_payment || s.lastPaid || null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
            <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-text-primary">Staff & Payroll</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Staff & Payroll</h1>
          <p className="text-sm text-text-3 mt-1">Manage outsourced staff and payroll payments.</p>
        </div>
      </div>

      <StaffListClient initialStaff={staff} />
    </div>
  );
}
