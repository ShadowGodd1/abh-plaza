import Link from "next/link";
import { getPayments } from "@/lib/data";
import PaymentListClient from "./PaymentListClient";

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
            <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
            <span>/</span>
            <Link href="/billing" className="hover:text-gold transition-colors">Billing</Link>
            <span>/</span>
            <span className="text-text-primary">Payments</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Payments</h1>
          <p className="text-sm text-text-3 mt-1">All recorded payments across the property.</p>
        </div>
      </div>

      <PaymentListClient initialPayments={payments} />
    </div>
  );
}
