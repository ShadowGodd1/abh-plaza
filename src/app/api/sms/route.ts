import { NextRequest, NextResponse } from "next/server";

// SMS notification endpoint
export async function POST(request: NextRequest) {
  try {
    const { to, message, template_key, language = "en" } = await request.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, message" },
        { status: 400 }
      );
    }

    // Normalize phone number
    const normalizedPhone = to.replace(/[\s\-\(\)]/g, "");
    if (!/^254[0-9]{9}$/.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "Invalid Kenyan phone number" },
        { status: 400 }
      );
    }

    // Africa's Talking configuration
    const atApiKey = process.env.AT_API_KEY;
    const atUsername = process.env.AT_USERNAME;
    const atSenderId = process.env.AT_SENDER_ID;

    if (!atApiKey || !atUsername) {
      return NextResponse.json(
        { error: "SMS configuration missing" },
        { status: 500 }
      );
    }

    // Send SMS via Africa's Talking API
    const formData = new URLSearchParams();
    formData.append("username", atUsername);
    formData.append("to", normalizedPhone);
    formData.append("message", message);
    if (atSenderId) {
      formData.append("from", atSenderId);
    }

    const response = await fetch(
      "https://api.africastalking.com/version1/messaging",
      {
        method: "POST",
        headers: {
          apiKey: atApiKey,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData.toString(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("SMS send failed:", data);
      return NextResponse.json(
        { error: "SMS delivery failed", details: data },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      recipients: data.SMSMessageData?.Recipients || [],
    });
  } catch (error) {
    console.error("SMS API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
