import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// M-Pesa C2B Confirmation URL - called by Safaricom after payment is confirmed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("C2B Confirmation received:", JSON.stringify(body));

    const {
      TransID,
      TransAmount,
      BillRefNumber,
      MSISDN,
      FirstName,
      LastName,
    } = body;

    const supabase = await createServiceClient();

    // Idempotency check
    if (TransID) {
      const { data: existing } = await supabase
        .from("payments")
        .select("id")
        .eq("mpesa_receipt", TransID)
        .single();

      if (existing) {
        console.log("Duplicate C2B confirmation:", TransID);
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
      }
    }

    const amountInCents = Math.round(parseFloat(TransAmount) * 100);

    // Try to match invoice by reference
    let matchedInvoiceId: string | null = null;
    let matchedInvoiceOccupancyId: string | null = null;
    let matchedInvoiceAmountPaid = 0;
    let matchedInvoiceAmountDue = 0;
    let matchedInvoiceNumber = "";
    let matchedInvoiceStatus = "";

    if (BillRefNumber) {
      const { data } = await supabase
        .from("invoices")
        .select("id, occupancy_id, amount_due, amount_paid, invoice_number, status")
        .eq("invoice_number", BillRefNumber)
        .in("status", ["pending", "partial", "overdue"])
        .single();

      if (data) {
        matchedInvoiceId = data.id;
        matchedInvoiceOccupancyId = data.occupancy_id;
        matchedInvoiceAmountPaid = data.amount_paid;
        matchedInvoiceAmountDue = data.amount_due;
        matchedInvoiceNumber = data.invoice_number;
        matchedInvoiceStatus = data.status;
      }
    }

    if (!matchedInvoiceId) {
      // Unmatched payment - log to exception queue
      console.log("Unmatched C2B payment:", { TransID, BillRefNumber, TransAmount });

      await supabase.from("payment_exceptions").insert({
        mpesa_receipt: TransID,
        amount: amountInCents,
        account_reference: BillRefNumber,
        raw_payload: body,
        reason: "No matching open invoice for reference: " + (BillRefNumber || "unknown"),
        status: "pending",
      });

      return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
    }

    // Record payment
    await supabase.from("payments").insert({
      invoice_id: matchedInvoiceId,
      amount: amountInCents,
      method: "mpesa_c2b",
      mpesa_receipt: TransID,
      status: "completed",
      paid_at: new Date().toISOString(),
      notes: `C2B payment from ${FirstName || ""} ${LastName || ""}`.trim(),
    });

    // Update invoice
    const newAmountPaid = matchedInvoiceAmountPaid + amountInCents;
    const newStatus =
      newAmountPaid >= matchedInvoiceAmountDue
        ? "paid"
        : newAmountPaid > 0
        ? "partial"
        : matchedInvoiceStatus;

    await supabase
      .from("invoices")
      .update({
        amount_paid: newAmountPaid,
        status: newStatus,
      })
      .eq("id", matchedInvoiceId);

    // Write ledger entry via RPC
    const { data: occupancyRows } = await supabase
      .from("occupancies")
      .select("type, unit_id")
      .eq("id", matchedInvoiceOccupancyId);

    const occupancy = occupancyRows?.[0];

    if (occupancy) {
      const ledgerCategory =
        occupancy.type === "tenancy" ? "rent" : "service_charge";

      const { data: unitData } = await supabase
        .from("units")
        .select("property_id")
        .eq("id", occupancy.unit_id)
        .single();

      if (unitData) {
        const { data: propData } = await supabase
          .from("properties")
          .select("organization_id")
          .eq("id", unitData.property_id)
          .single();

        if (propData) {
          await supabase.rpc("write_ledger_entry", {
            p_organization_id: propData.organization_id,
            p_type: "income",
            p_category: ledgerCategory,
            p_amount: amountInCents,
            p_description: `C2B payment ${TransID} — ${matchedInvoiceNumber}`,
            p_related_invoice_id: matchedInvoiceId,
          });
        }
      }
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("C2B Confirmation error:", error);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  }
}
