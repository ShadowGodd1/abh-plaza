"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Phone, Mail, User, Home, History, Receipt, CreditCard, MessageSquare, CreditCard as IdCard } from "lucide-react";
import Button from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import EmptyState from "@/components/ui/empty-state";
import Drawer from "@/components/ui/drawer";
import { formatPhoneDisplay, formatCurrency, formatDate, cn } from "@/lib/utils";
import { DEMO_UNITS, DEMO_OCCUPANCIES, DEMO_INVOICES, DEMO_PAYMENTS, DEMO_MESSAGES } from "@/lib/demo-data";

type PersonDetailTab = "profile" | "history" | "invoices" | "payments" | "messages";

type Person = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  unit: string;
  unitId: string;
  role: string;
  status: string;
  rent: number;
  idNumber: string;
};

function buildPeople(): Person[] {
  const idNumbers: Record<string, string> = {
    "Ibrahim Mohamed": "34567890",
    "Sara Ali": "45678901",
    "Ahmed Noor": "56789012",
    "Omar Hassan": "67890123",
    "Amina Osman": "78901234",
    "Hassan Ali": "89012345",
    "Fatima Khan": "90123456",
    "John Kamau": "12345678",
  };
  return DEMO_UNITS.filter((u) => u.tenant).map((u) => ({
    id: u.id,
    name: u.tenant!,
    phone: u.tenantPhone || "",
    email: u.tenantEmail,
    unit: u.label,
    unitId: u.id,
    role: u.tenantRole === "owner" ? "Owner" : "Tenant",
    status: "active",
    rent: u.rent,
    idNumber: idNumbers[u.tenant!] || "00000000",
  }));
}

export default function TenantsPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [detailTab, setDetailTab] = useState<PersonDetailTab>("profile");

  const people = buildPeople();
  const filtered = people.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.email && p.email.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === "all" || p.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const selectedOccupancies = selectedPerson
    ? DEMO_OCCUPANCIES.filter((o) => o.person === selectedPerson.name)
    : [];
  const selectedInvoices = selectedPerson
    ? DEMO_INVOICES.filter((i) => i.tenant === selectedPerson.name)
    : [];
  const selectedPayments = selectedPerson
    ? DEMO_PAYMENTS.filter((p) => p.tenant === selectedPerson.name)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
            <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-text-primary">Tenants & Owners</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Tenants & Owners</h1>
          <p className="text-sm text-text-3 mt-1">Unified people directory for the property.</p>
        </div>
        <Button>
          <Plus size={16} />
          Add Person
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Roles</option>
          <option value="tenant">Tenants</option>
          <option value="owner">Owners</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((person) => (
          <div
            key={person.id}
            onClick={() => { setSelectedPerson(person); setDetailTab("profile"); }}
            className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 hover:shadow-[var(--shadow-card)] transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold text-sm font-medium">
                    {person.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{person.name}</p>
                  <p className="text-xs text-text-3">{person.role} · {person.unit}</p>
                </div>
              </div>
              <StatusBadge status={person.status} size="sm" />
            </div>
            <div className="space-y-1.5 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-text-3">
                <Phone size={12} />
                {formatPhoneDisplay(person.phone)}
              </div>
              {person.email && (
                <div className="flex items-center gap-2 text-xs text-text-3">
                  <Mail size={12} />
                  {person.email}
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              title="No people found"
              description="No records match your search criteria."
            />
          </div>
        )}
      </div>

      <Drawer
        open={!!selectedPerson}
        onClose={() => { setSelectedPerson(null); setDetailTab("profile"); }}
        title={selectedPerson?.name || ""}
        description={selectedPerson ? `${selectedPerson.role} — Unit ${selectedPerson.unit}` : ""}
        size="lg"
      >
        {selectedPerson && (
          <PersonDetailTabs
            person={selectedPerson}
            tab={detailTab}
            onTabChange={setDetailTab}
            occupancies={selectedOccupancies}
            invoices={selectedInvoices}
            payments={selectedPayments}
          />
        )}
      </Drawer>
    </div>
  );
}

const PERSON_TABS: { key: PersonDetailTab; label: string; icon: typeof User }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "history", label: "History", icon: History },
  { key: "invoices", label: "Invoices", icon: Receipt },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "messages", label: "Messages", icon: MessageSquare },
];

function PersonDetailTabs({
  person,
  tab,
  onTabChange,
  occupancies,
  invoices,
  payments,
}: {
  person: Person;
  tab: PersonDetailTab;
  onTabChange: (t: PersonDetailTab) => void;
  occupancies: typeof DEMO_OCCUPANCIES;
  invoices: typeof DEMO_INVOICES;
  payments: typeof DEMO_PAYMENTS;
}) {
  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {PERSON_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
              tab === t.key
                ? "border-gold text-gold"
                : "border-transparent text-text-3 hover:text-text-primary"
            )}
          >
            <t.icon size={14} />
            {t.label}
            {t.key === "invoices" && invoices.length > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-gold/10 text-gold text-[10px] flex items-center justify-center">
                {invoices.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
              <span className="text-gold text-lg font-semibold">
                {person.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{person.name}</h3>
              <p className="text-sm text-text-3">{person.role} — Unit {person.unit}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-medium text-text-3 uppercase tracking-wider">Contact Information</h4>
            <div className="bg-surface-2/50 rounded-[var(--radius-md)] p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-3 flex items-center gap-2"><Phone size={14} /> Phone</span>
                <span className="text-text-primary font-medium">{formatPhoneDisplay(person.phone)}</span>
              </div>
              {person.email && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-3 flex items-center gap-2"><Mail size={14} /> Email</span>
                  <span className="text-text-primary font-medium">{person.email}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-text-3 flex items-center gap-2"><IdCard size={14} /> National ID</span>
                <span className="text-text-primary font-medium font-tabular">{person.idNumber}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-medium text-text-3 uppercase tracking-wider">Current Relationship</h4>
            <div className="bg-surface-2/50 rounded-[var(--radius-md)] p-3">
              <div className="flex items-center gap-3">
                <Home size={16} className="text-gold" />
                <div>
                  <p className="text-sm font-medium text-text-primary">{person.role} — Unit {person.unit}</p>
                  {occupancies.filter((o) => o.status === "active").map((occ) => (
                    <p key={occ.id} className="text-xs text-text-3 mt-0.5">
                      Since {formatDate(occ.startDate)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-medium text-text-3 uppercase tracking-wider">Financial Summary</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-2/50 rounded-[var(--radius-md)] p-3">
                <p className="text-xs text-text-3">Monthly Rent</p>
                <p className="text-sm font-medium text-text-primary font-tabular mt-1">{formatCurrency(person.rent)}</p>
              </div>
              <div className="bg-surface-2/50 rounded-[var(--radius-md)] p-3">
                <p className="text-xs text-text-3">Total Paid</p>
                <p className="text-sm font-medium text-text-primary font-tabular mt-1">
                  {formatCurrency(payments.reduce((s, p) => s + p.amount, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-4">
          <h4 className="text-xs font-medium text-text-3 uppercase tracking-wider">Relationship History</h4>
          {occupancies.length === 0 ? (
            <p className="text-sm text-text-3">No occupancy records found.</p>
          ) : (
            <div className="space-y-3">
              {occupancies.filter((o) => o.status === "active").map((occ) => {
                const unit = DEMO_UNITS.find((u) => u.id === occ.unitId);
                return (
                  <div
                    key={occ.id}
                    className="rounded-[var(--radius-md)] p-3 border bg-success-bg/30 border-success/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Home size={14} className="text-success" />
                        <span className="text-sm font-medium text-text-primary">
                          {occ.type === "ownership" ? "Owner" : "Tenant"} — Unit {unit?.label || occ.unitId}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/10 text-success">
                        Current
                      </span>
                    </div>
                    <p className="text-xs text-text-3 mt-1">
                      {formatDate(occ.startDate)} — Present
                    </p>
                  </div>
                );
              })}

              {occupancies.filter((o) => o.status === "ended").length > 0 && (
                <div className="pt-2">
                  <p className="text-[10px] text-text-3 uppercase tracking-wider mb-2 font-medium">Previous</p>
                  <div className="space-y-2">
                    {occupancies.filter((o) => o.status === "ended").map((occ) => {
                      const unit = DEMO_UNITS.find((u) => u.id === occ.unitId);
                      return (
                        <div
                          key={occ.id}
                          className="rounded-[var(--radius-md)] p-3 border bg-surface-2/50 border-border"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Home size={14} className="text-text-3" />
                              <span className="text-sm font-medium text-text-primary">
                                {occ.type === ("ownership" as string) ? "Owner" : "Tenant"} — Unit {unit?.label || occ.unitId}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-2 text-text-3">
                              Previous
                            </span>
                          </div>
                          <p className="text-xs text-text-3 mt-1">
                            {formatDate(occ.startDate)} — {occ.endDate ? formatDate(occ.endDate) : "Present"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "invoices" && (
        <div className="space-y-4">
          <h4 className="text-xs font-medium text-text-3 uppercase tracking-wider">Invoices</h4>
          {invoices.length === 0 ? (
            <p className="text-sm text-text-3">No invoices found for this person.</p>
          ) : (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="bg-surface-2/50 rounded-[var(--radius-md)] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary font-tabular">{inv.number}</span>
                    <StatusBadge status={inv.status} size="sm" />
                  </div>
                  <div className="flex justify-between text-xs text-text-3">
                    <span>Unit {inv.unit} · {inv.period}</span>
                    <span className="font-tabular">{formatCurrency(inv.amount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-text-3">
                    <span>Due: {formatDate(inv.dueDate)}</span>
                    {inv.amountPaid > 0 && (
                      <span className="text-success font-tabular">Paid: {formatCurrency(inv.amountPaid)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "payments" && (
        <div className="space-y-4">
          <h4 className="text-xs font-medium text-text-3 uppercase tracking-wider">Payment History</h4>
          {payments.length === 0 ? (
            <p className="text-sm text-text-3">No payments found for this person.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((pay) => (
                <div key={pay.id} className="bg-surface-2/50 rounded-[var(--radius-md)] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary font-tabular">{formatCurrency(pay.amount)}</span>
                    <StatusBadge status={pay.status} size="sm" />
                  </div>
                  <div className="flex justify-between text-xs text-text-3">
                    <span>{pay.invoiceNumber}</span>
                    <span>{formatDate(pay.date)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-text-3">
                    <span className="capitalize">{pay.method.replace("_", " ")}</span>
                    {pay.receipt && <span className="font-tabular">Receipt: {pay.receipt}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "messages" && (
        <div className="space-y-4">
          <h4 className="text-xs font-medium text-text-3 uppercase tracking-wider">Message History</h4>
          {(() => {
            const thread = DEMO_MESSAGES.find((m) => m.person === person.name);
            if (!thread) {
              return <p className="text-sm text-text-3">No messages found for this person.</p>;
            }
            return (
              <div className="space-y-3">
                {thread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "rounded-[var(--radius-md)] p-3 border",
                      msg.sender === "admin"
                        ? "bg-gold/5 border-gold/20 ml-6"
                        : "bg-surface-2/50 border-border mr-6"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-text-3 capitalize">
                        {msg.sender === "admin" ? "Admin" : person.name.split(" ")[0]}
                        {msg.isInternal && (
                          <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] text-warning">
                            Internal
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-text-3">{formatDate(msg.time)}</span>
                    </div>
                    <p className="text-sm text-text-primary">{msg.body}</p>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
