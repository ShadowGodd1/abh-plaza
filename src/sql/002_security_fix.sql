-- Security fix: write_ledger_entry SECURITY INVOKER + role check
-- Run this migration to prevent unauthenticated callers from writing arbitrary ledger entries

CREATE OR REPLACE FUNCTION write_ledger_entry(
  p_organization_id uuid,
  p_type text,
  p_category text,
  p_amount integer,
  p_description text DEFAULT NULL,
  p_related_invoice_id uuid DEFAULT NULL,
  p_related_payroll_id uuid DEFAULT NULL,
  p_occurred_at timestamptz DEFAULT now()
)
RETURNS uuid AS $$
DECLARE
  v_id uuid;
  v_role text;
BEGIN
  SELECT raw_user_meta_data->>'role' INTO v_role
  FROM auth.users WHERE id = auth.uid();

  IF v_role IS NULL OR v_role NOT IN ('admin', 'caretaker') THEN
    RAISE EXCEPTION 'Unauthorized: only admin or caretaker can write ledger entries';
  END IF;

  INSERT INTO ledger_entries (
    organization_id, type, category, amount, description,
    related_invoice_id, related_payroll_id, occurred_at
  ) VALUES (
    p_organization_id, p_type, p_category, p_amount, p_description,
    p_related_invoice_id, p_related_payroll_id, p_occurred_at
  ) RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;
