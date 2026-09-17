-- Migration 003: Overpayment credit + phone column on payments
-- Run after 001_full_schema.sql

-- Add phone column to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS phone text;

-- Re-create record_payment with overpayment handling and p_phone parameter
create or replace function record_payment(
  p_invoice_id uuid,
  p_amount integer,
  p_method text,
  p_mpesa_receipt text default null,
  p_recorded_by uuid default null,
  p_notes text default null,
  p_phone text default null
)
returns uuid as $$
declare
  v_payment_id uuid;
  v_invoice RECORD;
  v_occupancy RECORD;
  v_organization_id uuid;
  v_ledger_category text;
  v_excess integer;
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
  insert into payments (invoice_id, amount, method, mpesa_receipt, recorded_by, notes, phone, status)
  values (p_invoice_id, p_amount, p_method, p_mpesa_receipt, p_recorded_by, p_notes, p_phone, 'completed')
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
  if v_invoice.amount_paid + p_amount > v_invoice.amount_due then
    -- Calculate excess
    v_excess := (v_invoice.amount_paid + p_amount) - v_invoice.amount_due;

    -- Find next unpaid invoice for this occupancy and apply credit
    update invoices set
      amount_paid = amount_paid + LEAST(v_excess, amount_due - amount_paid),
      status = case
        when amount_paid + LEAST(v_excess, amount_due - amount_paid) >= amount_due then 'paid'
        when amount_paid + LEAST(v_excess, amount_due - amount_paid) > 0 then 'partial'
        else status
      end,
      updated_at = now()
    where id = (
      SELECT id FROM invoices
      WHERE occupancy_id = v_invoice.occupancy_id
        AND status IN ('pending', 'overdue', 'partial')
        AND id != p_invoice_id
      ORDER BY due_date ASC
      LIMIT 1
    );

    -- Write credit ledger entry
    insert into ledger_entries (organization_id, type, category, amount, description, related_invoice_id)
    values (v_organization_id, 'income', 'other', v_excess,
            'Overpayment credit applied to next invoice', p_invoice_id);
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
