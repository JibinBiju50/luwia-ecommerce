import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const {
      orderId,
      customerName,
      email,
      phone,
      quantity,
      amount,
      paymentMethod,
      address,
    } = await request.json();

    const productName = "Luwia — Skin Bright & Repair (Pearl Radiance Cream)";
    const paymentLabel = paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online";

    // Customer confirmation email
    const customerEmailResponse = await resend.emails.send({
      from: "Luwia Skin Science <orders@luwia.in>",
      to: email,
      subject: `Order Confirmed! #${orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #F8F7FC;">
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(139,143,191,0.1);">
            <h1 style="color: #8B8FBF; font-size: 24px; margin-bottom: 8px;">Thank you, ${customerName}! ✨</h1>
            <p style="color: #6B7280; font-size: 14px;">Your order has been placed successfully.</p>

            <div style="background: #F8F7FC; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">Order Details</p>
              <table style="width: 100%; font-size: 14px; color: #1A1A2E;">
                <tr>
                  <td style="padding: 4px 0; color: #6B7280;">Order ID</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 600;">#${orderId.slice(0, 8).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #6B7280;">Product</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 600;">${productName}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #6B7280;">Quantity</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 600;">${quantity}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #6B7280;">Total</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 600;">₹${amount}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #6B7280;">Payment</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 600;">${paymentLabel}</td>
                </tr>
              </table>
            </div>

            <div style="background: #F8F7FC; border-radius: 12px; padding: 20px; margin: 16px 0;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">Delivery Address</p>
              <p style="margin: 0; font-size: 14px; color: #1A1A2E;">${address}</p>
            </div>

            <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">
              You'll receive tracking details once your order is dispatched. Estimated delivery: 3–7 business days.
            </p>

            <p style="color: #8B8FBF; font-size: 14px; font-weight: 600; margin-top: 24px;">
              Glow confidently. Glow with Luwia. ✨
            </p>
          </div>
        </div>
      `,
    });

    if (customerEmailResponse.error) {
      console.error("Customer email sending failed:", customerEmailResponse.error);
    }

    // Business notification email
    const businessEmailResponse = await resend.emails.send({
      from: "Luwia Orders <orders@luwia.in>",
      to: "luwiaskinscience@gmail.com",
      subject: `New Order #${orderId.slice(0, 8).toUpperCase()} — ${paymentLabel}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; padding: 24px;">
          <h2 style="color: #1A1A2E;">New Order Received 🎉</h2>
          <table style="width: 100%; font-size: 14px; color: #1A1A2E; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #6B7280;">Order ID</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">#${orderId.slice(0, 8).toUpperCase()}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #6B7280;">Customer</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">${customerName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #6B7280;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #6B7280;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">${phone}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #6B7280;">Product</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${productName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #6B7280;">Quantity</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">${quantity}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #6B7280;">Amount</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">₹${amount}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #6B7280;">Payment Method</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">${paymentLabel}</td></tr>
            <tr><td style="padding: 8px; color: #6B7280;">Address</td><td style="padding: 8px;">${address}</td></tr>
          </table>
        </div>
      `,
    });

    if (businessEmailResponse.error) {
      console.error("Business email sending failed:", businessEmailResponse.error);
      throw new Error("Failed to send business email: " + businessEmailResponse.error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
