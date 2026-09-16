import Link from "next/link";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import { getInvoices } from "@/lib/data";
import InvoiceListClient from "./invoice-list-client";

function mapInvoice(inv: any) {
  return {
    id: inv.id,
    number: inv.invoice_number || inv.number || `INV-${inv.id?.slice(0, 8)}`,
    unit: inv.occupancy?.unit?.label || inv.unit || "",
    tenant: inv.occupancy?.person?.full_name || inv.tenant || "Unknown",
    amount: inv.amount_due || inv.amount || 0,
    amountPaid: inv.amount_paid || inv.amountPaid || 0,
    dueDate: inv.due_date || inv.dueDate || "",
    status: inv.status || "pending",
    period: inv.period_start && inv.period_end
      ? `${new Date(inv.period_start).toLocaleDateString("en-KE", { month: "short", year: "numeric" })} – ${new Date(inv.period_end).toLocaleDateString("en-KE", { month: "short", year: "numeric" })}`
      : inv.period || "",
  };
}

export default async function InvoicesPage() {
  const rawInvoices = await getInvoices();
  const invoices = rawInvoices.map(mapInvoice);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
            <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
            <span>/</span>
            <Link href="/billing" className="hover:text-gold transition-colors">Billing</Link>
            <span>/</span>
            <span className="text-text-primary">Invoices</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Invoices</h1>
          <p className="text-sm text-text-3 mt-1">Manage and track all property invoices.</p>
        </div>
        <Button>
          <Plus size={16} />
          Create Invoice
        </Button>
      </div>

      <InvoiceListClient initialInvoices={invoices} />
    </div>
  );
}
