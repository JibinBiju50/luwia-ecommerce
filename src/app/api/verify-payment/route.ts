import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendCAPIPurchase } from "@/lib/meta-capi";
import Razorpay from "razorpay";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT } from "@/lib/product";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
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

    if (!orderDetails || !orderDetails.items || !Array.isArray(orderDetails.items)) {
      return NextResponse.json({ success: false, error: "Invalid order details" }, { status: 400 });
    }

    // Fetch the actual order from Razorpay to know how much was ACTUALLY paid
    const rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
    const actualAmountPaid = Number(rzpOrder.amount) / 100; // Razorpay returns paise

    // Calculate the total value of the items they CLAIM to have bought
    let serverTotal = 0;
    for (const item of orderDetails.items) {
      let productPrice = 0;
      const found = PRODUCTS.find((p) => p.id === item.productId);
      if (found) {
        productPrice = found.onlinePrice;
      } else if (item.productId === "luwia-cream" || item.productId === "default") {
        productPrice = PRODUCT.onlinePrice;
      }
      
      if (!productPrice) {
        return NextResponse.json({ success: false, error: "Invalid product in order" }, { status: 400 });
      }
      serverTotal += productPrice * item.quantity;
    }

    // If the value of the items doesn't perfectly match what they actually paid, they tampered with the payload!
    if (serverTotal !== actualAmountPaid) {
      console.error(`[verify-payment] TAMPERING DETECTED! User claimed items worth ${serverTotal} but only paid ${actualAmountPaid}`);
      return NextResponse.json({ success: false, error: "Data integrity check failed" }, { status: 400 });
    }

    // Override the client's claimed amount with the truth from Razorpay
    const safeAmount = actualAmountPaid;

    // Save order to Supabase
    const { data: order, error: dbError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: orderDetails.fullName,
        email: orderDetails.email,
        phone: orderDetails.phone,
        address_line1: orderDetails.addressLine1,
        address_line2: orderDetails.addressLine2 || null,
        city: orderDetails.city,
        state: orderDetails.state,
        pincode: orderDetails.pincode,
        quantity: orderDetails.quantity,
        amount_paid: safeAmount,
        items: orderDetails.items,
        payment_method: "online",
        razorpay_payment_id,
        razorpay_order_id,
        payment_status: "paid",
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, error: "Failed to save order" },
        { status: 500 }
      );
    }

    // Trigger confirmation email (fire and forget)
    try {
      await fetch(new URL("/api/send-confirmation", request.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          customerName: orderDetails.fullName,
          email: orderDetails.email,
          phone: orderDetails.phone,
          quantity: orderDetails.quantity,
          amount: safeAmount,
          paymentMethod: "online",
          address: `${orderDetails.addressLine1}${
            orderDetails.addressLine2 ? ", " + orderDetails.addressLine2 : ""
          }, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}`,
          items: orderDetails.items,
        }),
      });
    } catch (emailError) {
      console.error("Email trigger error:", emailError);
      // Don't fail the order if email fails
    }

    // Send Purchase event via Meta Conversions API
    // Must be awaited — serverless functions shut down immediately after response
    await sendCAPIPurchase({
      eventId: order.id,
      email: orderDetails.email,
      phone: orderDetails.phone,
      amount: safeAmount,
      currency: "INR",
      contentIds: (orderDetails.items ?? []).map(
        (i: { productId: string }) => i.productId
      ),
      numItems: orderDetails.quantity,
    });

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
