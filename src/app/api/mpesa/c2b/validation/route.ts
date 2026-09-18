import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// M-Pesa C2B Validation URL - called by Safaricom before accepting a payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { BillRefNumber } = body;

    const supabase = await createClient();

    if (BillRefNumber) {
      const { data: invoice } = await supabase
        .from("invoices")
        .select("id, status, amount_due, amount_paid")
        .eq("invoice_number", BillRefNumber)
        .in("status", ["pending", "partial", "overdue"])
        .single();

      if (!invoice) {
        return NextResponse.json({
          ResultCode: 0,
          ResultDesc: "Accepted",
        });
      }
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch {
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }
}
