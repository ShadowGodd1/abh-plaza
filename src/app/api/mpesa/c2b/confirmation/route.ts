import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// M-Pesa C2B Confirmation URL - called by Safaricom after payment is confirmed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      TransID,
      TransAmount,
      BillRefNumber,
      MSISDN,
      FirstName,
      LastName,
    } = body;

    const supabase = await createClient();
    const amountInCents = Math.round(parseFloat(TransAmount) * 100);

    let matchedInvoiceId: string | null = null;

    if (BillRefNumber) {
      const { data } = await supabase
        .from("invoices")
        .select("id")
        .eq("invoice_number", BillRefNumber)
        .in("status", ["pending", "partial", "overdue"])
        .single();

      if (data) {
        matchedInvoiceId = data.id;
      }
    }

    if (!matchedInvoiceId) {
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

    const { error } = await supabase.rpc("record_payment", {
      p_invoice_id: matchedInvoiceId,
      p_amount: amountInCents,
      p_method: "mpesa_c2b",
      p_mpesa_receipt: TransID || null,
      p_recorded_by: null,
      p_notes: `C2B payment from ${FirstName || ""} ${LastName || ""}`.trim() || null,
      p_phone: MSISDN || null,
    });

    if (error) {
      await supabase.from("payment_exceptions").insert({
        mpesa_receipt: TransID,
        amount: amountInCents,
        account_reference: BillRefNumber,
        raw_payload: body,
        reason: "record_payment failed: " + error.message,
        status: "pending",
      });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  }
}
