import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function verifyWebhookSecret(request: NextRequest): boolean {
  const webhookSecret = process.env.MPESA_WEBHOOK_SECRET;
  if (!webhookSecret) return true;
  const authHeader = request.headers.get("authorization") || request.headers.get("X-M-Pesa-Secret");
  return authHeader === `Bearer ${webhookSecret}` || authHeader === webhookSecret;
}

// M-Pesa C2B Confirmation URL - called by Safaricom after payment is confirmed
export async function POST(request: NextRequest) {
  if (!verifyWebhookSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    const amountInCents = Math.round(parseFloat(TransAmount) * 100);

    // Try to match invoice by reference
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

    // Record payment via the centralized record_payment function
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
      console.error("record_payment failed for C2B:", error.message);
      // Still log to exceptions so we don't lose the payment
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
  } catch (error) {
    console.error("C2B Confirmation error:", error);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  }
}
