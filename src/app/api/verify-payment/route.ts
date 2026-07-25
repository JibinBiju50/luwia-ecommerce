import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendCAPIPurchase } from "@/lib/meta-capi";
import Razorpay from "razorpay";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT } from "@/lib/product";
import { sendConfirmationEmail } from "@/lib/email";

export const maxDuration = 60; // 60 seconds timeout (Vercel Pro)

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Find the pending order and update to paid
    // The order was already created in /api/create-order with status "awaiting_payment"
    const { data: order, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        razorpay_payment_id,
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("payment_status", "awaiting_payment")
      .select("*")
      .single();

    if (updateError) {
      // Order might have already been updated by the webhook — check if it exists as paid
      const { data: existingOrder } = await supabaseAdmin
        .from("orders")
        .select("id, payment_status")
        .eq("razorpay_order_id", razorpay_order_id)
        .single();

      if (existingOrder?.payment_status === "paid") {
        // Webhook already processed it — that's fine
        return NextResponse.json({
          success: true,
          orderId: existingOrder.id,
        });
      }

      console.error("[verify-payment] Update error:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update order" },
        { status: 500 }
      );
    }

    // Trigger confirmation email
    try {
      await sendConfirmationEmail({
        orderId: order.id,
        customerName: order.customer_name,
        email: order.email,
        phone: order.phone,
        quantity: order.quantity,
        amount: order.amount_paid,
        paymentMethod: "online",
        address: `${order.address_line1}${
          order.address_line2 ? ", " + order.address_line2 : ""
        }, ${order.city}, ${order.state} - ${order.pincode}`,
        items: order.items,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    // Return success immediately
    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
