import { createClient } from "@/lib/supabase/server";
import * as demo from "@/lib/demo-data";

export async function getCurrentOccupancy(role: "tenant" | "owner") {
  if (!isSupabaseConfigured()) {
    const unit = demo.DEMO_UNITS.find((u) =>
      role === "owner" ? u.tenantRole === "owner" : u.tenantRole === "tenant"
    );
    if (!unit) return null;
    return {
      personName: unit.tenant || "",
      unitLabel: unit.label,
      unitId: unit.id,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: person } = await supabase
    .from("people")
    .select("id, full_name")
    .eq("email", user.email)
    .single();

  if (!person) return null;

  const { data: occupancy } = await supabase
    .from("occupancies")
    .select("id, unit_id, units(label)")
    .eq("person_id", person.id)
    .eq("status", "active")
    .single();

  return {
    personName: person.full_name,
    unitLabel: (occupancy as any)?.units?.label || "",
    unitId: occupancy?.unit_id || "",
  };
}

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("placeholder")
  );
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return { id: "demo-user", role: "admin" as const, email: "admin@abhplaza.com", full_name: "Admin User", organization_id: demo.DEMO_ORGANIZATION.id };
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return {
    id: user.id,
    role: (user.user_metadata?.role || user.app_metadata?.role || "admin") as "admin" | "caretaker" | "tenant" | "owner",
    email: user.email,
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    organization_id: user.user_metadata?.organization_id || demo.DEMO_ORGANIZATION.id,
  };
}

export async function getUnits() {
  if (!isSupabaseConfigured()) return demo.DEMO_UNITS;
  const supabase = await createClient();
  const { data } = await supabase
    .from("units")
    .select("*, unit_type:unit_types(name, category), property:properties(name, organization_id)")
    .order("label");
  return data || demo.DEMO_UNITS;
}

export async function getOccupancies() {
  if (!isSupabaseConfigured()) return demo.DEMO_OCCUPANCIES;
  const supabase = await createClient();
  const { data } = await supabase
    .from("occupancies")
    .select("*, person:people(full_name, phone, email), unit:units(label, property:properties(name))")
    .order("created_at", { ascending: false });
  return data || demo.DEMO_OCCUPANCIES;
}

export async function getInvoices(statusFilter?: string) {
  if (!isSupabaseConfigured()) {
    let invs = demo.DEMO_INVOICES;
    if (statusFilter && statusFilter !== "all") invs = invs.filter((i) => i.status === statusFilter);
    return invs;
  }
  const supabase = await createClient();
  let query = supabase
    .from("invoices")
    .select("*, occupancy:occupancies(person:people(full_name), unit:units(label))")
    .order("created_at", { ascending: false });
  if (statusFilter && statusFilter !== "all") query = query.eq("status", statusFilter);
  const { data } = await query;
  return data || demo.DEMO_INVOICES;
}

export async function getPayments() {
  if (!isSupabaseConfigured()) return demo.DEMO_PAYMENTS;
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select("*, invoice:invoices(invoice_number, occupancy:occupancies(person:people(full_name), unit:units(label)))")
    .order("paid_at", { ascending: false });
  return data || demo.DEMO_PAYMENTS;
}

export async function getLedgerEntries() {
  if (!isSupabaseConfigured()) return demo.DEMO_LEDGER;
  const supabase = await createClient();
  const { data } = await supabase
    .from("ledger_entries")
    .select("*")
    .order("occurred_at", { ascending: false });
  return data || demo.DEMO_LEDGER;
}

export async function getMaintenanceRequests(statusFilter?: string) {
  if (!isSupabaseConfigured()) {
    let reqs = demo.DEMO_MAINTENANCE;
    if (statusFilter && statusFilter !== "all") reqs = reqs.filter((r) => r.status === statusFilter);
    return reqs;
  }
  const supabase = await createClient();
  let query = supabase
    .from("maintenance_requests")
    .select("*, unit:units(label), raised_by_person:people(full_name)")
    .order("created_at", { ascending: false });
  if (statusFilter && statusFilter !== "all") query = query.eq("status", statusFilter);
  const { data } = await query;
  return data || demo.DEMO_MAINTENANCE;
}

export async function getStaffVendors() {
  if (!isSupabaseConfigured()) return demo.DEMO_STAFF;
  const supabase = await createClient();
  const { data } = await supabase.from("staff_vendors").select("*").order("name");
  return data || demo.DEMO_STAFF;
}

export async function getPeople() {
  if (!isSupabaseConfigured()) {
    return demo.DEMO_UNITS.filter((u) => u.tenant).map((u) => ({
      id: u.id,
      name: u.tenant!,
      phone: u.tenantPhone!,
      email: u.tenantEmail,
      unit: u.label,
      role: u.tenantRole === "owner" ? "Owner" : "Tenant",
      status: "active" as const,
    }));
  }
  const supabase = await createClient();
  const { data } = await supabase.from("people").select("*").order("full_name");
  return data || [];
}

export async function getApplicants() {
  if (!isSupabaseConfigured()) return demo.DEMO_APPLICANTS;
  const supabase = await createClient();
  const { data } = await supabase
    .from("applicants")
    .select("*, person:people(full_name, phone), unit:units(label)")
    .order("created_at", { ascending: false });
  return data || demo.DEMO_APPLICANTS;
}

export async function getMessageThreads() {
  if (!isSupabaseConfigured()) return demo.DEMO_MESSAGES;
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return demo.DEMO_MESSAGES;
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("sent_at", { ascending: false });
  if (!messages || messages.length === 0) return demo.DEMO_MESSAGES;
  const senderIds = [...new Set(messages.map((m: any) => m.sender_id))];
  const { data: people } = await supabase
    .from("people")
    .select("id, full_name")
    .in("id", senderIds);
  const nameMap = new Map<string, string>();
  (people || []).forEach((p: any) => nameMap.set(p.id, p.full_name));
  const threadMap = new Map<string, any>();
  for (const msg of messages) {
    const tid = msg.thread_id;
    if (!threadMap.has(tid)) {
      threadMap.set(tid, {
        id: tid,
        person: nameMap.get(msg.sender_id) || "Unknown",
        unit: "",
        lastMessage: msg.body,
        timestamp: msg.sent_at,
        unread: !msg.read_at && msg.recipient_id === user.id,
        messages: [],
      });
    }
    threadMap.get(tid)!.messages.push({
      id: msg.id,
      sender: msg.sender_id === user.id ? "admin" : "tenant",
      body: msg.body,
      time: msg.sent_at,
    });
  }
  return Array.from(threadMap.values());
}

export async function getAnnouncements() {
  if (!isSupabaseConfigured()) return demo.DEMO_ANNOUNCEMENTS;
  const supabase = await createClient();
  const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
  return data || demo.DEMO_ANNOUNCEMENTS;
}

export async function getDashboardMetrics() {
  if (!isSupabaseConfigured()) {
    return {
      occupiedUnits: { count: demo.totalOccupied, total: demo.totalUnits, percentage: demo.occupancyRate },
      vacantUnits: { count: demo.totalVacant, percentage: Math.round((demo.totalVacant / demo.totalUnits) * 100) },
      collection: { amount: demo.totalCollection, rate: demo.collectionRate },
      overdue: { amount: demo.totalOverdue, invoices: demo.overdueCount },
      recentPayments: demo.DEMO_PAYMENTS.slice(0, 5),
      outstandingInvoices: demo.DEMO_INVOICES.filter((i) => i.status !== "paid" && i.status !== "void").slice(0, 5),
      maintenanceOpen: demo.DEMO_MAINTENANCE.filter((r) => r.status !== "resolved").slice(0, 5),
    };
  }
  const supabase = await createClient();
  const [unitsRes, invoicesRes, paymentsRes, maintenanceRes] = await Promise.all([
    supabase.from("units").select("status"),
    supabase.from("invoices").select("amount_due, amount_paid, status, due_date, invoice_number, occupancy:occupancies(person:people(full_name), unit:units(label))"),
    supabase.from("payments").select("*, invoice:invoices(invoice_number, occupancy:occupancies(person:people(full_name), unit:units(label)))").order("paid_at", { ascending: false }).limit(5),
    supabase.from("maintenance_requests").select("*, unit:units(label)").order("created_at", { ascending: false }).limit(5),
  ]);

  const units = unitsRes.data || [];
  if (units.length === 0 && !invoicesRes.data && !paymentsRes.data) {
    return {
      occupiedUnits: { count: demo.totalOccupied, total: demo.totalUnits, percentage: demo.occupancyRate },
      vacantUnits: { count: demo.totalVacant, percentage: Math.round((demo.totalVacant / demo.totalUnits) * 100) },
      collection: { amount: demo.totalCollection, rate: demo.collectionRate },
      overdue: { amount: demo.totalOverdue, invoices: demo.overdueCount },
      recentPayments: demo.DEMO_PAYMENTS.slice(0, 5),
      outstandingInvoices: demo.DEMO_INVOICES.filter((i) => i.status !== "paid" && i.status !== "void").slice(0, 5),
      maintenanceOpen: demo.DEMO_MAINTENANCE.filter((r) => r.status !== "resolved").slice(0, 5),
    };
  }

  const occupied = units.filter((u: { status: string }) => u.status === "occupied").length;
  const vacant = units.filter((u: { status: string }) => u.status === "vacant").length;
  const total = units.length;
  const invoices = invoicesRes.data || [];
  const payments = paymentsRes.data || [];
  const totalExpected = invoices.reduce((s: number, i: { amount_due: number }) => s + i.amount_due, 0);
  const totalCollected = invoices.reduce((s: number, i: { amount_paid: number }) => s + i.amount_paid, 0);
  const overdueInvs = invoices.filter((i: { status: string }) => i.status === "overdue");
  const overdueAmt = overdueInvs.reduce((s: number, i: { amount_due: number; amount_paid: number }) => s + (i.amount_due - i.amount_paid), 0);
  const outstanding = invoices.filter((i: { status: string }) => i.status !== "paid" && i.status !== "void");

  return {
    occupiedUnits: { count: occupied, total, percentage: total > 0 ? Math.round((occupied / total) * 100) : 0 },
    vacantUnits: { count: vacant, percentage: total > 0 ? Math.round((vacant / total) * 100) : 0 },
    collection: { amount: totalCollected, rate: totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0 },
    overdue: { amount: overdueAmt, invoices: overdueInvs.length },
    recentPayments: payments,
    outstandingInvoices: outstanding.slice(0, 5),
    maintenanceOpen: (maintenanceRes.data || []).filter((r: { status: string }) => r.status !== "resolved"),
  };
}
