"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Phone, Mail } from "lucide-react";
import Button from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import EmptyState from "@/components/ui/empty-state";
import { formatPhoneDisplay } from "@/lib/utils";

const demoPeople = [
  { id: "1", name: "Ahmed Noor", phone: "254712345678", email: "ahmed@email.com", unit: "A-04", role: "Tenant", status: "active" },
  { id: "2", name: "Sara Ali", phone: "254723456789", email: "sara@email.com", unit: "A-02", role: "Tenant", status: "active" },
  { id: "3", name: "Omar Hassan", phone: "254734567890", email: null, unit: "B-01", role: "Tenant", status: "active" },
  { id: "4", name: "Ibrahim Mohamed", phone: "254745678901", email: "ibrahim@email.com", unit: "A-01", role: "Owner", status: "active" },
  { id: "5", name: "Fatima Khan", phone: "254756789012", email: "fatima@email.com", unit: "C-03", role: "Tenant", status: "ended" },
  { id: "6", name: "Amina Osman", phone: "254767890123", email: null, unit: "B-03", role: "Tenant", status: "active" },
];

export default function TenantsPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = demoPeople.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.email && p.email.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === "all" || p.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

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
            className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 hover:shadow-[var(--shadow-card)] transition-shadow"
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
    </div>
  );
}
