import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// M-Pesa callback handler - called by Safaricom after STK push completes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentId = request.nextUrl.searchParams.get("payment_id");

    // Log raw payload for replay capability
    console.log("M-Pesa callback received:", JSON.stringify(body));

    const stkCallback = body?.Body?.stkCallback;
    if (!stkCallback) {
      console.error("Invalid callback format:", body);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
    }

    const supabase = await createServiceClient();
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const mpesaReceipt = callbackMetadata.find(
        (item: { Name: string }) => item.Name === "MpesaReceiptNumber"
      )?.Value;

      if (!mpesaReceipt) {
        console.error("No receipt number in callback:", callbackMetadata);
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
      }

      // Idempotency check: check for existing payment with this receipt
      const { data: existingPayment } = await supabase
        .from("payments")
        .select("id")
        .eq("mpesa_receipt", mpesaReceipt)
        .single();

      if (existingPayment) {
        console.log("Duplicate callback for receipt:", mpesaReceipt);
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
      }

      // Update payment record
      if (paymentId) {
        const { data: payment } = await supabase
          .from("payments")
          .select("id, amount, invoice_id")
          .eq("id", paymentId)
          .single();

        const { data: invoice } = payment
          ? await supabase
              .from("invoices")
              .select("id, occupancy_id, amount_due, amount_paid, invoice_number, status")
              .eq("id", payment.invoice_id)
              .single()
          : { data: null };

        if (payment && invoice) {
          // Update payment with receipt
          await supabase
            .from("payments")
            .update({
              mpesa_receipt: mpesaReceipt,
              status: "completed",
              paid_at: new Date().toISOString(),
            })
            .eq("id", paymentId);

          // Update invoice status and amount_paid
          const newAmountPaid = invoice.amount_paid + payment.amount;
          const newStatus =
            newAmountPaid >= invoice.amount_due
              ? "paid"
              : newAmountPaid > 0
              ? "partial"
              : invoice.status;

          await supabase
            .from("invoices")
            .update({
              amount_paid: newAmountPaid,
              status: newStatus,
            })
            .eq("id", payment.invoice_id);

          // Write ledger entry
          const { data: occupancyRows } = await supabase
            .from("occupancies")
            .select("type")
            .eq("id", invoice.occupancy_id);

          const occupancy = occupancyRows?.[0];

          if (occupancy) {
            const ledgerCategory =
              occupancy.type === "tenancy" ? "rent" : "service_charge";

            const { data: unitRows } = await supabase
              .from("occupancies")
              .select("unit_id")
              .eq("id", invoice.occupancy_id);

            const unitId = unitRows?.[0]?.unit_id;
            if (unitId) {
              const { data: unitData } = await supabase
                .from("units")
                .select("property_id")
                .eq("id", unitId)
                .single();

              if (unitData) {
                const { data: propRows } = await supabase
                  .from("properties")
                  .select("organization_id")
                  .eq("id", unitData.property_id)
                  .single();

                if (propRows) {
                  await supabase.rpc("write_ledger_entry", {
                    p_organization_id: propRows.organization_id,
                    p_type: "income",
                    p_category: ledgerCategory,
                    p_amount: payment.amount,
                    p_description: `M-Pesa payment ${mpesaReceipt} — ${invoice.invoice_number}`,
                    p_related_invoice_id: payment.invoice_id,
                  });
                }
              }
            }
          }
        }
      }
    } else {
      // Payment failed or cancelled
      console.log("M-Pesa payment failed:", resultDesc);

      if (paymentId) {
        await supabase
          .from("payments")
          .update({
            status: "failed",
            notes: resultDesc,
          })
          .eq("id", paymentId);
      }
    }

    // Always acknowledge receipt to Safaricom
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("Callback processing error:", error);
    // Still acknowledge to prevent Safaricom from retrying
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  }
}
