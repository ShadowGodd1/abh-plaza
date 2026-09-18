import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// M-Pesa STK Push initiation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoice_id, phone_number, amount } = body;

    if (!invoice_id || !phone_number || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: invoice_id, phone_number, amount" },
        { status: 400 }
      );
    }

    // Validate phone number format (Kenyan)
    const normalizedPhone = phone_number.replace(/[\s\-\(\)]/g, "");
    if (!/^254[0-9]{9}$/.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "Invalid Kenyan phone number" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoice_id)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    if (invoice.status === "paid" || invoice.status === "void") {
      return NextResponse.json(
        { error: "Invoice cannot be paid" },
        { status: 400 }
      );
    }

    // Check for existing pending STK push on this invoice (double submission protection)
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id")
      .eq("invoice_id", invoice_id)
      .eq("status", "pending")
      .eq("method", "mpesa_stk")
      .single();

    if (existingPayment) {
      return NextResponse.json(
        { error: "Payment request already in progress" },
        { status: 409 }
      );
    }

    // Get M-Pesa credentials from environment
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;

    if (!consumerKey || !consumerSecret || !shortcode || !passkey || !callbackUrl) {
      return NextResponse.json(
        { error: "M-Pesa configuration missing" },
        { status: 500 }
      );
    }

    // Generate OAuth token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const tokenResponse = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: "Failed to authenticate with M-Pesa" },
        { status: 502 }
      );
    }

    const { access_token } = await tokenResponse.json();

    // Generate timestamp and password
    const now = new Date();
    const timestamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0"),
    ].join("");

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // Create pending payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        invoice_id,
        amount,
        method: "mpesa_stk",
        status: "pending",
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (paymentError) {
      return NextResponse.json(
        { error: "Failed to create payment record" },
        { status: 500 }
      );
    }

    // Initiate STK Push
    const stkResponse = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount / 100, // Convert cents to shillings
          PartyA: normalizedPhone,
          PartyB: shortcode,
          PhoneNumber: normalizedPhone,
          CallBackURL: `${callbackUrl}?payment_id=${payment.id}`,
          AccountReference: invoice.invoice_number,
          TransactionDesc: `Payment for ${invoice.invoice_number}`,
        }),
      }
    );

    const stkData = await stkResponse.json();

    if (stkData.ResponseCode !== "0") {
      // Update payment status to failed
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("id", payment.id);

      return NextResponse.json(
        { error: stkData.CustomerMessage || "STK Push failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      checkout_request_id: stkData.CheckoutRequestID,
      message: "Payment request sent to your phone",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
