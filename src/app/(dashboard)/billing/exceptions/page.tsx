import Link from "next/link";
import { DEMO_PAYMENT_EXCEPTIONS } from "@/lib/demo-data";
import ExceptionsClient from "./ExceptionsClient";

export default function ExceptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
            <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
            <span>/</span>
            <Link href="/billing" className="hover:text-gold transition-colors">Billing</Link>
            <span>/</span>
            <span className="text-text-primary">Exceptions</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Payment Exceptions</h1>
          <p className="text-sm text-text-3 mt-1">Unmatched M-Pesa payments that could not be auto-matched to an invoice.</p>
        </div>
      </div>

      <ExceptionsClient initialExceptions={DEMO_PAYMENT_EXCEPTIONS} />
    </div>
  );
}
