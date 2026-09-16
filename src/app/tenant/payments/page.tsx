import { getPayments, getInvoices } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import TenantPaymentsClient from "./tenant-payments-client";

export default async function TenantPaymentsPage() {
  const [payments, invoices] = await Promise.all([getPayments(), getInvoices()]);

  const tenantInvoices = invoices
    .filter((inv: any) => (inv.occupancy?.unit?.label === "A-04") || (inv.unit === "A-04"))
    .map((inv: any) => ({
      id: inv.id,
      number: inv.invoice_number || inv.number,
      amount: inv.amount_due || inv.amount,
      dueDate: inv.due_date || inv.dueDate,
      dueDateFormatted: formatDate(inv.due_date || inv.dueDate),
      status: inv.status,
    }));

  const tenantPayments = payments
    .filter((p: any) => p.unit === "A-04" || p.invoice?.occupancy?.unit?.label === "A-04")
    .map((p: any) => ({
      month: new Date(p.paid_at || p.date).toLocaleDateString("en-KE", { month: "short", year: "numeric" }),
      amount: p.amount,
      amountFormatted: formatCurrency(p.amount),
      receipt: p.receipt_number || p.receipt,
      status: p.status,
    }));

  const outstanding = tenantInvoices.filter((inv: any) => inv.status !== "paid" && inv.status !== "void");

  return (
    <TenantPaymentsClient
      invoices={outstanding}
      recentPayments={tenantPayments}
    />
  );
}
