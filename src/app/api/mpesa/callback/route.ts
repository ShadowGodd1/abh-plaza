import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// M-Pesa callback handler - called by Safaricom after STK push completes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentId = request.nextUrl.searchParams.get("payment_id");

    const stkCallback = body?.Body?.stkCallback;
    if (!stkCallback) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
    }

    const supabase = await createClient();
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    if (resultCode === 0) {
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const mpesaReceipt = callbackMetadata.find(
        (item: { Name: string }) => item.Name === "MpesaReceiptNumber"
      )?.Value;

      if (!mpesaReceipt) {
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
      }

      if (paymentId) {
        const { data: pendingPayment } = await supabase
          .from("payments")
          .select("id, amount, invoice_id")
          .eq("id", paymentId)
          .eq("status", "pending")
          .single();

        if (pendingPayment) {
          await supabase.from("payments").delete().eq("id", paymentId);

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
        }
      }
    } else {
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

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  }
}
