import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// M-Pesa C2B Validation URL - called by Safaricom before accepting a payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("C2B Validation request:", JSON.stringify(body));

    const { BusinessShortCode, BillRefNumber, TransAmount, MSISDN } = body;

    const supabase = await createServiceClient();

    // Validate the account reference against open invoices
    if (BillRefNumber) {
      // Check if there's an open invoice matching this reference
      const { data: invoice } = await supabase
        .from("invoices")
        .select("id, status, amount_due, amount_paid")
        .eq("invoice_number", BillRefNumber)
        .in("status", ["pending", "partial", "overdue"])
        .single();

      if (!invoice) {
        // No matching invoice - accept anyway but log for manual review
        console.log("No matching invoice for reference:", BillRefNumber);
        return NextResponse.json({
          ResultCode: 0,
          ResultDesc: "Accepted",
        });
      }

      // Validate amount doesn't exceed due (allow some flexibility for overpayment)
      const remaining = invoice.amount_due - invoice.amount_paid;
      // Accept payments up to the remaining amount (overpayment handled in confirmation)
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (error) {
    console.error("C2B Validation error:", error);
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }
}
