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

      if (paymentId) {
        // Get the pending payment to retrieve invoice_id and amount
        const { data: pendingPayment } = await supabase
          .from("payments")
          .select("id, amount, invoice_id")
          .eq("id", paymentId)
          .eq("status", "pending")
          .single();

        if (pendingPayment) {
          // Remove the pending payment record — record_payment will create a completed one
          await supabase.from("payments").delete().eq("id", paymentId);

          // Record payment via the centralized function
          const { error } = await supabase.rpc("record_payment", {
            p_invoice_id: pendingPayment.invoice_id,
            p_amount: pendingPayment.amount,
            p_method: "mpesa_stk",
            p_mpesa_receipt: mpesaReceipt,
            p_recorded_by: null,
            p_notes: `M-Pesa STK payment`,
            p_phone: null,
          });

          if (error) {
            console.error("record_payment failed for STK callback:", error.message);
          }
        } else {
          console.log("Pending payment not found for id:", paymentId);
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
