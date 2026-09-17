import { redirect } from "next/navigation";
import { getPayments, getInvoices, getCurrentOccupancy } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import TenantPaymentsClient from "./tenant-payments-client";

export default async function TenantPaymentsPage() {
  const occupancy = await getCurrentOccupancy("tenant");
  if (!occupancy) redirect("/login");

  const unitLabel = occupancy.unitLabel;
  const [payments, invoices] = await Promise.all([getPayments(), getInvoices()]);

  const tenantInvoices = invoices
    .filter((inv: any) => (inv.occupancy?.unit?.label === unitLabel) || (inv.unit === unitLabel))
    .map((inv: any) => ({
      id: inv.id,
      number: inv.invoice_number || inv.number,
      amount: inv.amount_due || inv.amount,
      dueDate: inv.due_date || inv.dueDate,
      dueDateFormatted: formatDate(inv.due_date || inv.dueDate),
      status: inv.status,
    }));

  const tenantPayments = payments
    .filter((p: any) => p.unit === unitLabel || p.invoice?.occupancy?.unit?.label === unitLabel)
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
      unitLabel={unitLabel}
    />
  );
}
