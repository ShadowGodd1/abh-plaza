-- ABH Plaza PMS Database Schema
-- Run against Supabase SQL editor or via migration

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text,
  colors jsonb default '{}',
  plan text default 'standard',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- PROPERTIES
-- ============================================================
create table properties (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id),
  name text not null,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- UNIT TYPES
-- ============================================================
create table unit_types (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id),
  name text not null,
  category text not null check (category in ('residential', 'commercial', 'other')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- UNITS
-- ============================================================
create table units (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id),
  unit_type_id uuid not null references unit_types(id),
  label text not null,
  status text not null default 'vacant' check (status in ('vacant', 'occupied', 'under_maintenance', 'reserved')),
  floor integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(property_id, label)
);

-- ============================================================
-- PEOPLE
-- ============================================================
create table people (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  email text,
  id_number text,
  id_document_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- OCCUPANCIES
-- ============================================================
create table occupancies (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid not null references units(id),
  person_id uuid not null references people(id),
  type text not null check (type in ('tenancy', 'ownership')),
  start_date date not null,
  end_date date,
  status text not null default 'active' check (status in ('active', 'ended', 'expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Constraint: No overlapping active occupancies on the same unit
-- Enforced via trigger check_overlapping_occupancies() below

-- Actually enforce no two active occupancies for same unit
-- This trigger-based approach is more reliable
create or replace function check_overlapping_occupancies()
returns trigger as $$
begin
  if NEW.status = 'active' then
    if exists (
      select 1 from occupancies
      where unit_id = NEW.unit_id
        and status = 'active'
        and id != NEW.id
    ) then
      raise exception 'Unit % already has an active occupancy', NEW.unit_id;
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_check_overlapping_occupancies
  before insert or update on occupancies
  for each row execute function check_overlapping_occupancies();

-- ============================================================
-- LEASES
-- ============================================================
create table leases (
  id uuid primary key default uuid_generate_v4(),
  occupancy_id uuid not null references occupancies(id) unique,
  rent_amount integer not null check (rent_amount >= 0),
  deposit_amount integer not null default 0 check (deposit_amount >= 0),
  escalation_rule text,
  terms text,
  status text not null default 'active' check (status in ('active', 'expired', 'terminated')),
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- OWNERSHIP RECORDS
-- ============================================================
create table ownership_records (
  id uuid primary key default uuid_generate_v4(),
  occupancy_id uuid not null references occupancies(id) unique,
  purchase_date date not null,
  service_charge_amount integer not null default 0 check (service_charge_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- BILL SCHEDULES
-- ============================================================
create table bill_schedules (
  id uuid primary key default uuid_generate_v4(),
  occupancy_id uuid not null references occupancies(id),
  frequency text not null check (frequency in ('monthly', 'quarterly', 'annually', 'one_off')),
  amount integer not null check (amount > 0),
  category text not null check (category in ('rent', 'service_charge', 'utility', 'custom')),
  next_due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- INVOICES (with sequential numbering)
-- ============================================================
create sequence invoice_number_seq start 1;

create table invoices (
  id uuid primary key default uuid_generate_v4(),
  occupancy_id uuid not null references occupancies(id),
  bill_schedule_id uuid references bill_schedules(id),
  invoice_number text not null default lpad(nextval('invoice_number_seq')::text, 6, '0'),
  period_start date not null,
  period_end date not null,
  amount_due integer not null check (amount_due >= 0),
  amount_paid integer not null default 0 check (amount_paid >= 0),
  due_date date not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'partial', 'overdue', 'void')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure sequential invoice numbers per organization
create unique index idx_invoice_number_unique on invoices (invoice_number);

-- ============================================================
-- PAYMENTS
-- ============================================================
create table payments (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id),
  amount integer not null check (amount > 0),
  method text not null check (method in ('mpesa_stk', 'mpesa_c2b', 'cash', 'bank')),
  mpesa_receipt text,
  paid_at timestamptz not null default now(),
  recorded_by uuid,
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed', 'reversed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Idempotency: unique mpesa_receipt
create unique index idx_payments_mpesa_receipt_unique
  on payments (mpesa_receipt)
  where mpesa_receipt is not null;

-- ============================================================
-- LEDGER ENTRIES
-- ============================================================
create table ledger_entries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id),
  type text not null check (type in ('income', 'expense')),
  category text not null check (category in ('rent', 'service_charge', 'utility', 'deposit', 'maintenance', 'payroll', 'other')),
  amount integer not null check (amount > 0),
  description text,
  related_invoice_id uuid references invoices(id),
  related_payroll_id uuid,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- LATE FEE RULES
-- ============================================================
create table late_fee_rules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id),
  grace_days integer not null default 0 check (grace_days >= 0),
  fee_type text not null check (fee_type in ('flat', 'percentage')),
  fee_value integer not null check (fee_value > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- STAFF / VENDORS
-- ============================================================
create table staff_vendors (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id),
  name text not null,
  role text not null,
  phone text,
  payment_schedule text,
  amount integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- PAYROLL PAYMENTS
-- ============================================================
create table payroll_payments (
  id uuid primary key default uuid_generate_v4(),
  staff_vendor_id uuid not null references staff_vendors(id),
  amount integer not null check (amount > 0),
  paid_at timestamptz not null default now(),
  ledger_entry_id uuid not null references ledger_entries(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- MESSAGES
-- ============================================================
create table messages (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null,
  sender_id uuid not null,
  recipient_id uuid not null,
  body text not null,
  channel text not null default 'in_app' check (channel in ('in_app', 'sms')),
  sent_at timestamptz not null default now(),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_messages_thread on messages (thread_id);
create index idx_messages_recipient on messages (recipient_id, read_at);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
create table announcements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id),
  title text,
  body text not null,
  sent_to_all boolean not null default false,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- INTERNAL NOTES (never exposed to tenant/owner)
-- ============================================================
create table internal_notes (
  id uuid primary key default uuid_generate_v4(),
  subject_type text not null check (subject_type in ('person', 'unit')),
  subject_id uuid not null,
  author_id uuid not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- MAINTENANCE REQUESTS
-- ============================================================
create table maintenance_requests (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid not null references units(id),
  raised_by uuid,
  description text not null,
  photo_url text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  resolution_notes text,
  cost integer check (cost is null or cost >= 0),
  ledger_entry_id uuid references ledger_entries(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- MOVE CHECKLISTS
-- ============================================================
create table move_checklists (
  id uuid primary key default uuid_generate_v4(),
  occupancy_id uuid not null references occupancies(id),
  type text not null check (type in ('move_in', 'move_out')),
  notes text,
  photo_urls text[],
  completed_by uuid,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- APPLICANTS
-- ============================================================
create table applicants (
  id uuid primary key default uuid_generate_v4(),
  person_id uuid not null references people(id),
  unit_id uuid references units(id),
  status text not null default 'inquired' check (status in ('inquired', 'viewing', 'approved', 'rejected', 'converted')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  before jsonb,
  after jsonb,
  occurred_at timestamptz not null default now()
);

create index idx_audit_entity on audit_logs (entity_type, entity_id);

-- ============================================================
-- PAYMENT EXCEPTIONS (for unmatched M-Pesa callbacks)
-- ============================================================
create table payment_exceptions (
  id uuid primary key default uuid_generate_v4(),
  mpesa_receipt text,
  amount integer not null,
  account_reference text,
  raw_payload jsonb not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'resolved', 'rejected')),
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- NOTIFICATION TEMPLATES
-- ============================================================
create table notification_templates (
  id uuid primary key default uuid_generate_v4(),
  key text not null,
  language text not null check (language in ('en', 'sw')),
  subject text,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(key, language)
);

-- ============================================================
-- LEDGER WRITE FUNCTION (single entry point)
-- ============================================================
create or replace function write_ledger_entry(
  p_organization_id uuid,
  p_type text,
  p_category text,
  p_amount integer,
  p_description text default null,
  p_related_invoice_id uuid default null,
  p_related_payroll_id uuid default null,
  p_occurred_at timestamptz default now()
)
returns uuid as $$
declare
  v_id uuid;
begin
  insert into ledger_entries (
    organization_id, type, category, amount, description,
    related_invoice_id, related_payroll_id, occurred_at
  ) values (
    p_organization_id, p_type, p_category, p_amount, p_description,
    p_related_invoice_id, p_related_payroll_id, p_occurred_at
  ) returning id into v_id;

  return v_id;
end;
$$ language plpgsql;

-- ============================================================
-- PAYMENT RECORDING FUNCTION (with ledger side effects)
-- ============================================================
create or replace function record_payment(
  p_invoice_id uuid,
  p_amount integer,
  p_method text,
  p_mpesa_receipt text default null,
  p_recorded_by uuid default null,
  p_notes text default null
)
returns uuid as $$
declare
  v_payment_id uuid;
  v_invoice RECORD;
  v_occupancy RECORD;
  v_organization_id uuid;
  v_ledger_category text;
begin
  -- Get invoice details
  select * into v_invoice from invoices where id = p_invoice_id;
  if not found then
    raise exception 'Invoice not found: %', p_invoice_id;
  end if;

  -- Idempotency check for M-Pesa receipts
  if p_mpesa_receipt is not null then
    if exists (select 1 from payments where mpesa_receipt = p_mpesa_receipt) then
      raise exception 'Duplicate M-Pesa receipt: %', p_mpesa_receipt;
    end if;
  end if;

  -- Get occupancy and organization
  select o.*, p.organization_id into v_occupancy
  from occupancies o
  join units u on u.id = o.unit_id
  where o.id = v_invoice.occupancy_id;

  v_organization_id := v_occupancy.organization_id;

  -- Determine ledger category
  v_ledger_category := case
    when v_occupancy.type = 'tenancy' then 'rent'
    when v_occupancy.type = 'ownership' then 'service_charge'
    else 'other'
  end;

  -- Create payment
  insert into payments (invoice_id, amount, method, mpesa_receipt, recorded_by, notes, status)
  values (p_invoice_id, p_amount, p_method, p_mpesa_receipt, p_recorded_by, p_notes, 'completed')
  returning id into v_payment_id;

  -- Update invoice
  update invoices set
    amount_paid = amount_paid + p_amount,
    status = case
      when amount_paid + p_amount >= amount_due then 'paid'
      when amount_paid + p_amount > 0 then 'partial'
      else status
    end,
    updated_at = now()
  where id = p_invoice_id;

  -- Handle overpayment (credit toward next invoice)
  if amount_paid + p_amount > v_invoice.amount_due then
    -- TODO: apply excess to next invoice for this occupancy
    null;
  end if;

  -- Write ledger entry
  perform write_ledger_entry(
    v_organization_id,
    'income',
    v_ledger_category,
    p_amount,
    'Payment for ' || v_invoice.invoice_number,
    p_invoice_id
  );

  return v_payment_id;
end;
$$ language plpgsql;

-- ============================================================
-- PAYROLL PAYMENT FUNCTION (with ledger side effects)
-- ============================================================
create or replace function record_payroll_payment(
  p_staff_vendor_id uuid,
  p_amount integer,
  p_notes text default null
)
returns uuid as $$
declare
  v_payroll_id uuid;
  v_ledger_id uuid;
  v_staff RECORD;
begin
  select * into v_staff from staff_vendors where id = p_staff_vendor_id;
  if not found then
    raise exception 'Staff/vendor not found: %', p_staff_vendor_id;
  end if;

  -- Write ledger expense entry
  v_ledger_id := write_ledger_entry(
    v_staff.organization_id,
    'expense',
    'payroll',
    p_amount,
    'Payroll: ' || v_staff.name,
    null,
    null,
    now()
  );

  -- Create payroll payment record
  insert into payroll_payments (staff_vendor_id, amount, ledger_entry_id, notes)
  values (p_staff_vendor_id, p_amount, v_ledger_id, p_notes)
  returning id into v_payroll_id;

  return v_payroll_id;
end;
$$ language plpgsql;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'organizations', 'properties', 'unit_types', 'units', 'people',
      'occupancies', 'leases', 'ownership_records', 'bill_schedules',
      'invoices', 'payments', 'ledger_entries', 'late_fee_rules',
      'staff_vendors', 'payroll_payments', 'announcements', 'internal_notes',
      'maintenance_requests', 'move_checklists', 'applicants',
      'payment_exceptions', 'notification_templates'
    ])
  loop
    execute format(
      'create trigger trg_update_%s_updated_at before update on %s
       for each row execute function update_updated_at()',
      t, t
    );
  end loop;
end $$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'organizations', 'properties', 'unit_types', 'units', 'people',
      'occupancies', 'leases', 'ownership_records', 'bill_schedules',
      'invoices', 'payments', 'ledger_entries', 'late_fee_rules',
      'staff_vendors', 'payroll_payments', 'messages', 'announcements',
      'internal_notes', 'maintenance_requests', 'move_checklists',
      'applicants', 'audit_logs', 'payment_exceptions', 'notification_templates'
    ])
  loop
    execute format('alter table %s enable row level security', t);
  end loop;
end $$;

-- Helper: get current user's role
create or replace function public.user_role()
returns text as $$
  select coalesce(
    (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()),
    'tenant'
  );
$$ language sql security definer stable;

-- Helper: get current user's organization_id
create or replace function public.user_org_id()
returns uuid as $$
  select coalesce(
    (select (raw_user_meta_data->>'organization_id')::uuid from auth.users where id = auth.uid()),
    '00000000-0000-0000-0000-000000000000'::uuid
  );
$$ language sql security definer stable;

-- ============================================================
-- RLS POLICIES: INTERNAL NOTES (highest risk - restrict first)
-- ============================================================
-- Only admin can see internal notes
create policy "internal_notes_admin_all" on internal_notes
  for all using (public.user_role() = 'admin');

-- Deny everyone else
create policy "internal_notes_deny_others" on internal_notes
  for all using (false);

-- ============================================================
-- RLS POLICIES: LEDGER ENTRIES (highest risk)
-- ============================================================
-- Only admin can access ledger
create policy "ledger_entries_admin_all" on ledger_entries
  for all using (public.user_role() = 'admin');

-- Deny everyone else
create policy "ledger_entries_deny_others" on ledger_entries
  for all using (false);

-- ============================================================
-- RLS POLICIES: ORGANIZATIONS
-- ============================================================
create policy "org_admin_all" on organizations
  for all using (public.user_role() = 'admin' and id = public.user_org_id());

create policy "org_caretaker_read" on organizations
  for select using (public.user_role() = 'caretaker' and id = public.user_org_id());

create policy "org_tenant_read" on organizations
  for select using (public.user_role() = 'tenant' and id = public.user_org_id());

create policy "org_owner_read" on organizations
  for select using (public.user_role() = 'owner' and id = public.user_org_id());

-- ============================================================
-- RLS POLICIES: PROPERTIES
-- ============================================================
create policy "properties_admin_all" on properties
  for all using (public.user_role() = 'admin' and organization_id = public.user_org_id());

create policy "properties_caretaker_read" on properties
  for select using (public.user_role() = 'caretaker' and organization_id = public.user_org_id());

create policy "properties_tenant_read" on properties
  for select using (public.user_role() = 'tenant' and organization_id = public.user_org_id());

create policy "properties_owner_read" on properties
  for select using (public.user_role() = 'owner' and organization_id = public.user_org_id());

-- ============================================================
-- RLS POLICIES: UNIT TYPES
-- ============================================================
create policy "unit_types_admin_all" on unit_types
  for all using (public.user_role() = 'admin' and organization_id = public.user_org_id());

create policy "unit_types_caretaker_read" on unit_types
  for select using (public.user_role() = 'caretaker' and organization_id = public.user_org_id());

create policy "unit_types_tenant_read" on unit_types
  for select using (public.user_role() = 'tenant' and organization_id = public.user_org_id());

create policy "unit_types_owner_read" on unit_types
  for select using (public.user_role() = 'owner' and organization_id = public.user_org_id());

-- ============================================================
-- RLS POLICIES: UNITS
-- ============================================================
create policy "units_admin_all" on units
  for all using (public.user_role() = 'admin');

create policy "units_caretaker_read_write" on units
  for all using (public.user_role() = 'caretaker');

create policy "units_tenant_read_own" on units
  for select using (
    public.user_role() = 'tenant' and
    id in (
      select unit_id from occupancies
      where person_id = (select id from people where id = auth.uid())
        and status = 'active'
    )
  );

create policy "units_owner_read_own" on units
  for select using (
    public.user_role() = 'owner' and
    id in (
      select unit_id from occupancies
      where person_id = (select id from people where id = auth.uid())
        and status = 'active'
    )
  );

-- ============================================================
-- RLS POLICIES: PEOPLE
-- ============================================================
create policy "people_admin_all" on people
  for all using (public.user_role() = 'admin');

create policy "people_caretaker_read" on people
  for select using (public.user_role() = 'caretaker');

create policy "people_tenant_read_own" on people
  for select using (public.user_role() = 'tenant' and id = auth.uid());

create policy "people_tenant_update_own" on people
  for update using (public.user_role() = 'tenant' and id = auth.uid());

create policy "people_owner_read_own" on people
  for select using (public.user_role() = 'owner' and id = auth.uid());

create policy "people_owner_update_own" on people
  for update using (public.user_role() = 'owner' and id = auth.uid());

-- ============================================================
-- RLS POLICIES: OCCUPANCIES
-- ============================================================
create policy "occupancies_admin_all" on occupancies
  for all using (public.user_role() = 'admin');

create policy "occupancies_caretaker_read" on occupancies
  for select using (public.user_role() = 'caretaker');

create policy "occupancies_tenant_read_own" on occupancies
  for select using (
    public.user_role() = 'tenant' and
    person_id in (select id from people where id = auth.uid())
  );

create policy "occupancies_owner_read_own" on occupancies
  for select using (
    public.user_role() = 'owner' and
    person_id in (select id from people where id = auth.uid())
  );

-- ============================================================
-- RLS POLICIES: LEASES
-- ============================================================
create policy "leases_admin_all" on leases
  for all using (public.user_role() = 'admin');

create policy "leases_caretaker_read" on leases
  for select using (public.user_role() = 'caretaker');

create policy "leases_tenant_read_own" on leases
  for select using (
    public.user_role() = 'tenant' and
    occupancy_id in (
      select id from occupancies
      where person_id in (select id from people where id = auth.uid())
    )
  );

create policy "leases_owner_read_own" on leases
  for select using (
    public.user_role() = 'owner' and
    occupancy_id in (
      select id from occupancies
      where person_id in (select id from people where id = auth.uid())
    )
  );

-- ============================================================
-- RLS POLICIES: OWNERSHIP RECORDS
-- ============================================================
create policy "ownership_records_admin_all" on ownership_records
  for all using (public.user_role() = 'admin');

create policy "ownership_records_caretaker_read" on ownership_records
  for select using (public.user_role() = 'caretaker');

create policy "ownership_records_owner_read_own" on ownership_records
  for select using (
    public.user_role() = 'owner' and
    occupancy_id in (
      select id from occupancies
      where person_id in (select id from people where id = auth.uid())
    )
  );

-- ============================================================
-- RLS POLICIES: BILL SCHEDULES
-- ============================================================
create policy "bill_schedules_admin_all" on bill_schedules
  for all using (public.user_role() = 'admin');

create policy "bill_schedules_caretaker_read" on bill_schedules
  for select using (public.user_role() = 'caretaker');

-- ============================================================
-- RLS POLICIES: INVOICES
-- ============================================================
create policy "invoices_admin_all" on invoices
  for all using (public.user_role() = 'admin');

create policy "invoices_caretaker_read" on invoices
  for select using (public.user_role() = 'caretaker');

create policy "invoices_tenant_read_own" on invoices
  for select using (
    public.user_role() = 'tenant' and
    occupancy_id in (
      select id from occupancies
      where person_id in (select id from people where id = auth.uid())
    )
  );

create policy "invoices_owner_read_own" on invoices
  for select using (
    public.user_role() = 'owner' and
    occupancy_id in (
      select id from occupancies
      where person_id in (select id from people where id = auth.uid())
    )
  );

-- ============================================================
-- RLS POLICIES: PAYMENTS
-- ============================================================
create policy "payments_admin_all" on payments
  for all using (public.user_role() = 'admin');

create policy "payments_caretaker_read" on payments
  for select using (public.user_role() = 'caretaker');

create policy "payments_tenant_read_own" on payments
  for select using (
    public.user_role() = 'tenant' and
    invoice_id in (
      select i.id from invoices i
      join occupancies o on o.id = i.occupancy_id
      where o.person_id in (select id from people where id = auth.uid())
    )
  );

create policy "payments_owner_read_own" on payments
  for select using (
    public.user_role() = 'owner' and
    invoice_id in (
      select i.id from invoices i
      join occupancies o on o.id = i.occupancy_id
      where o.person_id in (select id from people where id = auth.uid())
    )
  );

-- ============================================================
-- RLS POLICIES: MESSAGES
-- ============================================================
create policy "messages_admin_all" on messages
  for all using (public.user_role() = 'admin');

create policy "messages_caretaker_read_write" on messages
  for all using (public.user_role() = 'caretaker');

create policy "messages_tenant_read_own" on messages
  for select using (
    public.user_role() = 'tenant' and
    (sender_id = auth.uid() or recipient_id = auth.uid())
  );

create policy "messages_tenant_send" on messages
  for insert with check (
    public.user_role() = 'tenant' and sender_id = auth.uid()
  );

create policy "messages_owner_read_own" on messages
  for select using (
    public.user_role() = 'owner' and
    (sender_id = auth.uid() or recipient_id = auth.uid())
  );

create policy "messages_owner_send" on messages
  for insert with check (
    public.user_role() = 'owner' and sender_id = auth.uid()
  );

-- ============================================================
-- RLS POLICIES: ANNOUNCEMENTS
-- ============================================================
create policy "announcements_admin_all" on announcements
  for all using (public.user_role() = 'admin');

create policy "announcements_caretaker_read" on announcements
  for select using (public.user_role() = 'caretaker');

create policy "announcements_tenant_read" on announcements
  for select using (public.user_role() = 'tenant');

create policy "announcements_owner_read" on announcements
  for select using (public.user_role() = 'owner');

-- ============================================================
-- RLS POLICIES: MAINTENANCE REQUESTS
-- ============================================================
create policy "maintenance_admin_all" on maintenance_requests
  for all using (public.user_role() = 'admin');

create policy "maintenance_caretaker_read_write" on maintenance_requests
  for all using (public.user_role() = 'caretaker');

create policy "maintenance_tenant_read_own" on maintenance_requests
  for select using (
    public.user_role() = 'tenant' and
    unit_id in (
      select unit_id from occupancies
      where person_id in (select id from people where id = auth.uid())
        and status = 'active'
    )
  );

create policy "maintenance_tenant_create_own" on maintenance_requests
  for insert with check (
    public.user_role() = 'tenant' and
    unit_id in (
      select unit_id from occupancies
      where person_id in (select id from people where id = auth.uid())
        and status = 'active'
    )
  );

create policy "maintenance_owner_read_own" on maintenance_requests
  for select using (
    public.user_role() = 'owner' and
    unit_id in (
      select unit_id from occupancies
      where person_id in (select id from people where id = auth.uid())
        and status = 'active'
    )
  );

-- ============================================================
-- RLS POLICIES: APPLICANTS
-- ============================================================
create policy "applicants_admin_all" on applicants
  for all using (public.user_role() = 'admin');

create policy "applicants_caretaker_read_write" on applicants
  for all using (public.user_role() = 'caretaker');

-- ============================================================
-- RLS POLICIES: MOVE CHECKLISTS
-- ============================================================
create policy "move_checklists_admin_all" on move_checklists
  for all using (public.user_role() = 'admin');

create policy "move_checklists_caretaker_read_write" on move_checklists
  for all using (public.user_role() = 'caretaker');

-- ============================================================
-- RLS POLICIES: STAFF/VENDORS
-- ============================================================
create policy "staff_vendors_admin_all" on staff_vendors
  for all using (public.user_role() = 'admin');

-- ============================================================
-- RLS POLICIES: PAYROLL
-- ============================================================
-- Only admin - no other roles
create policy "payroll_payments_admin_only" on payroll_payments
  for all using (public.user_role() = 'admin');

-- ============================================================
-- RLS POLICIES: AUDIT LOGS
-- ============================================================
create policy "audit_logs_admin_read" on audit_logs
  for select using (public.user_role() = 'admin');

-- ============================================================
-- RLS POLICIES: PAYMENT EXCEPTIONS
-- ============================================================
create policy "payment_exceptions_admin_all" on payment_exceptions
  for all using (public.user_role() = 'admin');

-- ============================================================
-- RLS POLICIES: LATE FEE RULES
-- ============================================================
create policy "late_fee_rules_admin_all" on late_fee_rules
  for all using (public.user_role() = 'admin');

-- ============================================================
-- RLS POLICIES: NOTIFICATION TEMPLATES
-- ============================================================
create policy "notification_templates_admin_all" on notification_templates
  for all using (public.user_role() = 'admin');

-- ============================================================
-- SEED: Default organization
-- ============================================================
insert into organizations (id, name, plan) values
  ('00000000-0000-0000-0000-000000000000', 'ABH Plaza', 'standard');

-- ============================================================
-- SEED: Default notification templates (English + Swahili)
-- ============================================================
insert into notification_templates (key, language, subject, body) values
('invoice_reminder', 'en', 'Payment Reminder', 'Dear {name}, your invoice {invoice_number} for KES {amount} is due on {due_date}. Please make payment promptly.'),
('invoice_reminder', 'sw', 'Ukumbusho wa Malipo', 'Mpendwa {name}, anketa yako {invoice_number} ya KES {amount} inadaiwa tarehe {due_date}. Tafadhali fanya malipo kwa wakati.'),
('payment_received', 'en', 'Payment Confirmed', 'Your payment of KES {amount} for invoice {invoice_number} has been received. Receipt: {receipt}'),
('payment_received', 'sw', 'Malipo Yamethibitishwa', 'Malipo yako ya KES {amount} kwa anketa {invoice_number} yamepokelewa. Risiti: {receipt}'),
('maintenance_update', 'en', 'Maintenance Update', 'Your maintenance request for unit {unit} has been updated. Status: {status}'),
('maintenance_update', 'sw', 'Sasisha ya Matengenezo', 'Ombi lako la matengenezo kwa kitengo {unit} limesasishwa. Hali: {status}');
