export const DEMO_ORGANIZATION = {
  id: "00000000-0000-0000-0000-000000000000",
  name: "ABH Plaza",
  plan: "standard",
};

export const DEMO_PROPERTY = {
  id: "prop-1",
  organization_id: DEMO_ORGANIZATION.id,
  name: "ABH Plaza",
  address: "Moi Avenue, Nairobi CBD",
};

export const DEMO_UNIT_TYPES = [
  { id: "ut-1", name: "Bedsitter", category: "residential" },
  { id: "ut-2", name: "1 Bedroom", category: "residential" },
  { id: "ut-3", name: "2 Bedroom", category: "residential" },
  { id: "ut-4", name: "3 Bedroom", category: "residential" },
  { id: "ut-5", name: "Shop", category: "commercial" },
  { id: "ut-6", name: "Madrasa", category: "other" },
];

export const DEMO_UNITS = [
  { id: "u-1", label: "A-01", floor: 1, status: "occupied" as const, type: "2 Bedroom", rent: 2500000, tenant: "Ibrahim Mohamed", tenantPhone: "254712345678", tenantEmail: "ibrahim@email.com", tenantRole: "owner" as const },
  { id: "u-2", label: "A-02", floor: 1, status: "occupied" as const, type: "2 Bedroom", rent: 3000000, tenant: "Sara Ali", tenantPhone: "254723456789", tenantEmail: "sara@email.com", tenantRole: "tenant" as const },
  { id: "u-3", label: "A-03", floor: 1, status: "vacant" as const, type: "1 Bedroom", rent: 1800000, tenant: null, tenantPhone: null, tenantEmail: null, tenantRole: null },
  { id: "u-4", label: "A-04", floor: 2, status: "occupied" as const, type: "3 Bedroom", rent: 3500000, tenant: "Ahmed Noor", tenantPhone: "254734567890", tenantEmail: "ahmed@email.com", tenantRole: "tenant" as const },
  { id: "u-5", label: "B-01", floor: 2, status: "occupied" as const, type: "Bedsitter", rent: 1200000, tenant: "Omar Hassan", tenantPhone: "254745678901", tenantEmail: null, tenantRole: "tenant" as const },
  { id: "u-6", label: "B-02", floor: 2, status: "under_maintenance" as const, type: "Bedsitter", rent: 1200000, tenant: null, tenantPhone: null, tenantEmail: null, tenantRole: null },
  { id: "u-7", label: "B-03", floor: 0, status: "occupied" as const, type: "Shop", rent: 4000000, tenant: "Amina Osman", tenantPhone: "254756789012", tenantEmail: "amina@email.com", tenantRole: "tenant" as const },
  { id: "u-8", label: "C-01", floor: 3, status: "occupied" as const, type: "1 Bedroom", rent: 2000000, tenant: "Hassan Ali", tenantPhone: "254767890123", tenantEmail: null, tenantRole: "tenant" as const },
  { id: "u-9", label: "C-02", floor: 3, status: "reserved" as const, type: "Madrasa", rent: 0, tenant: null, tenantPhone: null, tenantEmail: null, tenantRole: null },
  { id: "u-10", label: "C-03", floor: 3, status: "occupied" as const, type: "1 Bedroom", rent: 1500000, tenant: "Fatima Khan", tenantPhone: "254778901234", tenantEmail: "fatima@email.com", tenantRole: "tenant" as const },
  { id: "u-11", label: "C-04", floor: 3, status: "occupied" as const, type: "2 Bedroom", rent: 2800000, tenant: "John Kamau", tenantPhone: "254789012345", tenantEmail: "john@email.com", tenantRole: "tenant" as const },
  { id: "u-12", label: "D-01", floor: 4, status: "vacant" as const, type: "1 Bedroom", rent: 1700000, tenant: null, tenantPhone: null, tenantEmail: null, tenantRole: null },
];

export const DEMO_OCCUPANCIES = [
  { id: "occ-1", unitId: "u-1", person: "Ibrahim Mohamed", type: "ownership" as const, startDate: "2023-01-01", endDate: null, status: "active" as const },
  { id: "occ-2", unitId: "u-2", person: "Sara Ali", type: "tenancy" as const, startDate: "2024-06-15", endDate: null, status: "active" as const },
  { id: "occ-3", unitId: "u-4", person: "Ahmed Noor", type: "tenancy" as const, startDate: "2025-01-01", endDate: null, status: "active" as const },
  { id: "occ-4", unitId: "u-5", person: "Omar Hassan", type: "tenancy" as const, startDate: "2025-03-01", endDate: null, status: "active" as const },
  { id: "occ-5", unitId: "u-7", person: "Amina Osman", type: "tenancy" as const, startDate: "2024-09-01", endDate: null, status: "active" as const },
  { id: "occ-6", unitId: "u-8", person: "Hassan Ali", type: "tenancy" as const, startDate: "2025-06-01", endDate: null, status: "active" as const },
  { id: "occ-7", unitId: "u-10", person: "Fatima Khan", type: "tenancy" as const, startDate: "2024-09-01", endDate: "2025-08-31", status: "ended" as const },
  { id: "occ-8", unitId: "u-10", person: "Fatima Khan", type: "tenancy" as const, startDate: "2025-09-01", endDate: null, status: "active" as const },
  { id: "occ-9", unitId: "u-11", person: "John Kamau", type: "tenancy" as const, startDate: "2025-04-01", endDate: null, status: "active" as const },
];

export const DEMO_INVOICES = [
  { id: "inv-1", number: "INV-2026-0001", unit: "A-04", tenant: "Ahmed Noor", amount: 3500000, amountPaid: 3500000, dueDate: "2026-09-05", status: "paid", period: "Sep 2026" },
  { id: "inv-2", number: "INV-2026-0002", unit: "A-02", tenant: "Sara Ali", amount: 3000000, amountPaid: 3000000, dueDate: "2026-09-05", status: "paid", period: "Sep 2026" },
  { id: "inv-3", number: "INV-2026-0003", unit: "B-01", tenant: "Omar Hassan", amount: 1200000, amountPaid: 0, dueDate: "2026-09-10", status: "overdue", period: "Sep 2026" },
  { id: "inv-4", number: "INV-2026-0004", unit: "A-01", tenant: "Ibrahim Mohamed", amount: 2500000, amountPaid: 1500000, dueDate: "2026-09-15", status: "partial", period: "Sep 2026" },
  { id: "inv-5", number: "INV-2026-0005", unit: "B-03", tenant: "Amina Osman", amount: 4000000, amountPaid: 0, dueDate: "2026-09-20", status: "pending", period: "Sep 2026" },
  { id: "inv-6", number: "INV-2026-0006", unit: "C-01", tenant: "Hassan Ali", amount: 2000000, amountPaid: 0, dueDate: "2026-09-25", status: "pending", period: "Sep 2026" },
  { id: "inv-7", number: "INV-2026-0007", unit: "C-03", tenant: "Fatima Khan", amount: 1500000, amountPaid: 0, dueDate: "2026-10-05", status: "pending", period: "Oct 2026" },
  { id: "inv-8", number: "INV-2026-0008", unit: "C-04", tenant: "John Kamau", amount: 2800000, amountPaid: 2800000, dueDate: "2026-09-05", status: "paid", period: "Sep 2026" },
  { id: "inv-9", number: "INV-2026-0009", unit: "A-01", tenant: "Ibrahim Mohamed", amount: 500000, amountPaid: 500000, dueDate: "2026-09-30", status: "paid", period: "Sep 2026 (SC)" },
  { id: "inv-10", number: "INV-2026-0010", unit: "A-02", tenant: "Sara Ali", amount: 3000000, amountPaid: 0, dueDate: "2026-10-05", status: "pending", period: "Oct 2026" },
];

export const DEMO_PAYMENTS = [
  { id: "pay-1", invoiceNumber: "INV-2026-0001", tenant: "Ahmed Noor", unit: "A-04", amount: 3500000, method: "mpesa_stk", receipt: "QHK4X7B2RT", date: "2026-09-14", status: "completed" },
  { id: "pay-2", invoiceNumber: "INV-2026-0002", tenant: "Sara Ali", unit: "A-02", amount: 3000000, method: "mpesa_stk", receipt: "PLM8N3C5VW", date: "2026-09-14", status: "completed" },
  { id: "pay-3", invoiceNumber: "INV-2026-0004", tenant: "Ibrahim Mohamed", unit: "A-01", amount: 1500000, method: "cash", receipt: null, date: "2026-09-12", status: "completed" },
  { id: "pay-4", invoiceNumber: "INV-2026-0003", tenant: "Omar Hassan", unit: "B-01", amount: 600000, method: "mpesa_c2b", receipt: "RST7Y2K9AB", date: "2026-09-10", status: "completed" },
  { id: "pay-5", invoiceNumber: "INV-2026-0008", tenant: "John Kamau", unit: "C-04", amount: 2800000, method: "mpesa_stk", receipt: "DEF456GHI", date: "2026-09-05", status: "completed" },
  { id: "pay-6", invoiceNumber: "INV-2026-0009", tenant: "Ibrahim Mohamed", unit: "A-01", amount: 500000, method: "bank", receipt: "BNK789JKL", date: "2026-09-30", status: "completed" },
];

export const DEMO_LEDGER = [
  { id: "le-1", date: "2026-09-14", type: "income", category: "rent", description: "INV-2026-0001 — Ahmed Noor", amount: 3500000 },
  { id: "le-2", date: "2026-09-14", type: "income", category: "rent", description: "INV-2026-0002 — Sara Ali", amount: 3000000 },
  { id: "le-3", date: "2026-09-12", type: "income", category: "rent", description: "INV-2026-0004 — Ibrahim Mohamed (partial)", amount: 1500000 },
  { id: "le-4", date: "2026-09-10", type: "income", category: "rent", description: "INV-2026-0003 — Omar Hassan (partial)", amount: 600000 },
  { id: "le-5", date: "2026-09-08", type: "expense", category: "maintenance", description: "Plumbing repair — B-02", amount: 450000 },
  { id: "le-6", date: "2026-09-05", type: "expense", category: "payroll", description: "Payroll — James Mwangi (Security)", amount: 2500000 },
  { id: "le-7", date: "2026-09-05", type: "expense", category: "payroll", description: "Payroll — Mary Wambui (Cleaner)", amount: 1500000 },
  { id: "le-8", date: "2026-09-05", type: "income", category: "service_charge", description: "INV-2026-0009 — Ibrahim Mohamed (SC)", amount: 500000 },
  { id: "le-9", date: "2026-09-05", type: "income", category: "rent", description: "INV-2026-0008 — John Kamau", amount: 2800000 },
  { id: "le-10", date: "2026-09-01", type: "expense", category: "utility", description: "KPLC electricity — Sep 2026", amount: 380000 },
];

export const DEMO_MAINTENANCE = [
  { id: "mr-1", issue: "Leaking faucet in kitchen", unit: "A-04", raisedBy: "Ahmed Noor", date: "2026-09-14", status: "open", cost: null },
  { id: "mr-2", issue: "Broken window latch", unit: "B-02", raisedBy: "Caretaker", date: "2026-09-13", status: "in_progress", cost: 350000 },
  { id: "mr-3", issue: "Electrical fault in hallway", unit: "Common Area", raisedBy: "Sara Ali", date: "2026-09-12", status: "open", cost: null },
  { id: "mr-4", issue: "Cracked tile in bathroom", unit: "A-01", raisedBy: "Ibrahim Mohamed", date: "2026-09-10", status: "resolved", cost: 200000 },
  { id: "mr-5", issue: "Door lock jammed", unit: "C-03", raisedBy: "Fatima Khan", date: "2026-09-08", status: "resolved", cost: 150000 },
  { id: "mr-6", issue: "Water pressure low on 3rd floor", unit: "C-01", raisedBy: "Hassan Ali", date: "2026-09-06", status: "resolved", cost: 800000 },
];

export const DEMO_STAFF = [
  { id: "s-1", name: "James Mwangi", role: "Security Guard", phone: "254712345678", schedule: "Monthly", amount: 2500000, lastPaid: "2026-09-01" },
  { id: "s-2", name: "Mary Wambui", role: "Cleaner", phone: "254723456789", schedule: "Monthly", amount: 1500000, lastPaid: "2026-09-01" },
  { id: "s-3", name: "Peter Kamau", role: "Plumber", phone: "254734567890", schedule: "Per Job", amount: null, lastPaid: "2026-08-15" },
  { id: "s-4", name: "Grace Njeri", role: "Electrician", phone: "254745678901", schedule: "Per Job", amount: null, lastPaid: "2026-07-20" },
];

export const DEMO_APPLICANTS = [
  { id: "a-1", name: "John Kamau", phone: "+254 712 345 678", unit: "A-03", status: "inquired", date: "2026-09-14" },
  { id: "a-2", name: "Grace Wanjiku", phone: "+254 723 456 789", unit: "B-02", status: "viewing", date: "2026-09-13" },
  { id: "a-3", name: "Peter Otieno", phone: "+254 734 567 890", unit: "C-02", status: "approved", date: "2026-09-10" },
  { id: "a-4", name: "Mary Njeri", phone: "+254 745 678 901", unit: "A-03", status: "rejected", date: "2026-09-08" },
  { id: "a-5", name: "Daniel Ochieng", phone: "+254 756 890 123", unit: "D-01", status: "inquired", date: "2026-09-15" },
];

export const DEMO_MESSAGES = [
  {
    id: "t-1", person: "Ahmed Noor", unit: "A-04", lastMessage: "Thank you for the update on the maintenance request.", time: "2026-09-14T10:30:00", unread: 0,
    messages: [
      { id: "m1", sender: "admin", body: "Hello Ahmed, your maintenance request for the leaking faucet has been logged. Our team will review it shortly.", time: "2026-09-14T09:00:00", isInternal: false },
      { id: "m2", sender: "admin", body: "Note: Plumber Peter Kamau is available next Tuesday. Schedule for that day.", time: "2026-09-14T09:05:00", isInternal: true },
      { id: "m3", sender: "tenant", body: "Thank you for the update on the maintenance request.", time: "2026-09-14T10:30:00", isInternal: false },
    ],
  },
  {
    id: "t-2", person: "Sara Ali", unit: "A-02", lastMessage: "When is the next service charge payment due?", time: "2026-09-13T15:45:00", unread: 1,
    messages: [
      { id: "m1", sender: "tenant", body: "When is the next service charge payment due?", time: "2026-09-13T15:45:00", isInternal: false },
      { id: "m2", sender: "admin", body: "Internal: Check her payment history before responding. She has been late 2 months in a row.", time: "2026-09-13T16:00:00", isInternal: true },
    ],
  },
  {
    id: "t-3", person: "Omar Hassan", unit: "B-01", lastMessage: "Payment confirmed. Thank you.", time: "2026-09-12T11:20:00", unread: 0,
    messages: [
      { id: "m1", sender: "admin", body: "Your September invoice has been generated. Please find the details in your portal.", time: "2026-09-10T08:00:00", isInternal: false },
      { id: "m2", sender: "admin", body: "Note: Omar requested early invoice this month due to travel plans.", time: "2026-09-10T08:05:00", isInternal: true },
      { id: "m3", sender: "tenant", body: "Payment confirmed. Thank you.", time: "2026-09-12T11:20:00", isInternal: false },
    ],
  },
  {
    id: "t-4", person: "Amina Osman", unit: "B-03", lastMessage: "Is there a discount for early payment?", time: "2026-09-11T09:15:00", unread: 0,
    messages: [
      { id: "m1", sender: "tenant", body: "Is there a discount for early payment?", time: "2026-09-11T09:15:00", isInternal: false },
      { id: "m2", sender: "admin", body: "Thank you for asking, Amina. Currently there is no early payment discount. The full amount is due by the 20th.", time: "2026-09-11T10:00:00", isInternal: false },
    ],
  },
];

export const DEMO_ANNOUNCEMENTS = [
  { id: "an-1", title: "Water Supply Maintenance", body: "Dear residents, there will be a scheduled water supply interruption on Saturday, 20th September from 8:00 AM to 2:00 PM for maintenance work on the main water line. Please store sufficient water in advance.", sentToAll: true, sentAt: "2026-09-13T09:00:00" },
  { id: "an-2", title: "Monthly Service Charge Reminder", body: "This is a reminder that September service charges are due by 20th September. Please make payments through M-Pesa or at the management office.", sentToAll: true, sentAt: "2026-09-10T08:00:00" },
  { id: "an-3", title: "Parking Lot Rules Update", body: "Please be informed that the parking lot rules have been updated. All vehicles must display valid parking stickers. Non-compliant vehicles will be restricted from the premises.", sentToAll: true, sentAt: "2026-09-05T10:00:00" },
];

// Computed helpers
export const totalOccupied = DEMO_UNITS.filter((u) => u.status === "occupied").length;
export const totalVacant = DEMO_UNITS.filter((u) => u.status === "vacant").length;
export const totalUnits = DEMO_UNITS.length;
export const occupancyRate = Math.round((totalOccupied / totalUnits) * 100);

export const totalCollection = DEMO_PAYMENTS.reduce((sum, p) => sum + p.amount, 0);
export const totalExpected = DEMO_INVOICES.reduce((sum, i) => sum + i.amount, 0);
export const collectionRate = totalExpected > 0 ? Math.round((totalCollection / totalExpected) * 100) : 0;

export const totalOverdue = DEMO_INVOICES
  .filter((i) => i.status === "overdue")
  .reduce((sum, i) => sum + (i.amount - i.amountPaid), 0);
export const overdueCount = DEMO_INVOICES.filter((i) => i.status === "overdue").length;
