"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import * as demo from "@/lib/demo-data";

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("placeholder")
  );
}

function requireRole(user: any, ...roles: string[]) {
  const userRole = user?.user_metadata?.role || user?.app_metadata?.role;
  if (!roles.includes(userRole)) {
    throw new Error("Unauthorized: insufficient permissions");
  }
}

// ============================================================
// PAYMENT ACTIONS
// ============================================================
export async function recordManualPayment(invoiceId: string, amount: number, method: string, notes?: string) {
  if (amount <= 0) return { error: "Amount must be greater than zero" };
  if (!["cash", "bank"].includes(method)) return { error: "Invalid payment method for manual entry" };

  if (!isSupabaseConfigured()) {
    return { success: true, payment_id: "demo-payment-" + Date.now(), message: "Payment recorded (demo mode)" };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin", "caretaker");

    const { data: invoice } = await supabase
      .from("invoices")
      .select("id, amount_due, amount_paid, status, invoice_number, occupancy_id")
      .eq("id", invoiceId)
      .single();

    if (!invoice) return { error: "Invoice not found" };
    if (invoice.status === "paid") return { error: "Invoice is already fully paid" };
    if (invoice.status === "void") return { error: "Cannot pay a void invoice" };

    const remaining = invoice.amount_due - invoice.amount_paid;
    if (amount > remaining) {
      const { error } = await supabase.rpc("record_payment", {
        p_invoice_id: invoiceId,
        p_amount: remaining,
        p_method: method,
        p_recorded_by: user.id,
        p_notes: notes || `Overpayment by ${amount - remaining} cents`,
      });
      if (error) return { error: error.message };
      return { success: true, message: `Payment of ${remaining} recorded. Excess of ${amount - remaining} credited.` };
    }

    const { error } = await supabase.rpc("record_payment", {
      p_invoice_id: invoiceId,
      p_amount: amount,
      p_method: method,
      p_recorded_by: user.id,
      p_notes: notes,
    });
    if (error) return { error: error.message };

    revalidatePath("/billing/invoices");
    revalidatePath("/billing/payments");
    revalidatePath("/ledger");
    revalidatePath("/dashboard");
    return { success: true, message: "Payment recorded successfully" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}

export async function initiateMpesaStkPush(invoiceId: string, phoneNumber: string) {
  if (!phoneNumber) return { error: "Phone number is required" };

  const normalized = phoneNumber.replace(/[\s\-\(\)]/g, "");
  if (!/^254[0-9]{9}$/.test(normalized)) {
    return { error: "Enter a valid Kenyan phone number (2547XXXXXXXX)" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true, payment_id: "demo-stk-" + Date.now(), message: "STK push sent (demo mode)" };
  }

  const supabase = await createClient();
  const { data: invoice } = await supabase
    .from("invoices")
    .select("amount_due, amount_paid")
    .eq("id", invoiceId)
    .single();

  if (!invoice) {
    return { success: false, error: "Invoice not found" };
  }

  const remaining = invoice.amount_due - (invoice.amount_paid || 0);
  const amount = Math.max(remaining, 0);

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "https://abh-plaza.vercel.app"}/api/mpesa/stk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invoice_id: invoiceId, phone_number: normalized, amount }),
  });

  const data = await response.json();
  if (!response.ok) return { error: data.error || "STK push failed" };
  return { success: true, payment_id: data.payment_id, message: data.message };
}

// ============================================================
// INVOICE ACTIONS
// ============================================================
export async function createInvoice(formData: FormData) {
  const occupancyId = formData.get("occupancy_id") as string;
  const amount = parseInt(formData.get("amount") as string, 10);
  const dueDate = formData.get("due_date") as string;
  const periodStart = formData.get("period_start") as string;
  const periodEnd = formData.get("period_end") as string;
  const category = formData.get("category") as string;

  if (!occupancyId || !amount || !dueDate || !periodStart || !periodEnd) {
    return { error: "All fields are required" };
  }
  if (amount <= 0) return { error: "Amount must be positive" };

  if (!isSupabaseConfigured()) {
    return { success: true, invoice_id: "demo-inv-" + Date.now(), message: "Invoice created (demo mode)" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase.from("invoices").insert({
    occupancy_id: occupancyId,
    period_start: periodStart,
    period_end: periodEnd,
    amount_due: amount,
    due_date: dueDate,
    status: "pending",
  }).select().single();

  if (error) return { error: error.message };
  revalidatePath("/billing/invoices");
  revalidatePath("/dashboard");
  return { success: true, invoice_id: data.id, message: "Invoice created" };
}

export async function voidInvoice(invoiceId: string) {
  if (!isSupabaseConfigured()) {
    return { success: true, message: "Invoice voided (demo mode)" };
  }
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin");

    const { error } = await supabase.from("invoices").update({ status: "void" }).eq("id", invoiceId);
    if (error) return { error: error.message };
    revalidatePath("/billing/invoices");
    return { success: true, message: "Invoice voided" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}

// ============================================================
// UNIT ACTIONS
// ============================================================
export async function createUnit(formData: FormData) {
  const label = formData.get("label") as string;
  const unitTypeId = formData.get("unit_type_id") as string;
  const floor = parseInt(formData.get("floor") as string, 10);

  if (!label || !unitTypeId) return { error: "Label and unit type are required" };

  if (!isSupabaseConfigured()) {
    return { success: true, unit_id: "demo-unit-" + Date.now(), message: "Unit created (demo mode)" };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin");

    const { data: prop } = await supabase.from("properties").select("id").limit(1).single();
    if (!prop) return { error: "No property found" };

    const { data, error } = await supabase.from("units").insert({
      property_id: prop.id,
      unit_type_id: unitTypeId,
      label,
      floor,
      status: "vacant",
    }).select().single();

    if (error) return { error: error.message };
    revalidatePath("/properties/units");
    return { success: true, unit_id: data.id, message: "Unit created" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}

export async function updateUnitStatus(unitId: string, status: string) {
  if (!["vacant", "occupied", "under_maintenance", "reserved"].includes(status)) {
    return { error: "Invalid status" };
  }
  if (!isSupabaseConfigured()) {
    return { success: true, message: "Unit updated (demo mode)" };
  }
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin");

    const { error } = await supabase.from("units").update({ status }).eq("id", unitId);
    if (error) return { error: error.message };
    revalidatePath("/properties/units");
    return { success: true, message: "Unit status updated" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}

// ============================================================
// OCCUPANCY ACTIONS
// ============================================================
export async function createOccupancy(formData: FormData) {
  const unitId = formData.get("unit_id") as string;
  const personId = formData.get("person_id") as string;
  const type = formData.get("type") as string;
  const startDate = formData.get("start_date") as string;
  const endDate = formData.get("end_date") as string;

  if (!unitId || !personId || !type || !startDate) {
    return { error: "All required fields must be filled" };
  }
  if (!["tenancy", "ownership"].includes(type)) return { error: "Invalid occupancy type" };

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Occupancy created (demo mode)" };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin");

    const { data, error } = await supabase.from("occupancies").insert({
    unit_id: unitId,
    person_id: personId,
    type,
    start_date: startDate,
    end_date: endDate || null,
    status: "active",
  }).select().single();

  if (error) {
    if (error.message.includes("already has an active occupancy")) {
      return { error: "This unit already has an active occupancy. End the current occupancy first." };
    }
    return { error: error.message };
  }

  if (type === "tenancy" && data) {
    await supabase.from("leases").insert({
      occupancy_id: data.id,
      rent_amount: parseInt(formData.get("rent_amount") as string, 10) || 0,
      deposit_amount: parseInt(formData.get("deposit_amount") as string, 10) || 0,
      start_date: startDate,
      end_date: endDate || null,
      status: "active",
    });
  }

  if (type === "ownership" && data) {
    await supabase.from("ownership_records").insert({
      occupancy_id: data.id,
      purchase_date: startDate,
      service_charge_amount: parseInt(formData.get("service_charge_amount") as string, 10) || 0,
    });
  }

  await supabase.from("units").update({ status: "occupied" }).eq("id", unitId);

  revalidatePath("/properties/occupancies");
  revalidatePath("/properties/units");
  return { success: true, message: "Occupancy created" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}

export async function endOccupancy(occupancyId: string, endDate: string) {
  if (!isSupabaseConfigured()) {
    return { success: true, message: "Occupancy ended (demo mode)" };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin");

    const { data: occ } = await supabase.from("occupancies").select("unit_id").eq("id", occupancyId).single();

    const { error } = await supabase
      .from("occupancies")
      .update({ status: "ended", end_date: endDate })
      .eq("id", occupancyId);

    if (error) return { error: error.message };

    if (occ) {
      await supabase.from("leases").update({ status: "terminated" }).eq("occupancy_id", occupancyId);
      await supabase.from("units").update({ status: "vacant" }).eq("id", occ.unit_id);
    }

    revalidatePath("/properties/occupancies");
    revalidatePath("/properties/units");
    return { success: true, message: "Occupancy ended" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}

// ============================================================
// MAINTENANCE ACTIONS
// ============================================================
export async function createMaintenanceRequest(formData: FormData) {
  const unitId = formData.get("unit_id") as string;
  const description = formData.get("description") as string;

  if (!unitId || !description) return { error: "Unit and description are required" };

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Maintenance request submitted (demo mode)" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("maintenance_requests").insert({
    unit_id: unitId,
    raised_by: user?.id || null,
    description,
    status: "open",
  });

  if (error) return { error: error.message };
  revalidatePath("/maintenance");
  return { success: true, message: "Maintenance request submitted" };
}

export async function updateMaintenanceStatus(requestId: string, status: string, resolutionNotes?: string, cost?: number) {
  if (!["open", "in_progress", "resolved"].includes(status)) return { error: "Invalid status" };

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Request updated (demo mode)" };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin", "caretaker");

    const updateData: Record<string, unknown> = { status };
    if (resolutionNotes) updateData.resolution_notes = resolutionNotes;

    if (status === "resolved" && cost && cost > 0) {
      const ledgerId = await supabase.rpc("write_ledger_entry", {
        p_organization_id: (await supabase.from("properties").select("organization_id").limit(1).single()).data?.organization_id,
        p_type: "expense",
        p_category: "maintenance",
        p_amount: cost,
        p_description: `Maintenance cost — request ${requestId}`,
      });
      updateData.cost = cost;
      updateData.ledger_entry_id = ledgerId.data;
    }

    const { error } = await supabase.from("maintenance_requests").update(updateData).eq("id", requestId);
    if (error) return { error: error.message };
    revalidatePath("/maintenance");
    return { success: true, message: "Request updated" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}

// ============================================================
// PAYROLL ACTIONS
// ============================================================
export async function recordPayrollPaymentAction(staffVendorId: string, amount: number, notes?: string) {
  if (amount <= 0) return { error: "Amount must be positive" };

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Payroll payment recorded (demo mode)" };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin");

    const { error } = await supabase.rpc("record_payroll_payment", {
      p_staff_vendor_id: staffVendorId,
      p_amount: amount,
      p_notes: notes || null,
    });

    if (error) return { error: error.message };
    revalidatePath("/staff");
    revalidatePath("/ledger");
    return { success: true, message: "Payroll payment recorded" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}

// ============================================================
// STAFF ACTIONS
// ============================================================
export async function createStaffVendor(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const phone = formData.get("phone") as string;
  const schedule = formData.get("payment_schedule") as string;
  const amount = formData.get("amount") as string;

  if (!name || !role) return { error: "Name and role are required" };

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Staff added (demo mode)" };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin");

    const { data: prop } = await supabase.from("properties").select("organization_id").limit(1).single();

    const { error } = await supabase.from("staff_vendors").insert({
      organization_id: prop?.organization_id,
      name,
      role,
      phone: phone || null,
      payment_schedule: schedule || null,
      amount: amount ? parseInt(amount, 10) : null,
    });

    if (error) return { error: error.message };
    revalidatePath("/staff");
    return { success: true, message: "Staff added" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}

// ============================================================
// MESSAGE ACTIONS
// ============================================================
export async function sendMessage(recipientId: string, body: string) {
  if (!body.trim()) return { error: "Message cannot be empty" };

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Message sent (demo mode)" };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin", "caretaker", "tenant", "owner");

    const threadId = crypto.randomUUID();
    const { error } = await supabase.from("messages").insert({
      thread_id: threadId,
      sender_id: user.id,
      recipient_id: recipientId,
      body: body.trim(),
      channel: "in_app",
    });

    if (error) return { error: error.message };
    revalidatePath("/messages");
    return { success: true, message: "Message sent" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}

// ============================================================
// ANNOUNCEMENT ACTIONS
// ============================================================
export async function createAnnouncement(formData: FormData) {
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const audience = formData.get("audience") as string;

  if (!title || !body) return { error: "Title and message are required" };

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Announcement sent (demo mode)" };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin");

    const { data: prop } = await supabase.from("properties").select("organization_id").limit(1).single();

    const { error } = await supabase.from("announcements").insert({
      organization_id: prop?.organization_id,
      title,
      body,
      sent_to_all: audience === "all",
      sent_at: new Date().toISOString(),
    });

    if (error) return { error: error.message };
    revalidatePath("/announcements");
    return { success: true, message: "Announcement sent" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}

// ============================================================
// APPLICANT ACTIONS
// ============================================================
export async function createApplicant(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const unitId = formData.get("unit_id") as string;

  if (!name || !phone) return { error: "Name and phone are required" };

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Applicant added (demo mode)" };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin", "caretaker");

    const { data: person } = await supabase.from("people").insert({
      full_name: name,
      phone: phone.replace(/[\s\-\(\)]/g, ""),
    }).select().single();

    if (!person) return { error: "Failed to create person record" };

    const { error } = await supabase.from("applicants").insert({
      person_id: person.id,
      unit_id: unitId || null,
      status: "inquired",
    });

    if (error) return { error: error.message };
    revalidatePath("/properties/applicants");
    return { success: true, message: "Applicant added" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}

export async function updateApplicantStatus(applicantId: string, status: string) {
  if (!["inquired", "viewing", "approved", "rejected", "converted"].includes(status)) {
    return { error: "Invalid status" };
  }
  if (!isSupabaseConfigured()) {
    return { success: true, message: "Applicant updated (demo mode)" };
  }
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    requireRole(user, "admin");

    const { error } = await supabase.from("applicants").update({ status }).eq("id", applicantId);
    if (error) return { error: error.message };
    revalidatePath("/properties/applicants");
    return { success: true, message: "Applicant status updated" };
  } catch (e: any) {
    if (e.message?.includes("Unauthorized")) return { error: "Unauthorized" };
    throw e;
  }
}
