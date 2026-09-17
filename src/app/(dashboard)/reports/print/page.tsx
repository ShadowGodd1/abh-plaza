"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  DEMO_LEDGER,
  DEMO_INVOICES,
  DEMO_UNITS,
  DEMO_MAINTENANCE,
  totalOccupied,
  totalVacant,
  totalUnits,
  occupancyRate,
  totalCollection,
  totalExpected,
  collectionRate,
} from "@/lib/demo-data";

function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInCents / 100);
}

function PrintContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "income";
  const [generatedAt, setGeneratedAt] = useState("");

  useEffect(() => {
    setGeneratedAt(
      new Date().toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    const timer = setTimeout(() => window.print(), 500);
    return () => clearTimeout(timer);
  }, []);

  const reportTitle =
    type === "income"
      ? "Income Report"
      : type === "expenses"
        ? "Expense Report"
        : type === "collection"
          ? "Collection Report"
          : "Occupancy Report";

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      <header className="border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-bold">ABH Plaza Property Management</h1>
        <p className="text-sm text-gray-600 mt-1">{reportTitle}</p>
        <p className="text-sm text-gray-600">Period: September 2026</p>
      </header>

      {type === "income" && <IncomePrint />}
      {type === "expenses" && <ExpensesPrint />}
      {type === "collection" && <CollectionPrint />}
      {type === "occupancy" && <OccupancyPrint />}

      <footer className="border-t border-gray-300 mt-8 pt-4 text-xs text-gray-500">
        Generated on {generatedAt} by Admin User
      </footer>
    </div>
  );
}

function IncomePrint() {
  const entries = DEMO_LEDGER.filter((e) => e.type === "income");
  const total = entries.reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Category</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              <td className="border border-gray-300 px-3 py-2">{e.date}</td>
              <td className="border border-gray-300 px-3 py-2 capitalize">{e.category.replace("_", " ")}</td>
              <td className="border border-gray-300 px-3 py-2">{e.description}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(e.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-bold">
            <td colSpan={3} className="border border-gray-300 px-3 py-2 text-right">Total Income</td>
            <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function ExpensesPrint() {
  const entries = DEMO_LEDGER.filter((e) => e.type === "expense");
  const total = entries.reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Category</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              <td className="border border-gray-300 px-3 py-2">{e.date}</td>
              <td className="border border-gray-300 px-3 py-2 capitalize">{e.category}</td>
              <td className="border border-gray-300 px-3 py-2">{e.description}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(e.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-bold">
            <td colSpan={3} className="border border-gray-300 px-3 py-2 text-right">Total Expenses</td>
            <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function CollectionPrint() {
  const paid = DEMO_INVOICES.filter((i) => i.status === "paid");
  const overdue = DEMO_INVOICES.filter((i) => i.status === "overdue");
  const pending = DEMO_INVOICES.filter((i) => i.status === "pending");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="border border-gray-300 p-4">
          <p className="text-xs text-gray-500">Collection Rate</p>
          <p className="text-2xl font-bold">{collectionRate}%</p>
        </div>
        <div className="border border-gray-300 p-4">
          <p className="text-xs text-gray-500">Total Expected</p>
          <p className="text-2xl font-bold">{formatCurrency(totalExpected)}</p>
        </div>
        <div className="border border-gray-300 p-4">
          <p className="text-xs text-gray-500">Total Collected</p>
          <p className="text-2xl font-bold">{formatCurrency(totalCollection)}</p>
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">Invoice</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Unit</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Tenant</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_INVOICES.map((inv) => (
            <tr key={inv.id}>
              <td className="border border-gray-300 px-3 py-2">{inv.number}</td>
              <td className="border border-gray-300 px-3 py-2">{inv.unit}</td>
              <td className="border border-gray-300 px-3 py-2">{inv.tenant}</td>
              <td className="border border-gray-300 px-3 py-2 capitalize">{inv.status}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(inv.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-bold">
            <td colSpan={4} className="border border-gray-300 px-3 py-2 text-right">Total</td>
            <td className="border border-gray-300 px-3 py-2 text-right">
              {formatCurrency(DEMO_INVOICES.reduce((s, i) => s + i.amount, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function OccupancyPrint() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="border border-gray-300 p-4">
          <p className="text-xs text-gray-500">Occupancy Rate</p>
          <p className="text-2xl font-bold">{occupancyRate}%</p>
        </div>
        <div className="border border-gray-300 p-4">
          <p className="text-xs text-gray-500">Total Units</p>
          <p className="text-2xl font-bold">{totalUnits}</p>
        </div>
        <div className="border border-gray-300 p-4">
          <p className="text-xs text-gray-500">Occupied</p>
          <p className="text-2xl font-bold">{totalOccupied}</p>
        </div>
        <div className="border border-gray-300 p-4">
          <p className="text-xs text-gray-500">Vacant</p>
          <p className="text-2xl font-bold">{totalVacant}</p>
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">Unit</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Floor</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Type</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Rent</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_UNITS.map((u) => (
            <tr key={u.id}>
              <td className="border border-gray-300 px-3 py-2">{u.label}</td>
              <td className="border border-gray-300 px-3 py-2">{u.floor === 0 ? "Ground" : u.floor}</td>
              <td className="border border-gray-300 px-3 py-2">{u.type}</td>
              <td className="border border-gray-300 px-3 py-2 capitalize">{u.status.replace("_", " ")}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(u.rent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PrintReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <PrintContent />
    </Suspense>
  );
}
