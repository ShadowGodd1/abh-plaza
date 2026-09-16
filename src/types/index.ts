export type UserRole = "admin" | "caretaker" | "tenant" | "owner";

export interface User {
  id: string;
  email?: string;
  phone?: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  organization_id: string;
}

export interface Organization {
  id: string;
  name: string;
  logo_url?: string;
  colors?: Record<string, string>;
  plan?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  organization_id: string;
  name: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface UnitType {
  id: string;
  organization_id: string;
  name: string;
  category: "residential" | "commercial" | "other";
  created_at: string;
  updated_at: string;
}

export type UnitStatus = "vacant" | "occupied" | "under_maintenance" | "reserved";

export interface Unit {
  id: string;
  property_id: string;
  unit_type_id: string;
  label: string;
  status: UnitStatus;
  floor?: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  unit_type?: UnitType;
  property?: Property;
  current_occupancy?: Occupancy;
}

export interface Person {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  id_number?: string;
  id_document_url?: string;
  created_at: string;
  updated_at: string;
}

export type OccupancyType = "tenancy" | "ownership";
export type OccupancyStatus = "active" | "ended" | "expired";

export interface Occupancy {
  id: string;
  unit_id: string;
  person_id: string;
  type: OccupancyType;
  start_date: string;
  end_date?: string;
  status: OccupancyStatus;
  created_at: string;
  updated_at: string;
  // Joined
  person?: Person;
  unit?: Unit;
  lease?: Lease;
  ownership_record?: OwnershipRecord;
}

export interface Lease {
  id: string;
  occupancy_id: string;
  rent_amount: number;
  deposit_amount: number;
  escalation_rule?: string;
  terms?: string;
  status: "active" | "expired" | "terminated";
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnershipRecord {
  id: string;
  occupancy_id: string;
  purchase_date: string;
  service_charge_amount: number;
  created_at: string;
  updated_at: string;
}

export type BillCategory = "rent" | "service_charge" | "utility" | "custom";
export type BillFrequency = "monthly" | "quarterly" | "annually" | "one_off";

export interface BillSchedule {
  id: string;
  occupancy_id: string;
  frequency: BillFrequency;
  amount: number;
  category: BillCategory;
  next_due_date?: string;
  created_at: string;
  updated_at: string;
}

export type InvoiceStatus = "pending" | "paid" | "partial" | "overdue" | "void";

export interface Invoice {
  id: string;
  occupancy_id: string;
  bill_schedule_id?: string;
  invoice_number: string;
  period_start: string;
  period_end: string;
  amount_due: number;
  amount_paid: number;
  due_date: string;
  status: InvoiceStatus;
  created_at: string;
  updated_at: string;
  // Joined
  occupancy?: Occupancy;
  payments?: Payment[];
}

export type PaymentMethod = "mpesa_stk" | "mpesa_c2b" | "cash" | "bank";
export type PaymentStatus = "pending" | "completed" | "failed" | "reversed";

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  method: PaymentMethod;
  mpesa_receipt?: string;
  paid_at: string;
  recorded_by?: string;
  status: PaymentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type LedgerType = "income" | "expense";
export type LedgerCategory =
  | "rent"
  | "service_charge"
  | "utility"
  | "deposit"
  | "maintenance"
  | "payroll"
  | "other";

export interface LedgerEntry {
  id: string;
  organization_id: string;
  type: LedgerType;
  category: LedgerCategory;
  amount: number;
  description?: string;
  related_invoice_id?: string;
  related_payroll_id?: string;
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

export interface LateFeeRule {
  id: string;
  organization_id: string;
  grace_days: number;
  fee_type: "flat" | "percentage";
  fee_value: number;
  created_at: string;
  updated_at: string;
}

export interface StaffVendor {
  id: string;
  organization_id: string;
  name: string;
  role: string;
  phone?: string;
  payment_schedule?: string;
  amount?: number;
  created_at: string;
  updated_at: string;
}

export interface PayrollPayment {
  id: string;
  staff_vendor_id: string;
  amount: number;
  paid_at: string;
  ledger_entry_id: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  staff_vendor?: StaffVendor;
}

export type MessageChannel = "in_app" | "sms";

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  channel: MessageChannel;
  sent_at: string;
  read_at?: string;
  created_at: string;
  sender?: Person;
  recipient?: Person;
}

export interface MessageThread {
  id: string;
  subject?: string;
  participants: string[];
  last_message?: Message;
  updated_at: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  organization_id: string;
  body: string;
  title?: string;
  sent_to_all: boolean;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InternalNote {
  id: string;
  subject_type: "person" | "unit";
  subject_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  author?: Person;
}

export type MaintenanceStatus = "open" | "in_progress" | "resolved";

export interface MaintenanceRequest {
  id: string;
  unit_id: string;
  raised_by?: string;
  description: string;
  photo_url?: string;
  status: MaintenanceStatus;
  resolution_notes?: string;
  cost?: number;
  ledger_entry_id?: string;
  created_at: string;
  updated_at: string;
  unit?: Unit;
  raised_by_person?: Person;
}

export type MoveChecklistType = "move_in" | "move_out";

export interface MoveChecklist {
  id: string;
  occupancy_id: string;
  type: MoveChecklistType;
  notes?: string;
  photo_urls?: string[];
  completed_by?: string;
  completed_at?: string;
  items?: MoveChecklistItem[];
  created_at: string;
  updated_at: string;
}

export interface MoveChecklistItem {
  id: string;
  checklist_id: string;
  label: string;
  completed: boolean;
  notes?: string;
}

export type ApplicantStatus = "inquired" | "viewing" | "approved" | "rejected" | "converted";

export interface Applicant {
  id: string;
  person_id: string;
  unit_id?: string;
  status: ApplicantStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  person?: Person;
  unit?: Unit;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  occurred_at: string;
  actor?: Person;
}

export interface PaymentException {
  id: string;
  mpesa_receipt?: string;
  amount: number;
  account_reference?: string;
  raw_payload: Record<string, unknown>;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationTemplate {
  id: string;
  key: string;
  language: "en" | "sw";
  subject?: string;
  body: string;
  created_at: string;
  updated_at: string;
}
