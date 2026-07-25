import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendCAPIPurchase } from "@/lib/meta-capi";
import { sendConfirmationEmail } from "@/lib/email";

export const maxDuration = 60; // 60 seconds timeout (Vercel Pro)

/**
 * Razorpay Webhook Handler
 *
 * This is the safety net for payment processing. Razorpay sends a POST
 * to this endpoint whenever a payment event occurs (e.g. payment.captured).
 *
 * Even if the customer closes their browser after paying, this webhook
 * ensures the order is marked as paid and confirmation emails are sent.
 *
 * Setup: In Razorpay Dashboard → Settings → Webhooks → Add New Webhook
 *   URL: https://luwia.in/api/webhooks/razorpay
 *   Events: payment.captured
 *   Secret: Set RAZORPAY_WEBHOOK_SECRET in your .env
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    console.log(`[Webhook] Received event: ${eventType}`);

    if (eventType === "payment.captured") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      // Find the pending order by razorpay_order_id
      const { data: existingOrder, error: fetchError } = await supabaseAdmin
        .from("orders")
        .select("id, payment_status, email, phone, customer_name, quantity, amount_paid, items")
        .eq("razorpay_order_id", razorpayOrderId)
        .single();

      if (fetchError || !existingOrder) {
        console.error(`[Webhook] No pending order found for razorpay_order_id: ${razorpayOrderId}`, fetchError);
        // Return 200 so Razorpay doesn't retry — order might have been created differently
        return NextResponse.json({ status: "order_not_found" });
      }

      // Only process if order is still awaiting payment (avoid double-processing)
      if (existingOrder.payment_status === "awaiting_payment") {
        // Update order status to paid
        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({
            payment_status: "paid",
            razorpay_payment_id: razorpayPaymentId,
          })
          .eq("id", existingOrder.id);

        if (updateError) {
          console.error("[Webhook] Failed to update order status:", updateError);
          // Return 500 so Razorpay retries
          return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
        }

        console.log(`[Webhook] Order ${existingOrder.id} marked as paid`);
      }

      // Send confirmation email (idempotent — Resend deduplicates by orderId in subject)
      try {
        const order = existingOrder;
        const addressParts = [];
        // We don't have the full address breakdown here, but the order has all fields
        // Fetch full order for address
        const { data: fullOrder } = await supabaseAdmin
          .from("orders")
          .select("address_line1, address_line2, city, state, pincode")
          .eq("id", order.id)
          .single();

        let address = "";
        if (fullOrder) {
          address = `${fullOrder.address_line1}${fullOrder.address_line2 ? ", " + fullOrder.address_line2 : ""}, ${fullOrder.city}, ${fullOrder.state} - ${fullOrder.pincode}`;
        }

        await sendConfirmationEmail({
          orderId: order.id,
          customerName: order.customer_name,
          email: order.email,
          phone: order.phone,
          quantity: order.quantity,
          amount: order.amount_paid,
          paymentMethod: "online",
          address,
          items: order.items,
        });
        console.log(`[Webhook] Confirmation email sent for order ${order.id}`);
      } catch (emailError) {
        console.error("[Webhook] Email trigger error:", emailError);
        // Don't fail the webhook for email errors
      }

      // Send Meta CAPI Purchase event
      try {
        await sendCAPIPurchase({
          eventId: existingOrder.id,
          email: existingOrder.email,
          phone: existingOrder.phone,
          amount: existingOrder.amount_paid,
          currency: "INR",
          contentIds: (existingOrder.items ?? []).map(
            (i: { productId: string }) => i.productId
          ),
          numItems: existingOrder.quantity,
        });
        console.log(`[Webhook] Meta CAPI event sent for order ${existingOrder.id}`);
      } catch (metaError) {
        console.error("[Webhook] Meta CAPI error:", metaError);
      }
    }

    // Always return 200 for recognized events to prevent Razorpay retries
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[Webhook] Unexpected error:", error);
    // Return 500 so Razorpay retries
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
